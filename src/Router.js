import Welcome from "./Screens/Welcome";
import Login from "./Screens/Login";
import Forget from "./Screens/Forget";
import SignUp from "./Screens/SignUp";
import Welcometwo from "./Screens/Welcometwo";
import PlayerHome from "./Screens/PlayerHome";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { useState, useEffect } from "react";
import { GRADIENT_1 } from "./Constants/Colors";

export const CustomStatusBar = ({
  backgroundColor,
  barStyle = "light-content",
}) => {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={[GRADIENT_1, GRADIENT_1]}
      start={[1, 1]}
      end={[0, 0]}
      location={[0.25, 0.7, 1]}
      style={{
        height: insets.top,
      }}
    >
      <View style={{ backgroundColor, height: insets.top }}>
        <StatusBar
          animated={true}
          translucent={true}
          backgroundColor={backgroundColor}
          barStyle={barStyle}
        />
      </View>
    </LinearGradient>
  );
};
const Stack = createNativeStackNavigator();

const Router = () => {
  const [initialRouteName, setInitialRouteName] = useState("Welcome");
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <CustomStatusBar backgroundColor="transparent" />
        <Stack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{
            headerShown: false,
            animation: "none",
          }}
        >
          {/* <Stack.Screen name="AppSplashScreen" component={AppSplashScreen} /> */}
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Forget" component={Forget} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Welcometwo" component={Welcometwo} />
          <Stack.Screen name="PlayerHome" component={PlayerHome} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Router;