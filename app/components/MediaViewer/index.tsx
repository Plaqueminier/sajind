import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, Alert, Dimensions } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

// Imported styles and types
import { styles } from "./styles/styles";
import { MediaAssetType, SwipeState } from "./types";

// Imported components
import ActionButtons from "./components/ActionButtons";
import SwipeIndicator from "./components/SwipeIndicator";
import MediaCard from "./components/MediaCard";
import ErrorState from "./components/ErrorState";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import PermissionRequest from "./components/PermissionRequest";

// Import storage service
import { StorageService } from "../../services/StorageService";

const { width } = Dimensions.get("window");

export default function MediaViewer() {
  // State management
  const [currentAsset, setCurrentAsset] = useState<MediaAssetType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [swipeState, setSwipeState] = useState<SwipeState>("none");

  // Animated values with safe defaults
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  // Reset animation safely
  const resetAnimation = useCallback(() => {
    translateX.value = 0;
    rotate.value = 0;
    setSwipeState("none");
  }, [translateX, rotate]);

  // Handle successful keep action
  const handleKeep = useCallback(async () => {
    if (isProcessing || !currentAsset) return;
    setIsProcessing(true);

    try {
      // Add current asset to kept list
      await StorageService.addKeptMedia({
        id: currentAsset.id,
        uri: currentAsset.uri,
        mediaType: currentAsset.mediaType,
      });

      Alert.alert("Kept", "Image has been kept in your collection", [
        {
          text: "OK",
          onPress: () => {
            resetAnimation();
            setTimeout(() => {
              loadLatestMedia();
              setIsProcessing(false);
            }, 100);
          },
        },
      ]);
    } catch (error) {
      console.error("Error keeping media:", error);
      Alert.alert("Error", "Failed to keep the image");
      setIsProcessing(false);
      resetAnimation();
    }
  }, [isProcessing, resetAnimation, currentAsset]);

  // Handle successful delete action
  const handleDelete = useCallback(async () => {
    if (isProcessing || !currentAsset) return;
    setIsProcessing(true);

    try {
      // Add current asset to deleted list
      await StorageService.addDeletedMedia({
        id: currentAsset.id,
        uri: currentAsset.uri,
        mediaType: currentAsset.mediaType,
      });

      Alert.alert("Deleted", "Image has been marked for deletion", [
        {
          text: "OK",
          onPress: () => {
            resetAnimation();
            setTimeout(() => {
              loadLatestMedia();
              setIsProcessing(false);
            }, 100);
          },
        },
      ]);
    } catch (error) {
      console.error("Error deleting media:", error);
      Alert.alert("Error", "Failed to delete the image");
      setIsProcessing(false);
      resetAnimation();
    }
  }, [isProcessing, resetAnimation, currentAsset]);

  // Create a pan gesture handler for swipe functionality
  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onUpdate((event) => {
        if (isProcessing) return;

        // Calculate a smaller movement for more control
        translateX.value = event.translationX * 0.8;

        // Calculate rotation - max of 6 degrees converted to radians
        const maxRotation = 6 * (Math.PI / 180);
        rotate.value = (translateX.value / (width * 0.8)) * maxRotation;

        // Update swipe state UI feedback
        if (translateX.value > 80) {
          runOnJS(setSwipeState)("keep");
        } else if (translateX.value < -80) {
          runOnJS(setSwipeState)("delete");
        } else {
          runOnJS(setSwipeState)("none");
        }
      })
      .onEnd(() => {
        if (isProcessing) return;

        // Check if we've crossed the threshold for action
        if (translateX.value > 100) {
          runOnJS(handleKeep)();
        } else if (translateX.value < -100) {
          runOnJS(handleDelete)();
        } else {
          // Spring back to center if not a significant swipe
          translateX.value = withSpring(0);
          rotate.value = withSpring(0);
          runOnJS(setSwipeState)("none");
        }
      });
  }, [isProcessing, handleKeep, handleDelete, translateX, rotate]);

  // Define animated styles for the swipeable card
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}rad` },
    ],
  }));

  // Set up permissions and load initial media
  useEffect(() => {
    async function setupPermissionsAndLoadMedia() {
      try {
        if (!permissionResponse?.granted) {
          const permission = await requestPermission();
          if (!permission.granted) {
            setError("Permission to access photos not granted");
            return;
          }
        }
        await loadLatestMedia();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    }

    setupPermissionsAndLoadMedia();
  }, [permissionResponse?.granted]);

  // Function to safely load media
  const loadLatestMedia = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get latest assets not already kept or deleted
      let assetsFound = false;
      let skipCount = 0;
      let currentAssetToShow = null;

      while (!assetsFound && skipCount < 50) {
        // limit to avoid infinite loop
        const assets = await MediaLibrary.getAssetsAsync({
          first: 5, // Get 5 at a time to check
          sortBy: ["creationTime"],
          mediaType: ["photo"],
          after: skipCount > 0 ? skipCount.toString() : undefined,
        });

        if (!assets || !assets.assets || assets.assets.length === 0) {
          break; // No more assets to check
        }

        // Try to find an asset that hasn't been processed yet
        for (const asset of assets.assets) {
          const [isKept, isDeleted] = await Promise.all([
            StorageService.isMediaKept(asset.id),
            StorageService.isMediaDeleted(asset.id),
          ]);

          if (!isKept && !isDeleted) {
            // Found an unprocessed asset
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
            if (assetInfo) {
              currentAssetToShow = {
                id: assetInfo.id,
                uri: assetInfo.localUri || assetInfo.uri,
                mediaType: assetInfo.mediaType,
              };
              assetsFound = true;
              break;
            }
          }
        }

        if (!assetsFound) {
          skipCount += assets.assets.length;
        }
      }

      if (currentAssetToShow) {
        setCurrentAsset(currentAssetToShow);
      } else {
        setCurrentAsset(null);
        setError("No more unprocessed photos found");
      }
    } catch (err) {
      console.error("Media loading error:", err);
      setError("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  // Permission request UI
  if (!permissionResponse?.granted) {
    return <PermissionRequest onRequestPermission={requestPermission} />;
  }

  // Loading UI
  if (loading) {
    return <LoadingState />;
  }

  // Error UI
  if (error) {
    return <ErrorState error={error} onRetry={loadLatestMedia} />;
  }

  // No photos UI
  if (!currentAsset) {
    return <EmptyState />;
  }

  // Main UI
  return (
    <View style={styles.container}>
      {/* Swipe indicator */}
      <SwipeIndicator swipeState={swipeState} />

      {/* Media card with swipe gesture */}
      <MediaCard
        uri={currentAsset.uri}
        panGesture={panGesture}
        animatedStyle={animatedStyle}
      />

      {/* Instruction text */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          Swipe left to delete, right to keep
        </Text>
      </View>

      {/* Alternative action buttons */}
      <ActionButtons
        onKeep={handleKeep}
        onDelete={handleDelete}
        disabled={isProcessing}
      />
    </View>
  );
}
