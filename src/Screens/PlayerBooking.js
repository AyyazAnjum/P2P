import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { GRADIENT_1, GRADIENT_2, WHITE, BLACK } from "../Constants/Colors";
import { Rating } from "react-native-ratings";
import { Images } from "../Constants/Images";

const PlayerBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState("");
  const [gigId, setGigId] = useState("");
  const [rating, setRating] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const currentUser = auth.currentUser;
      const bookingsQuery = query(
        collection(FIRESTORE_DB, "bookings"),
        where("player", "==", currentUser.email)
      );
      const querySnapshot = await getDocs(bookingsQuery);
      const bookingsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        gigId: doc.data().gigId,
        ...doc.data(),
      }));
      setBookings(bookingsList);
      if (bookingsList.length > 0) {
        console.log(bookingsList[0].gigId);
        setGigId(bookingsList[0].gigId.toString());
      }
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (gigId) => {
    if (!comments.trim() || rating === 0) {
      Alert.alert("Please provide comments and a rating.");
      return;
    }
    setLoading(true);
    const currentUser = auth.currentUser;
    const userUid = currentUser.uid;
    try {
      const reviewsQuery = query(
        collection(FIRESTORE_DB, "reviews"),
        where("gigId", "==", gigId),
        where("uid", "==", userUid)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      if (!reviewsSnapshot.empty) {
        Alert.alert("You have already submitted a review for this gig.");
      } else {
        await addDoc(collection(FIRESTORE_DB, "reviews"), {
          gigId,
          rating,
          comments,
          uid: userUid,
        });
        Alert.alert("Review submitted successfully.");
      }
    } catch (error) {
      console.error("Error submitting review: ", error);
    } finally {
      setLoading(false);
    }
  };

  const renderBooking = ({ item }) => (
    <View style={styles.bookingItem}>
      {/* <Text style={styles.title}>{item.title}</Text> */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          gap: 10,
        }}
      >
        <Text style={styles.title}>Date:</Text>
        <Text style={styles.text}>{item.date}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          gap: 10,
        }}
      >
        <Text style={styles.title}>Total Cost:</Text>
        <Text style={styles.text}>{item.totalCost}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text style={styles.title}>Status:</Text>
        <Text style={styles.text}>{item.Status}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          gap: 10,
        }}
      >
        <Text style={styles.title}>View Transaction Image:</Text>
      </View>

      <TouchableOpacity
        style={styles.goButton}
        onPress={() => {
          setSelectedImage(item.image);
          setModalVisible(true);
        }}
      >
        <Text style={styles.goButtonText}>Go</Text>
      </TouchableOpacity>
      {item.Status === "Approved" && (
        <>
          <Text style={styles.text}>Give your review:</Text>
          <TextInput
            style={styles.input}
            placeholder="Comments"
            value={comments}
            onChangeText={setComments}
            placeholderTextColor="#999"
          />
          <Rating
            showRating
            onFinishRating={(rating) => setRating(rating)}
            startingValue={0}
            style={styles.rating}
            imageSize={30}
            ratingBackgroundColor="#ccc"
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleReviewSubmit(item.gigId)}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GRADIENT_1} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 30,
          marginBottom: 25,
        }}
      >
        <Image source={Images.back} />
        <Text style={styles.heading}>Your Bookings</Text>
      </TouchableOpacity>

      {bookings.length === 0 ? (
        <Text style={styles.noBookingsText}>No bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: WHITE,
  },
  heading: {
    fontSize: 24,
    fontFamily: "Montserrat 600",
    color: BLACK,

    textAlign: "center",
  },
  noBookingsText: {
    fontSize: 18,
    color: BLACK,
    textAlign: "center",
  },
  bookingItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: GRADIENT_1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: WHITE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,

    fontFamily: "Montserrat 600",

    color: GRADIENT_1,
  },
  text: {
    fontSize: 15,
    color: BLACK,
    fontFamily: "Montserrat 400",
    marginTop: 2.5,
  },
  goButton: {
    backgroundColor: GRADIENT_1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
    width: "40%",
    // marginRight: 15,
  },
  goButtonText: {
    color: WHITE,
    fontFamily: "Montserrat 500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    color: BLACK,
  },
  rating: {
    paddingVertical: 10,
  },
  submitButton: {
    backgroundColor: GRADIENT_1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: WHITE,
    fontFamily: "Montserrat 500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: "100%",
    height: 500,
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: GRADIENT_1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: WHITE,
    fontWeight: "bold",
  },
});

export default PlayerBooking;
