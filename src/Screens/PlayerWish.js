import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Loader from "../Components/Loader";

const PlayerWish = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (!currentUser) {
          throw new Error("User not logged in.");
        }

        const q = query(
          collection(FIRESTORE_DB, "wishlists"),
          where("userId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);

        const wishlistData = [];
        snapshot.forEach((doc) => {
          wishlistData.push({ id: doc.id, ...doc.data() });
        });
        setWishlist(wishlistData);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Loader loading={loading} />

      {wishlist.length === 0 && !loading ? (
        <View
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: GRADIENT_1,
            padding: 10,
            alignSelf: "center",
          }}
        >
          <Text>No gigs favorited yet</Text>
        </View>
      ) : (
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: GRADIENT_1,
            padding: 10,
            alignSelf: "center",
          }}
        >
          Your Wishlist
        </Text>
      )}
      <>
        <ScrollView>
          {!loading
            ? wishlist.map((gig) => (
                <>
                  <TouchableOpacity
                    key={gig.id}
                    onPress={() => {
                      navigation.navigate("Booking", {
                        title: gig.title,
                        imagee: gig.imagee.uri,
                        location: gig.location,
                        rating: gig.rating,
                        hourlyRate: gig.hourlyRate,
                        bankName: gig.bankName,
                        accountNumber: gig.accountNumber,
                        email: gig.email,
                        gigId: gig.gigId,
                      });
                    }}
                    style={styles.card}
                  >
                    <Image
                      source={{ uri: gig.imagee.uri }}
                      style={styles.cardImage}
                    />
                    <Text style={styles.cardTitle}>{gig.title}</Text>
                    <Text style={styles.cardSubtitle}>
                      Location: {gig.location}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      Hourly Rate: {gig.hourlyRate}
                    </Text>
                  </TouchableOpacity>
                </>
              ))
            : null}
        </ScrollView>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: WHITE,
    flex: 1,
  },

  noGigsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: GRADIENT_1,
    borderWidth: 0.5,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "95%",
    height: 200,
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: GRADIENT_1,
    padding: 10,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#666",
    padding: 10,
  },
});

export default PlayerWish;
