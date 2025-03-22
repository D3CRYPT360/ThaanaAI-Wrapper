import React, { useRef, useEffect, useState } from "react";
import {
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
  BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
});

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Function to handle back navigation
  const handleBackPress = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true; // Prevents app from closing
    }
    return false;
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: "https://www.thaana.ai/" }}
        allowsBackForwardNavigationGestures={true} // Enables swipe gestures on iOS
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)} // Track back navigation state
        userAgent={
          Platform.OS === "android"
            ? "Chrome/18.0.1025.133 Mobile Safari/535.19"
            : "AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75"
        }
      />
    </SafeAreaView>
  );
}
