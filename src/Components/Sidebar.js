import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import SidebarContent from "./SidebarContent";

const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;

const Sidebar = ({ show, onTouchOverlay, Player, Vendor, Admin }) => {
  const insets = useSafeAreaInsets();
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [containerAnimation, setContainerAnimation] = useState(
    new Animated.Value(-300)
  );
  // const [sidebarContent, setSidebarcontent] = useState(false);

  useEffect(() => {
    if (show) {
      Animated.parallel([
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(containerAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(containerAnimation, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [show]);

  const handleOnTouchOverlay = () => {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(containerAnimation, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onTouchOverlay());
  };

  const translateX = containerAnimation;

  return (
    <>
      {show ? (
        <>
          {/* <StatusBar hidden={true} /> */}
          <View
            style={[
              styles.sidebar,
              { height: Height },
              show ? styles.overlay : null,
            ]}
          >
            <TouchableOpacity
              onPress={handleOnTouchOverlay}
              style={[styles.sidebarOverlayButton]}
            />
            <Animated.View
              style={[
                styles.container,
                { height: Height },
                { transform: [{ translateX }] },
              ]}
            >
              <SidebarContent
                show={Player}
                staff={Vendor}
                admin={Admin}
                close={handleOnTouchOverlay}
              />
            </Animated.View>
          </View>
        </>
      ) : (
        ""
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    position: "absolute",

    width: Width,
    zIndex: 4,
    backgroundColor: "rgba(55, 55, 55, 0.84)",
  },
  sidebarOverlayButton: {
    height: Height,
    width: Width,
    position: "absolute",
  },
  container: {
    width: 300,
    position: "absolute",
    zIndex: 5,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
export default Sidebar;
