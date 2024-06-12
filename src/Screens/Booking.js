import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Linking,
  Modal,
  TextInput,
} from "react-native";
import { Rating } from "react-native-ratings";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Images } from "../Constants/Images";
import * as FileSystem from "expo-file-system";
import { FIRESTORE_DB, firebase } from "../../FirebaseConfig";
import Loader from "../Components/Loader";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const Booking = ({ route }) => {
  const {
    title,
    imagee,
    location,
    rating,
    bankName,
    hourlyRate,
    accountNumber,
    email,
    gigId,
    locationlink,
  } = route.params;
  const [selectedHours, setSelectedHours] = useState([]);
  const [image, setImage] = useState(null);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [emaill, setEmaill] = useState("");
  const [bookedHours, setBookedHours] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [reportReason, setReportReason] = useState("");
  const navigation = useNavigation();

  const totalCost = selectedHours.length * hourlyRate;
  const handleSubmitReport = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("You need to be logged in to report a gig.");
      return;
    }

    if (!reportReason.trim()) {
      alert("Please provide a reason for reporting.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(FIRESTORE_DB, "reports"), {
        gigId: gigId,
        userId: currentUser.uid,
        reason: reportReason,
        email: emaill,
        timestamp: new Date().toISOString(),
      });

      alert("Report submitted successfully.");
      setModalVisible(false);
      setReportReason("");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission was not granted");
        throw new Error(
          "Permission to access the photo library was not granted."
        );
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
  const auth = FIREBASE_AUTH;

  const handleBooking = async () => {
    const currentUser = auth.currentUser;
    try {
      // Check if an image is selected
      if (!image) {
        alert("Please upload a transaction image.");
        return;
      }

      // Check if hours are selected
      if (selectedHours.length === 0) {
        alert("Please select booking hours.");
        return;
      }

      setLoading(true);

      // Construct the booking data
      const bookingData = {
        selectedHours: JSON.stringify(selectedHours),
        totalCost: totalCost.toString(),
        date: date.toISOString().substring(0, 11), // Add selected date
        owner: email,
        player: emaill,
        Status: "Pending",
        gigId: gigId,
      };

      // Upload transaction image to Firebase Storage
      const blob = await uriToBlob(image);
      const storage = getStorage();
      const storageRef = ref(storage, `transactional/${currentUser.uid}`);
      await uploadBytes(storageRef, blob);

      const imageUrl = await getDownloadURL(storageRef);

      // Add booking data to Firestore
      await setDoc(doc(FIRESTORE_DB, "bookings", currentUser.uid), {
        ...bookingData,
        image: imageUrl,
      });

      // Handle success
      alert("Booking request sent successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error sending booking request:", error);
      // Handle error
      alert("Failed to send booking request");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleSave();
  }, []);
  const handleSave = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not logged in.");
      }

      const userDoc = await getDoc(doc(FIRESTORE_DB, "users", currentUser.uid));
      if (!userDoc.exists()) {
        throw new Error("User document does not exist.");
      }

      const userData = userDoc.data();
      console.log(userData);
      setEmaill(userData.email || "");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };
  const toggleHourSelection = (hour) => {
    setSelectedHours((prevState) =>
      prevState.includes(hour)
        ? prevState.filter((h) => h !== hour)
        : [...prevState, hour]
    );
  };

  const renderHourButtons = () => {
    return Array.from({ length: 24 }, (_, i) => (
      <TouchableOpacity
        key={i}
        onPress={() => toggleHourSelection(i)}
        style={styles.hourButton(
          selectedHours.includes(i),
          bookedHours.includes(i)
        )}
        disabled={bookedHours.includes(i)}
      >
        <Text style={styles.hourText}>{`${i}:00 - ${i + 1}:00`}</Text>
      </TouchableOpacity>
    ));
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };
  const toggleWishlist = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    setLoading(true);
    try {
      const wishlistRef = doc(
        FIRESTORE_DB,
        "wishlists",
        `${currentUser.uid}_${gigId}`
      );
      const wishlistDoc = await getDoc(wishlistRef);

      if (wishlistDoc.exists()) {
        await deleteDoc(wishlistRef);
        setIsInWishlist(false);
        alert("Removed from wishlist");
      } else {
        await setDoc(wishlistRef, {
          userId: currentUser.uid,
          gigId: gigId,
          title: title,
          imagee: imagee,
          location: location,
          rating: rating,
          bankName: bankName,
          hourlyRate: hourlyRate,
          accountNumber: accountNumber,
          email: email,
        });
        setIsInWishlist(true);
        alert("Added to wishlist");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("Failed to update wishlist");
    }
    setLoading(false);
  };

  const checkWishlist = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const wishlistRef = doc(
        FIRESTORE_DB,
        "wishlists",
        `${currentUser.uid}_${gigId}`
      );
      const wishlistDoc = await getDoc(wishlistRef);

      if (wishlistDoc.exists()) {
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };
  useEffect(() => {
    fetchBookedHours();
    checkWishlist();
  }, [date]);

  const fetchBookedHours = async () => {
    try {
      setLoading(true);

      const datePart = date.toISOString().substring(0, 11);
      console.log(datePart);
      // Get only the date part
      const q = query(
        collection(FIRESTORE_DB, "bookings"),
        where("date", "==", datePart),
        where("gigId", "==", gigId),
        where("Status", "==", "Approved") // Query only by the date part
      );
      const querySnapshot = await getDocs(q);
      const hours = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(data);
        const hoursArray = JSON.parse(data.selectedHours);
        hours.push(...hoursArray);
      });
      setBookedHours(hours);
    } catch (error) {
      console.error("Error fetching booked hours:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Loader loading={loading} />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{ height: 30, width: 30 }} source={Images.back} />
        </TouchableOpacity>

        <Text style={[styles.title, { marginBottom: 0 }]}>Booking for</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Location: {location}</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.reportButton}
      >
        <Text style={styles.reportButtonText}>Report</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle} selectable={true}>
        Location Link: {locationlink}
      </Text>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View
          style={{
            flex: 1,
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            // alignItems: "center",
          }}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Report Gig</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter reason for reporting"
              value={reportReason}
              onChangeText={setReportReason}
            />
            <TouchableOpacity
              onPress={handleSubmitReport}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 20 }}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: WHITE,
            paddingVertical: 10,
            paddingHorizontal: 22,
            borderRadius: 5,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: GRADIENT_1,
            gap: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => Linking.openURL(locationlink)}
            style={{
              height: 30,
              width: 50,
              backgroundColor: "#2FCD74",
              // marginTop: 30,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              borderRadius: 8,
              gap: 6,
            }}
          >
            <Text style={{ fontFamily: "Montserrat 600", color: WHITE }}>
              Go
            </Text>
          </TouchableOpacity>
          <Text style={styles.wishlistButtonText}>Location </Text>
        </View>

        <TouchableOpacity
          onPress={toggleWishlist}
          style={[
            styles.wishlistButton,
            { borderWidth: 1, borderColor: GRADIENT_1, paddingTop: 12 },
          ]}
        >
          <Icon
            name={isInWishlist ? "heart" : "heart-o"}
            size={24}
            color={isInWishlist ? "red" : "#DDD"}
          />
          <Text style={[styles.wishlistButtonText, { marginTop: 8 }]}>
            {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </Text>
        </TouchableOpacity>
      </View>
      <Text>Hourly Rate: {hourlyRate}</Text>
      <Text>Owner Email: {email}</Text>
      <Text>Your Email: {emaill}</Text>
      {/* <Text>Your Email: {gigId}</Text> */}

      <View style={styles.ratingContainer}>
        <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
        <Rating
          type="star"
          startingValue={rating}
          imageSize={20}
          readonly={true}
          style={styles.rating}
        />
        <Text style={styles.review}>
          Excellent service and great facilities!
        </Text>
        <Text style={styles.review}>Would definitely recommend to others.</Text>
      </View>

      <View style={styles.bookingContainer}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()} // Restricting to future dates
          />
        )}

        <Text style={styles.sectionTitle}>Select Hours</Text>
        <View style={styles.hoursContainer}>{renderHourButtons()}</View>

        <Text style={styles.totalCost}>Total Cost: {totalCost}/- Pkr</Text>

        <Text style={styles.sectionTitle}>Vendor Bank Info</Text>
        <Text style={styles.bankInfo}>Bank: {bankName}</Text>
        <Text style={styles.bankInfo}>Account Number: {accountNumber}</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Upload Transaction Image</Text>
        </TouchableOpacity>
        {image && (
          <Image source={{ uri: image }} style={styles.transactionImage} />
        )}

        <TouchableOpacity onPress={handleBooking} style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 20,
  },
  wishlistButton: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: WHITE,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  wishlistButtonText: {
    color: GRADIENT_1,
    fontSize: 10,
    // marginLeft: 10,
    fontFamily: "Montserrat 600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GRADIENT_1,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: GRADIENT_1,
    marginBottom: 20,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: GRADIENT_1,
    marginBottom: 10,
  },
  rating: {
    marginVertical: 10,
  },
  review: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  bookingContainer: {
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: GRADIENT_1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  datePickerText: {
    color: WHITE,
  },
  hoursContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  hourButton: (selected, bookedHours) => ({
    backgroundColor: bookedHours ? "red" : selected ? GRADIENT_1 : "#DDD",
    padding: 5,
    borderRadius: 5,
    margin: 5,
    width: "30%",
    alignItems: "center",
  }),
  hourText: {
    color: WHITE,
  },
  totalCost: {
    fontSize: 18,
    fontWeight: "bold",
    color: GRADIENT_1,
    marginBottom: 20,
  },
  bankInfo: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  imagePicker: {
    backgroundColor: GRADIENT_1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  imagePickerText: {
    color: WHITE,
  },
  transactionImage: {
    width: "100%",
    height: 500,
    borderWidth: 1,
    borderColor: GRADIENT_1,
    borderRadius: 10,
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: GRADIENT_1,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  bookButtonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "bold",
  },
  reportButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    width: "30%",
    alignSelf: "flex-end",
  },
  reportButtonText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: "Montserrat 600",
  },
  modalView: {
    margin: 20,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: GRADIENT_1,
  },
  textInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: GRADIENT_1,
    borderRadius: 5,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: GRADIENT_1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  submitButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Booking;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
