import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { Images } from "../Constants/Images";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 50 }}>
        <Text style={styles.text}>Welcome</Text>
        <Text style={styles.text}>Back!</Text>
      </View>

      <View
        style={[
          styles.inputContainer,
          { flexDirection: "row", alignItems: "center", gap: 10 },
        ]}
      >
        <Image source={Images.user} style={{ height: 24, width: 24 }} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#A8A8A9"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View
        style={[
          styles.inputContainer,
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 13,
            paddingLeft: 15,
          },
        ]}
      >
        <Image source={Images.pass} style={{ height: 20, width: 16 }} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#A8A8A9"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Forget")}
        activeOpacity={0.5}
      >
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Montserrat 400",
            alignSelf: "flex-end",
            color: "#F83758",
            marginBottom: 40,
          }}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("PlayerHome")}
        style={{
          backgroundColor: GRADIENT_1,
          height: 55,
          borderRadius: 4,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{ fontSize: 16, fontFamily: "Montserrat 600", color: WHITE }}
        >
          Login
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 70,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Montserrat 400",
            color: "#575757",
          }}
        >
          Don't Have An Account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Montserrat 400",
              color: "#F83758",
            }}
          >
            {"  "}Sign Up
          </Text>
        </TouchableOpacity>
      </View>
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
    // justifyContent: "center",
    paddingLeft: 10,
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
});

export default Login;
