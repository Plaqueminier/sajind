import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MediaViewer from "./components/MediaViewer";
import MediaHistory from "./components/MediaHistory";

type TabName = "viewer" | "history";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>("viewer");

  const renderContent = () => {
    switch (activeTab) {
      case "viewer":
        return <MediaViewer />;
      case "history":
        return <MediaHistory />;
      default:
        return <MediaViewer />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        {renderContent()}
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "viewer" && styles.activeTab
          ]}
          onPress={() => setActiveTab("viewer")}
        >
          <Text style={[
            styles.tabText,
            activeTab === "viewer" && styles.activeTabText
          ]}>
            Organize
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "history" && styles.activeTab
          ]}
          onPress={() => setActiveTab("history")}
        >
          <Text style={[
            styles.tabText,
            activeTab === "history" && styles.activeTabText
          ]}>
            History
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#121212",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: "#007AFF",
  },
  tabText: {
    color: "#888",
    fontSize: 14,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "500",
  },
});
