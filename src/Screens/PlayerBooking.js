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
} from "react-native";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  QuerySnapshot,
  addDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { GRADIENT_1 } from "../Constants/Colors";
import { Rating } from "react-native-ratings";

const VerifyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState("");
  const [gigId, setGigId] = useState("");
  const [rating, setRating] = useState(0);
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
      // Moved setting gigId inside the if condition
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
      // Check if a review by the same user for the same gig already exists
      const reviewsQuery = query(
        collection(FIRESTORE_DB, "reviews"),
        where("gigId", "==", gigId),
        where("uid", "==", userUid)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      if (!reviewsSnapshot.empty) {
        Alert.alert("You have already submitted a review for this gig.");
      } else {
        // Add a new review
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
      <Text style={styles.title}>{item.title}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Total Cost: {item.totalCost}</Text>
      <Text>Status: {item.Status}</Text>
      <Text>Owner: {item.owner}</Text>
      <Text>Hours: {item.selectedHours}</Text>
      <Text>gigId: {item.gigId}</Text>

      {item.Status === "Approved" && (
        <>
          <Text>Give your review:</Text>
          <TextInput
            style={styles.input}
            placeholder="Comments"
            value={comments}
            onChangeText={setComments}
          />
          <Rating
            showRating
            onFinishRating={(rating) => setRating(rating)}
            startingValue={0}
            style={{ paddingVertical: 10 }}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleReviewSubmit(item.gigId)}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}

      {item.image && (
        <Image source={{ uri: item.image }} style={styles.transactionImage} />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verify Bookings</Text>
      {bookings.length === 0 ? (
        <Text>No bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bookingItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: GRADIENT_1,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionImage: {
    width: "100%",
    height: 500,
    marginTop: 10,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: GRADIENT_1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default VerifyBooking;