// } from "react-native";
// import { Rating } from "react-native-ratings";
// import * as ImagePicker from "expo-image-picker";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { GRADIENT_1, WHITE } from "../Constants/Colors";
// import { useNavigation } from "@react-navigation/native";
// import { Images } from "../Constants/Images";
// import * as FileSystem from "expo-file-system";
// import { FIRESTORE_DB, firebase } from "../../FirebaseConfig";
// import Loader from "../Components/Loader";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { FIREBASE_AUTH } from "../../FirebaseConfig";
// import {
//   addDoc,
//   collection,
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";

// const Booking = ({ route }) => {
//   const {
//     title,
//     location,
//     rating,
//     bankName,
//     hourlyRate,
//     accountNumber,
//     email,
//   } = route.params;
//   const [selectedHours, setSelectedHours] = useState([]);
//   const [image, setImage] = useState(null);
//   const [date, setDate] = useState(new Date());
//   const [loading, setLoading] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [emaill, setEmaill] = useState("");
//   const [bookedHours, setBookedHours] = useState([]);
//   const navigation = useNavigation();

//   const totalCost = selectedHours.length * hourlyRate;

//   const pickImage = async () => {
//     try {
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== "granted") {
//         throw new Error(
//           "Permission to access the photo library was not granted."
//         );
//       }

//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         quality: 1,
//       });

//       if (result.canceled) {
//         console.log("Image picking cancelled.");
//         return;
//       }
//       const uri = result?.uri ?? result?.assets?.[0]?.uri;
//       if (!uri) {
//         throw new Error("Image URI is null or undefined.");
//       }
//       setImage(uri);
//     } catch (error) {
//       console.error("Error picking image:", error);
//       setImage(null);
//     }
//   };

//   const uriToBlob = async (uri) => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     return blob;
//   };

//   const auth = FIREBASE_AUTH;
//   const handleBooking = async () => {
//     const currentUser = auth.currentUser;
//     try {
//       if (!image) {
//         alert("Please upload a transaction image.");
//         return;
//       }

//       if (selectedHours.length === 0) {
//         alert("Please select booking hours.");
//         return;
//       }

//       setLoading(true);

//       const bookingData = {
//         selectedHours: JSON.stringify(selectedHours),
//         totalCost: totalCost.toString(),
//         date: date.toISOString().substring(0, 11),
//         owner: email,
//         player: emaill,
//         Status: "Pending",
//       };

//       const blob = await uriToBlob(image);
//       const storage = getStorage();
//       const storageRef = ref(storage, `transactional/${currentUser.uid}`);
//       await uploadBytes(storageRef, blob);

//       const imageUrl = await getDownloadURL(storageRef);

//       await setDoc(doc(FIRESTORE_DB, "bookings", currentUser.uid), {
//         ...bookingData,
//         image: imageUrl,
//       });

//       alert("Booking request sent successfully");
//       navigation.goBack();
//     } catch (error) {
//       console.error("Error sending booking request:", error);
//       alert("Failed to send booking request");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     handleSave();
//   }, []);

//   useEffect(() => {
//     fetchBookedHours();
//   }, [date]);

//   const fetchBookedHours = async () => {
//     try {
//       setLoading(true);

//       const datePart = date.toISOString().substring(0, 11);
//       console.log(datePart);
//       // Get only the date part
//       const q = query(
//         collection(FIRESTORE_DB, "bookings"),
//         where("date", "==", datePart) // Query only by the date part
//       );
//       const querySnapshot = await getDocs(q);
//       const hours = [];
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         console.log(data);
//         const hoursArray = JSON.parse(data.selectedHours);
//         hours.push(...hoursArray);
//       });
//       setBookedHours(hours);
//     } catch (error) {
//       console.error("Error fetching booked hours:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const currentUser = auth.currentUser;
//       if (!currentUser) {
//         throw new Error("User not logged in.");
//       }

//       const userDoc = await getDoc(doc(FIRESTORE_DB, "users", currentUser.uid));
//       if (!userDoc.exists()) {
//         throw new Error("User document does not exist.");
//       }

//       const userData = userDoc.data();
//       setEmaill(userData.email || "");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       Alert.alert("Error", "Failed to update profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleHourSelection = (hour) => {
//     if (bookedHours.includes(hour)) {
//       return;
//     }
//     setSelectedHours((prevState) =>
//       prevState.includes(hour)
//         ? prevState.filter((h) => h !== hour)
//         : [...prevState, hour]
//     );
//   };

//   const renderHourButtons = () => {
//     return Array.from({ length: 24 }, (_, i) => (
//       <TouchableOpacity
//         key={i}
//         onPress={() => toggleHourSelection(i)}
//         style={styles.hourButton(
//           selectedHours.includes(i),
//           bookedHours.includes(i)
//         )}
//         disabled={bookedHours.includes(i)}
//       >
//         <Text style={styles.hourText}>{`${i}:00 - ${i + 1}:00`}</Text>
//       </TouchableOpacity>
//     ));
//   };

//   const onChangeDate = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShowDatePicker(false);
//     setDate(currentDate);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Loader loading={loading} />
//       <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Image style={{ height: 30, width: 30 }} source={Images.back} />
//         </TouchableOpacity>
//         <Text style={[styles.title, { marginBottom: 0 }]}>Booking for</Text>
//       </View>
//       <Text style={styles.title}>{title}</Text>
//       <Text style={styles.subtitle}>Location: {location}</Text>
//       <Text>Hourly Rate: {hourlyRate}</Text>
//       <Text>Owner Email: {email}</Text>
//       <Text>Your Email: {emaill}</Text>

//       <View style={styles.ratingContainer}>
//         <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
//         <Rating
//           type="star"
//           startingValue={rating}
//           imageSize={20}
//           readonly={true}
//           style={styles.rating}
//         />
//         <Text style={styles.review}>
//           Excellent service and great facilities!
//         </Text>
//         <Text style={styles.review}>Would definitely recommend to others.</Text>
//       </View>

//       <View style={styles.bookingContainer}>
//         <Text style={styles.sectionTitle}>Select Date</Text>
//         <TouchableOpacity
//           onPress={() => setShowDatePicker(true)}
//           style={styles.datePickerButton}
//         >
//           <Text style={styles.datePickerText}>{date.toDateString()}</Text>
//         </TouchableOpacity>
//         {showDatePicker && (
//           <DateTimePicker
//             value={date}
//             mode="date"
//             display="default"
//             onChange={onChangeDate}
//             minimumDate={new Date()}
//           />
//         )}

//         <Text style={styles.sectionTitle}>Select Hours</Text>
//         <View style={styles.hoursContainer}>{renderHourButtons()}</View>

//         <Text style={styles.totalCost}>Total Cost: {totalCost}/- Pkr</Text>

//         <Text style={styles.sectionTitle}>Vendor Bank Info</Text>
//         <Text>Bank Name: {bankName}</Text>
//         <Text>Account Number: {accountNumber}</Text>

//         <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
//           <Text style={styles.imagePickerText}>Upload Transaction</Text>
//         </TouchableOpacity>
//         {image && (
//           <View style={styles.imageContainer}>
//             <Image source={{ uri: image }} style={styles.image} />
//           </View>
//         )}

//         <TouchableOpacity onPress={handleBooking} style={styles.bookingButton}>
//           <Text style={styles.bookingButtonText}>Book</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: WHITE,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 18,
//     marginBottom: 8,
//   },
//   ratingContainer: {
//     marginVertical: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   rating: {
//     marginVertical: 8,
//   },
//   review: {
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   bookingContainer: {
//     marginVertical: 16,
//   },
//   datePickerButton: {
//     backgroundColor: GRADIENT_1,
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   datePickerText: {
//     color: WHITE,
//     fontSize: 18,
//   },
//   hoursContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     marginVertical: 8,
//   },
//   hourButton: (selected, booked) => ({
//     backgroundColor: booked ? "red" : selected ? "green" : GRADIENT_1,
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 8,
//     width: "48%",
//     alignItems: "center",
//   }),
//   hourText: {
//     color: WHITE,
//     fontSize: 16,
//   },
//   totalCost: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 8,
//   },
//   imagePickerButton: {
//     backgroundColor: GRADIENT_1,
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     marginVertical: 16,
//   },
//   imagePickerText: {
//     color: WHITE,
//     fontSize: 18,
//   },
//   imageContainer: {
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   image: {
//     width: 100,
//     height: 100,
//   },
//   bookingButton: {
//     backgroundColor: GRADIENT_1,
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     marginTop: 16,
//   },
//   bookingButtonText: {
//     color: WHITE,
//     fontSize: 18,
//   },
// });

// export default Booking;
