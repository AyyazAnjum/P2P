import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { Images } from "../Constants/Images";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { collection, addDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loader from "../Components/Loader";
// Import the hook to use Firebase Auth state
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const NewGig = ({ route }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Cricket");
  const [hourlyRate, setHourlyRate] = useState("");
  const [bankName, setBankName] = useState(""); // New state for bank name
  const [accountNumber, setAccountNumber] = useState(""); // New state for account number
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ownerName, setOwnerName] = useState("");

  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const { email } = route.params;
  const handleImagePicker = async () => {
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

  const handleSubmit = async () => {
    if (
      !title ||
      !location ||
      !category ||
      !hourlyRate ||
      !image ||
      !bankName ||
      !accountNumber ||
      !ownerName
    ) {
      Alert.alert("Error", "Please fill all the fields and upload an image");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      // Upload image to Firebase Storage
      const storage = getStorage();
      const imageRef = ref(storage, `gigImages/${Date.now()}`);
      await uploadBytes(imageRef, blob);

      // Get download URL of the uploaded image
      const imageUrl = await getDownloadURL(imageRef);
      const gigId = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number

      // Add gig data to Firestore with image URL
      await addDoc(collection(FIRESTORE_DB, "gigs"), {
        title,
        location,
        category,
        hourlyRate: parseFloat(hourlyRate),
        bankName, // Add bank name to Firestore
        accountNumber, // Add account number to Firestore
        imageUrl, // Add the image URL to Firestore
        status: "Pending", // 'Status' changed to lowercase 'status'
        email: email,
        ownerName, // Add owner name to Firestore
        gigId: gigId,
      });
      Alert.alert("Success", "Gig created successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating gig:", error.message);
      Alert.alert("Error", "Failed to create gig");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={Images.back} />
      </TouchableOpacity>
      <Text style={styles.header}>Create New Gig</Text>

      {/* <Text style={styles.header}>{email}</Text> */}
      <ScrollView>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={handleImagePicker}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>Upload Image</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Cricket" value="Cricket" />
            <Picker.Item label="Hockey" value="Hockey" />
            <Picker.Item label="Football" value="Football" />
            <Picker.Item label="Snooker" value="Snooker" />
            <Picker.Item label="Basketball" value="Basketball" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Hourly Rate"
          keyboardType="numeric"
          value={hourlyRate}
          onChangeText={setHourlyRate}
        />

        <TextInput
          style={styles.input}
          placeholder="Bank Name" // New TextInput for bank name
          value={bankName}
          onChangeText={setBankName}
        />

        <TextInput
          style={styles.input}
          placeholder="Account Owner Name" // New TextInput for account number
          value={ownerName}
          onChangeText={setOwnerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Account Number" // New TextInput for account number
          keyboardType="numeric"
          value={accountNumber}
          onChangeText={setAccountNumber}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Gig</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: "Montserrat 700",
    color: GRADIENT_1,
    textAlign: "center",
    marginVertical: 20,
  },
  imagePicker: {
    backgroundColor: "#f0f0f0",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  imagePickerText: {
    color: GRADIENT_1,
    fontFamily: "Montserrat 600",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontFamily: "Montserrat 500",
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  submitButton: {
    backgroundColor: GRADIENT_1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  submitButtonText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: "Montserrat 600",
  },
});

export default NewGig;
