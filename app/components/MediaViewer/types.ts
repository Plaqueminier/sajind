export interface MediaAssetType {
  id: string;
  uri: string;
  mediaType: string;
}

export type SwipeState = "none" | "keep" | "delete";

export interface ActionButtonsProps {
  onKeep: () => void;
  onDelete: () => void;
  disabled: boolean;
}

export interface SwipeIndicatorProps {
  swipeState: SwipeState;
}

export interface MediaCardProps {
  uri: string;
  panGesture: any; // Gesture type from react-native-gesture-handler
  animatedStyle: any; // AnimatedStyle type from react-native-reanimated
}

export interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export interface PermissionRequestProps {
  onRequestPermission: () => void;
} 