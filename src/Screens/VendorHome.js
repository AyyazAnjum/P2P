import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Linking,
  BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { Images } from "../Constants/Images";
import Sidebar from "../Components/Sidebar";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const VendorHome = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [backPressCount, setBackPressCount] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
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

        setImageUrl(userData.image || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (backPressCount === 0) {
        setBackPressCount(backPressCount + 1);

        setTimeout(() => {
          setBackPressCount(0);
        }, 2000);
        return true;
      } else if (backPressCount === 1) {
        BackHandler.exitApp();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [backPressCount]);

  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const onRefresh = () => {
    setRefreshing(true);
    fetchGigs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      await handleSave();
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, "gigs"));
      const fetchedGigs = [];
      querySnapshot.forEach((doc) => {
        fetchedGigs.push({ id: doc.id, ...doc.data() });
      });
      setGigs(fetchedGigs);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGigPress = async () => {
    navigation.navigate("NewGig", { email });
  };
  const handleEditGigPress = async (gig) => {
    navigation.navigate("NewGig", { email, gig, isEdit: true });
  };

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
      setEmail(userData.email || "");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGig = async (id, imageUrl) => {
    try {
      setLoading(true);

      // Delete gig document from Firestore
      await deleteDoc(doc(FIRESTORE_DB, "gigs", id));

      // Delete image from storage
      const storage = getStorage();
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      // Update state to remove the deleted gig
      setGigs(gigs.filter((gig) => gig.id !== id));
      Alert.alert("Gig deleted successfully");
    } catch (error) {
      console.error("Error deleting gig:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderGigs = () =>
    gigs.map((gig, index) => (
      <View key={index} style={styles.card}>
        <Image source={{ uri: gig.imageUrl }} style={styles.cardImage} />
        <Text style={styles.cardTitle}>Title: {gig.title}</Text>
        <Text style={styles.rating}>
          Rating: {gig.rating || "No Ratings Yet"}
        </Text>
        <Text style={styles.location}>Location: {gig.location}</Text>
        <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
          <Text style={styles.location}>Check Location: </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(gig.locationlink)}
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
        </View>

        <Text style={styles.location}>Status: {gig.status}</Text>
        <Text style={styles.location}>Hourly Rate: {gig.hourlyRate}</Text>
        <Text style={styles.location}>Bank Name: {gig.bankName}</Text>
        <Text style={styles.location}>Account Number: {gig.accountNumber}</Text>
        <View style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: "#E4D00A" }]}
            onPress={() => handleEditGigPress(gig)} // Edit button functionality
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={WHITE} />
            ) : (
              <Text style={styles.deleteButtonText}>Edit</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteGig(gig.id, gig.imageUrl)} // Pass image URL here
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={WHITE} />
            ) : (
              <Text style={styles.deleteButtonText}>Delete</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    ));

  return (
    <>
      <Sidebar
        Vendor={showSidebar}
        show={showSidebar}
        onTouchOverlay={() => setShowSidebar(!showSidebar)}
      />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowSidebar(true)}>
            <Image source={Images.menu} />
          </TouchableOpacity>
          <Image source={Images.logo} style={{ height: 60, width: 60 }} />
          <Image
            source={imageUrl ? { uri: imageUrl } : Images.smalluser}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </View>

        <Text style={styles.sectionTitle}>My Gigs</Text>
        {/* <Text style={styles.sectionTitle}>{email}</Text> */}

        {loading ? (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="large"
            color={GRADIENT_1}
          />
        ) : (
          <View style={styles.gigsContainer}>{renderGigs()}</View>
        )}

        <TouchableOpacity
          style={styles.createGigButton}
          onPress={handleCreateGigPress}
        >
          <Text style={styles.createGigButtonText}>Create New Gig</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  text: {
    fontSize: 20,
    color: GRADIENT_1,
  },
  userIcon: {
    height: 32,
    width: 32,
  },
  sectionTitle: {
    fontFamily: "Montserrat 600",
    fontSize: 18,
    marginLeft: 30,
    marginTop: 20,
    color: GRADIENT_1,
  },
  gigsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: GRADIENT_1,
    fontFamily: "Montserrat 500",
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: GRADIENT_1,
    fontFamily: "Montserrat 500",
  },
  location: {
    fontSize: 14,
    color: GRADIENT_1,
    fontFamily: "Montserrat 500",
  },
  createGigButton: {
    backgroundColor: GRADIENT_1,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    margin: 20,
  },
  createGigButtonText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: "Montserrat 600",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "50%",
    alignSelf: "flex-end",
  },
  deleteButtonText: {
    color: WHITE,
    fontFamily: "Montserrat 600",
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default VendorHome;
