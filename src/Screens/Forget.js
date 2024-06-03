import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { Images } from "../Constants/Images";
import { useNavigation } from "@react-navigation/native";

const Forget = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 50 }}>
        <Text style={styles.text}>Forgot </Text>
        <Text style={styles.text}>password? </Text>
      </View>
      <View
        style={[
          styles.inputContainer,
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingLeft: 10,
          },
        ]}
      >
        <Image source={Images.mail} style={{ height: 16, width: 20 }} />
        <TextInput
          placeholder="Enter your email address"
          placeholderTextColor="#A8A8A9"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <Text
        style={{
          fontFamily: "Montserrat 400",
          fontSize: 12,
          color: "#676767",
          marginTop: 10,
        }}
      >
        <Text style={styles.redAsterisk}>*</Text> We will send you a message to
        set or reset your new password
      </Text>
      <TouchableOpacity activeOpacity={0.5} style={styles.button}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 10,
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: "center",
  },
  text: {
    fontSize: 36,
    fontFamily: "Montserrat 700",
  },
  inputContainer: {
    borderColor: "#A8A8A9",
    borderWidth: 1,
    marginBottom: 20,
    height: 55,
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
  },
  input: {
    fontSize: 12,
    fontFamily: "Montserrat 500",
    color: "#676767",
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: GRADIENT_1,
    height: 55,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Montserrat 600",
    color: WHITE,
  },
  redAsterisk: {
    color: "red",
  },
});

export default Forget;
