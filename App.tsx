import React, { useRef, useEffect, useState } from "react";
import {
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
  BackHandler,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import NetInfo from "@react-native-community/netinfo";
import OfflineNotice from "./components/OfflineNotice";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
});

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Function to handle back navigation
  const handleBackPress = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true; // Prevents app from closing
    }
    return false;
  };

  // Function to check network connection
  const checkConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected !== null ? state.isConnected : false);
    } catch (error) {
      console.error("Error checking network connection:", error);
      setIsConnected(false);
    }
  };

  // Function to retry connection
  const handleRetry = () => {
    checkConnection();
  };

  useEffect(() => {
    // Initial network check
    checkConnection();

    // Set up network change listener
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected !== null ? state.isConnected : false);
    });

    // Set up back button handler for Android
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        unsubscribe();
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }

    // For iOS and other platforms just return the netinfo unsubscribe
    return () => {
      unsubscribe();
    };
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      {isConnected ? (
        <WebView
          ref={webViewRef}
          source={{ uri: "https://www.thaana.ai/" }}
          allowsBackForwardNavigationGestures={true} // Enables swipe gestures on iOS
          onNavigationStateChange={(navState) =>
            setCanGoBack(navState.canGoBack)
          }
          // Google OAuth fix for WebView.
          // Due to Google OAuth not working in WebView, we need to set a user agent.
          userAgent={
            Platform.OS === "android"
              ? "Chrome/18.0.1025.133 Mobile Safari/535.19"
              : "AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75"
          }
        />
      ) : (
        <OfflineNotice onRetry={handleRetry} />
      )}
    </SafeAreaView>
  );
}
