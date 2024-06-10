import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Modal } from "react-native";
import { GRADIENT_1 } from "../Constants/Colors";

export default function Loader({ loading }) {
  return (
    <Modal transparent={true} visible={loading} animationType="fade">
      <View
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={GRADIENT_1} />
      </View>
    </Modal>
  );
}
