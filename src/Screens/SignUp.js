import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { Images } from "../Constants/Images";
import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import Loader from "../Components/Loader"; // Import Loader component if you have one

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    if (!selectedRole) {
      Alert.alert("Please select a role");
      return;
    }
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = response.user;

      // Save user data to Firestore
      await setDoc(doc(FIRESTORE_DB, "users", user.uid), {
        email,
        selectedRole,
      });
      sendEmailVerification(response.user);
      Alert.alert(
        "Account created successfully",
        `Verify email through the link we sent to ${email}`
      );
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      Alert.alert("Sign Up failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Loader loading={loading} />
        <View style={{ marginBottom: 50 }}>
          <Text style={styles.text}>Create an </Text>
          <Text style={styles.text}>account</Text>
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
            placeholder="Confirm Password"
            placeholderTextColor="#A8A8A9"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              paddingLeft: 15,
              justifyContent: "center",
            },
          ]}
        >
          <RNPickerSelect
            onValueChange={(value) => setSelectedRole(value)}
            placeholder={{
              label: "Select your role",
              value: null,
              color: "#A8A8A9",
            }}
            items={[
              { label: "Player", value: "player" },
              { label: "Vendor", value: "vendor" },
            ]}
            style={pickerSelectStyles}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          onPress={signUp}
        >
          <Text style={styles.buttonText}>Create Account</Text>
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
            I Already Have an Account
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat 400",
                color: "#F83758",
              }}
            >
              {"  "}Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
    fontFamily: "Montserrat 500",
    color: "#676767",
    height: "100%",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  inputAndroid: {
    fontSize: 12,
    fontFamily: "Montserrat 500",
    color: "#676767",
    height: "100%",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 60,
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
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Montserrat 600",
    color: WHITE,
  },
});

export default SignUp;
