import React, { useEffect } from "react";
import { Text, TextInput } from "react-native";
import Router from "./src/Router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.maxFontSizeMultiplier = 1;
TextInput.defaultProps = Text.defaultProps || {};
TextInput.defaultProps.maxFontSizeMultiplier = 1;

export default function App() {
  const [fontsLoaded] = useFonts({
    "Montserrat 100": require("./assets/fonts/Montserrat-Thin.ttf"),
    "Montserrat 200": require("./assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat 300": require("./assets/fonts/Montserrat-Light.ttf"),
    "Montserrat 400": require("./assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat 500": require("./assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat 600": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat 700": require("./assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat 800": require("./assets/fonts/Montserrat-ExtraBold.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
    return <Router />;
  }
}
