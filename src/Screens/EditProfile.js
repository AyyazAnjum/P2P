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

  

  const handleSave = async () => {
    
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigate.goBack()}>
          <Image source={Images.blackback} />
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
            <Image source={Images.profile} style={styles.image} />
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
        <TextInput
          style={styles.input}
          placeholder="Male"
          value={gender}
          onChangeText={setGender}
        />
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
});

export default EditProfile;