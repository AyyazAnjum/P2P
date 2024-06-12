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
  Modal,
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
import { BLACK, GRADIENT_1, WHITE } from "../Constants/Colors";
import Loader from "../Components/Loader";
import { Images } from "../Constants/Images";

const VerifyBooking = () => {
  const [bookings, setBookings] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

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
        <Text style={styles.title}>Player:</Text>
        <Text style={styles.text}>{item.player}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text style={styles.title}>Hours:</Text>
        <Text style={styles.text}>{item.selectedHours}</Text>
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
      {/* {item.image && (
        <Image source={{ uri: item.image }} style={styles.transactionImage} />
      )} */}
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
        <Text style={styles.heading}>Verify Bookings</Text>
      </TouchableOpacity>

      <Loader loading={loading} />
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
  },
  goButtonText: {
    color: WHITE,
    fontFamily: "Montserrat 500",
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
  heading: {
    fontSize: 24,
    fontFamily: "Montserrat 600",
    color: BLACK,

    textAlign: "center",
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
    // padding: 20,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bookingItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: GRADIENT_1,
    borderRadius: 10,
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
