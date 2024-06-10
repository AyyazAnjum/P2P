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
} from "react-native";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { GRADIENT_1 } from "../Constants/Colors";
import Loader from "../Components/Loader";

const VerifyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const currentUser = auth.currentUser;
        const bookingsQuery = query(
          collection(FIRESTORE_DB, "bookings"),
          where("owner", "==", currentUser.email)
        );
        const querySnapshot = await getDocs(bookingsQuery);
        const bookingsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingsList);
      } catch (error) {
        console.error("Error fetching bookings: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    try {
      const bookingRef = doc(FIRESTORE_DB, "bookings", id);
      await updateDoc(bookingRef, { Status: newStatus });
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? { ...booking, Status: newStatus } : booking
        )
      );
      Alert.alert("Success", `Booking ${newStatus}`);
    } catch (error) {
      console.error("Error updating booking status: ", error);
      Alert.alert("Error", "Failed to update booking status");
    }
    setLoading(false);
  };

  const renderBooking = ({ item }) => (
    <View style={styles.bookingItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Total Cost: {item.totalCost}</Text>
      <Text>Status: {item.Status}</Text>
      <Text>Player: {item.player}</Text>
      <Text>Hours: {item.selectedHours}</Text>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.transactionImage} />
      )}
      {item.Status === "Pending" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={() => handleStatusChange(item.id, "Approved")}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleStatusChange(item.id, "Rejected")}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verify Bookings</Text>
      <Loader loading={loading} />
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "48%",
  },
  approveButton: {
    backgroundColor: "green",
  },
  rejectButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default VerifyBooking;
