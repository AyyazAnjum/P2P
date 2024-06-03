import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { WHITE } from "../Constants/Colors";
import { Images } from "../Constants/Images";
import Sidebar from "../Components/Sidebar";

const PlayerHome = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          marginTop: 20,
        }}
      >
        <TouchableOpacity onPress={() => setShowSidebar(true)}>
          <Image source={Images.menu} />
        </TouchableOpacity>

        <Text style={styles.text}>Welcome </Text>
        <Image source={Images.smalluser} style={{ height: 32, width: 32 }} />
      </View>
      <Sidebar
        Player={showSidebar}
        show={showSidebar}
        onTouchOverlay={() => {
          setShowSidebar(!showSidebar);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  text: {
    fontSize: 20,
  },
});

export default PlayerHome;
