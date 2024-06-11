import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Images } from "../Constants/Images";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as mime from "mime";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import RNPickerSelect from "react-native-picker-select";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loader from "../Components/Loader";
import { GRADIENT_1 } from "../Constants/Colors";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigation();
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access the photo library to pick an image.",
          [{ text: "OK" }]
        );
      }
    })();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("User not logged in.");
        }

        const userDoc = await getDoc(
          doc(FIRESTORE_DB, "users", currentUser.uid)
        );
        if (!userDoc.exists()) {
          throw new Error("User document does not exist.");
        }

        const userData = userDoc.data();
        setName(userData.username || "");
        setEmail(userData.email || "");
        setPhone(userData.phone || "");
        setAddress(userData.address || "");
        setGender(userData.gender || "");
        setImage(userData.image || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        throw new Error(
          "Permission to access the photo library was not granted."
        );
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled) {
        console.log("Image picking cancelled.");
        return;
      }
      const uri = result?.uri ?? result?.assets?.[0]?.uri;
      if (!uri) {
        throw new Error("Image URI is null or undefined.");
      }
      setImage(uri);
    } catch (error) {
      console.error("Error picking image:", error);
      setImage(null);
    }
  };

  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const validateInputs = () => {
    const errors = {};
    if (!name) {
      errors.name = "Name is required";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }
    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\+\d{11,13}$/.test(phone)) {
      errors.phone = "Phone number is invalid";
    }
    if (!address) {
      errors.address = "Address is required";
    } else if (!/\w+\s+\d+/.test(address)) {
      errors.address =
        "Address should contain alphanumeric characters and house number";
    }
    if (!gender) {
      errors.gender = "Gender is required";
    } else if (!["Male", "Female"].includes(gender)) {
      errors.gender = "Gender should be Male or Female";
    }
    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not logged in.");
      }

      await updateDoc(doc(FIRESTORE_DB, "users", currentUser.uid), {
        username: name,
        email: email,
        phone: phone,
        address: address,
        gender: gender,
      });

      if (image) {
        const blob = await uriToBlob(image);
        const storage = getStorage();
        const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
        await uploadBytes(storageRef, blob);

        const imageUrl = await getDownloadURL(storageRef);

        await updateDoc(doc(FIRESTORE_DB, "users", currentUser.uid), {
          image: imageUrl,
        });

        setImage(imageUrl);
      }
      Alert.alert("Profile updated successfully!");
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Loader loading={loading} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigate.goBack()}>
          <Image source={Images.back} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>

        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      <View style={{ marginTop: 28 }}>
        {image ? (
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            <Image source={{ uri: image }} style={styles.image} />
            <Image
              source={Images.circle}
              style={{ position: "absolute", right: 0, bottom: 10 }}
            />
            <Image
              source={Images.edit}
              style={{ position: "absolute", right: 10, bottom: 20 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            <Image source={Images.biguser} style={styles.image} />
            <Image
              source={Images.circle}
              style={{ position: "absolute", right: 0, bottom: 10 }}
            />
            <Image
              source={Images.edit}
              style={{ position: "absolute", right: 10, bottom: 20 }}
            />
          </TouchableOpacity>
        )}
      </View>

      <View>
        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>
      <View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="xyz@gmail.com"
          value={email}
          onChangeText={setEmail}
          editable={false}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>
      <View style={{ flexDirection: "row", marginTop: 0 }}>
        <Image
          source={Images.flag}
          style={{ position: "absolute", marginTop: 13, marginLeft: 12 }}
        />
        <>
          <Text style={styles.labelPhone}>Phone Number</Text>
          <TextInput
            style={[styles.input, { paddingLeft: 55 }]}
            placeholder="+921234567890"
            value={phone}
            maxLength={13}
            keyboardType="phone-pad"
            onChangeText={setPhone}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </>
      </View>
      <View>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.input}>
          <RNPickerSelect
            onValueChange={(value) => setGender(value)}
            placeholder={{
              label: "Select Gender",
              value: null,
              color: "#A8A8A9",
            }}
            items={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
          />
        </View>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
      </View>
      <View>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="45 New Avenue, Lahore"
          value={address}
          onChangeText={setAddress}
        />
        {errors.address && (
          <Text style={styles.errorText}>{errors.address}</Text>
        )}
      </View>

      <TouchableOpacity onPress={handleSave}>
        <View style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 24,
  },
  headerText: {
    fontFamily: "Montserrat 600",
    fontSize: 22,
    alignSelf: "center",
    marginLeft: "24%",
    color: GRADIENT_1,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    backgroundColor: "#2126230D",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  label: {
    position: "absolute",
    fontFamily: "Montserrat 400",
    fontSize: 10,
    color: "#21262380",
    marginLeft: 12,
    marginTop: 4,
  },
  labelPhone: {
    position: "absolute",
    fontFamily: "Montserrat 400",
    fontSize: 10,
    color: "#21262380",
    marginLeft: 55,
    marginTop: 4,
  },
  input: {
    height: 50,
    borderColor: "#9E9E9E",
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
    marginBottom: 25,
    backgroundColor: "#2126230D",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  submitButton: {
    backgroundColor: "#1573FE",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontFamily: "Montserrat 500",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default EditProfile;
