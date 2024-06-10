import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { Images } from "../Constants/Images";
import { useNavigation } from "@react-navigation/native";
import Loader from "../Components/Loader";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const Forget = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleForgotPassword = async () => {
    setLoading(true);
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);

        Alert.alert(
          "Check your email",
          "If you entered a correct email \n A link to reset your password has been sent to your email address."
        );
        navigation.navigate("Login");
      } catch (error) {
        console.log(error);
        Alert.alert("Reset failed", error.message);
      }
    } else {
      Alert.alert("Input required", "Please enter your email address.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
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
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.button}
        onPress={handleForgotPassword}
      >
        <Text style={styles.buttonText}>Submit</Text>
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
