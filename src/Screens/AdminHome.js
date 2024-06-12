import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { Images } from "../Constants/Images";
import Sidebar from "../Components/Sidebar";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { collection, getDoc, onSnapshot } from "firebase/firestore";
import { updateDoc, doc } from "firebase/firestore";

const AdminHome = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [approvedGigs, setApprovedGigs] = useState([]);
  const [pendingGigs, setPendingGigs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const auth = FIREBASE_AUTH;

  const [backPressCount, setBackPressCount] = useState(0);

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

  const fetchData = () => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(FIRESTORE_DB, "gigs"),
      (snapshot) => {
        const gigs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const approved = gigs.filter((gig) => gig.status === "Active");
        const pending = gigs.filter((gig) => gig.status === "Pending");
        setApprovedGigs(approved);
        setPendingGigs(pending);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  const handleApprove = async (id) => {
    setLoading(true);
    const gig = pendingGigs.find((gig) => gig.id === id);
    setPendingGigs(pendingGigs.filter((gig) => gig.id !== id));
    setApprovedGigs([...approvedGigs, gig]);
    try {
      // Update the status of the gig to "Active" in Firestore
      await updateDoc(doc(FIRESTORE_DB, "gigs", id), {
        status: "Active",
      });
      Alert.alert("Success", "Gig approved successfully.");
    } catch (error) {
      console.error("Error updating gig status:", error.message);
      Alert.alert("Error", "Failed to approve gig");
    }
    setLoading(false);
  };

  const handleReject = async (id) => {
    setLoading(true);
    try {
      await updateDoc(doc(FIRESTORE_DB, "gigs", id), {
        status: "Rejected",
      });
      setPendingGigs(pendingGigs.filter((gig) => gig.id !== id));
      Alert.alert("Success", "Gig rejected.");
    } catch (error) {
      console.error("Error updating gig status:", error.message);
      Alert.alert("Error", "Failed to reject gig");
    }
    setLoading(false);
  };

  const handleDelete = async (id, imageUrl) => {
    setLoading(true);
    try {
      // Delete gig document from Firestore
      await deleteDoc(doc(FIRESTORE_DB, "gigs", id));

      // Delete image from storage
      const storage = getStorage(FIREBASE_STORAGE);
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      // Update state to remove the deleted gig
      setApprovedGigs(approvedGigs.filter((gig) => gig.id !== id));
      Alert.alert("Success", "Gig deleted.");
    } catch (error) {
      console.error("Error deleting gig:", error.message);
      Alert.alert("Error", "Failed to delete gig");
    } finally {
      setLoading(false);
    }
  };
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

  const renderPendingGigs = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={GRADIENT_1} />;
    }

    if (pendingGigs.length === 0) {
      return <Text style={styles.noGigsText}>No Pending Gigs To Show</Text>;
    }

    return pendingGigs.map((gig) => (
      <View key={gig.id} style={styles.card}>
        <Image source={{ uri: gig.imageUrl }} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{gig.title}</Text>
        <Text style={styles.cardDetails}>Category: {gig.category}</Text>
        <Text style={styles.cardDetails}>Location: {gig.location}</Text>
        <Text style={styles.cardDetails}>
          Hourly Rate: Pkr {gig.hourlyRate}/-
        </Text>
        <Text style={styles.cardDetails}>Status: {gig.status}</Text>
        <Text style={styles.cardDetails}>Bank Name: {gig.bankName}</Text>
        <Text style={styles.cardDetails}>
          Account Number: {gig.accountNumber}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(gig.id)}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleReject(gig.id)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  const renderApprovedGigs = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={GRADIENT_1} />;
    }

    if (approvedGigs.length === 0) {
      return <Text style={styles.noGigsText}>No Active Gigs To Show</Text>;
    }

    return approvedGigs.map((gig) => (
      <View key={gig.id} style={styles.card}>
        <Image source={{ uri: gig.imageUrl }} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{gig.title}</Text>
        <Text style={styles.cardDetails}>Category: {gig.category}</Text>
        <Text style={styles.cardDetails}>Location: {gig.location}</Text>
        <Text style={styles.cardDetails}>
          Hourly Rate: Pkr {gig.hourlyRate}/-
        </Text>
        <Text style={styles.cardDetails}>Status: {gig.status}</Text>
        <Text style={styles.cardDetails}>Bank Name: {gig.bankName}</Text>
        <Text style={styles.cardDetails}>
          Account Number: {gig.accountNumber}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(gig.id, gig.imageUrl)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <>
      <Sidebar
        Admin={showSidebar}
        show={showSidebar}
        onTouchOverlay={() => setShowSidebar(!showSidebar)}
      />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[GRADIENT_1]} // Customize the color of the refresh indicator
            progressBackgroundColor={WHITE} // Customize the background color of the refresh indicator
          />
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

        <Text style={styles.sectionTitle}>Pending Gigs :-</Text>
        <View style={styles.gigsContainer}>{renderPendingGigs()}</View>

        <Text style={styles.sectionTitle}>Approved Gigs :-</Text>
        <View style={styles.gigsContainer}>{renderApprovedGigs()}</View>
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
  noGigsText: {
    fontSize: 16,
    color: GRADIENT_1,
    fontFamily: "Montserrat 600",
    textAlign: "center",
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
    fontFamily: "Montserrat 600",
    marginBottom: 5,
  },
  cardDetails: {
    fontSize: 14,
    color: GRADIENT_1,
    fontFamily: "Montserrat 500",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
  },
  approveButton: {
    backgroundColor: "green",
  },
  rejectButton: {
    backgroundColor: "red",
  },
  deleteButton: {
    backgroundColor: "orange",
  },
  buttonText: {
    color: WHITE,
    fontFamily: "Montserrat 600",
    fontSize: 14,
  },
});

export default AdminHome;
