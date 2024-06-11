import React, { useEffect, useState } from "react";
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
import { Images } from "../Constants/Images";
import Sidebar from "../Components/Sidebar";
import { Rating } from "react-native-ratings";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const PlayerHome = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [approvedGigs, setApprovedGigs] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState();
  const [gigid, setGigId] = useState("");

  const gameImages = [
    { name: "Hockey", image: Images.hockey },
    { name: "Cricket", image: Images.cricket },
    { name: "Football", image: Images.football },
    { name: "Snooker", image: Images.snooker },
    { name: "Basketball", image: Images.snooker },
  ];

  const fetchAverageRating = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(FIRESTORE_DB, "reviews"),
        where("gigId", "==", gigId)
      );
      const querySnapshot = await getDocs(q);
      let totalRating = 0;
      let numberOfReviews = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalRating += data.rating;
        numberOfReviews++;
      });

      const averageRating =
        numberOfReviews > 0 ? totalRating / numberOfReviews : 0;
      const normalizedRating = averageRating / 5; // Normalizing the rating out of 5

      setAverageRating(normalizedRating);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };
  const auth = FIREBASE_AUTH;
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
    const unsubscribe = onSnapshot(
      collection(FIRESTORE_DB, "gigs"),
      (snapshot) => {
        const gigs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const approved = gigs.filter((gig) => gig.status === "Active");

        setApprovedGigs(approved);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching approved gigs: ", error);
        Alert.alert("Error", "Failed to fetch approved gigs.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleGamePress = (game) => {
    setSelectedGame((prevSelectedGame) =>
      prevSelectedGame === game ? null : game
    );
  };

  const renderSelectedGameCards = () => {
    if (!selectedGame) return null;
    const filteredGigs = approvedGigs.filter(
      (gig) => gig.category === selectedGame
    );

    if (filteredGigs.length === 0) {
      return (
        <Text style={styles.noGigsText}>
          No approved gigs for {selectedGame}.
        </Text>
      );
    }

    return (
      <View style={styles.cardsContainer}>
        <View style={styles.gameTitleContainer}>
          <Text style={styles.gameTitle}>{selectedGame}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.slider}
        >
          {filteredGigs.map((gig) => (
            <Card
              key={gig.id}
              title={gig.title}
              imagee={{ uri: gig.imageUrl }}
              rating={gig.rating || 0}
              location={gig.location}
              bankName={gig.bankName}
              hourlyRate={gig.hourlyRate}
              accountNumber={gig.accountNumber}
              email={gig.email}
              gigId={gig.gigId}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderAllGames = () =>
    gameImages.map((game) => {
      const filteredGigs = approvedGigs.filter(
        (gig) => gig.category === game.name
      );
      if (filteredGigs.length === 0) return null;

      return (
        <View key={game.name} style={styles.cardsContainer}>
          <View style={styles.gameTitleContainer}>
            <Text style={styles.gameTitle}>{game.name}</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.slider}
          >
            {filteredGigs.map((gig) => (
              <Card
                key={gig.id}
                title={gig.title}
                imagee={{ uri: gig.imageUrl }}
                rating={gig.rating || 0}
                location={gig.location}
                bankName={gig.bankName}
                hourlyRate={gig.hourlyRate}
                accountNumber={gig.accountNumber}
                email={gig.email}
                gigId={gig.gigId}
              />
            ))}
          </ScrollView>
        </View>
      );
    });

  return (
    <>
      <Sidebar
        Player={showSidebar}
        show={showSidebar}
        onTouchOverlay={() => setShowSidebar(!showSidebar)}
      />
      <ScrollView style={styles.container}>
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

        <TouchableOpacity onPress={() => setSelectedGame(null)}>
          <Text style={styles.sectionTitle}>All Games</Text>
        </TouchableOpacity>
        <View style={styles.sliderContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.slider}
          >
            {gameImages.map((game) => (
              <TouchableOpacity
                key={game.name}
                onPress={() => handleGamePress(game.name)}
              >
                <Image
                  source={game.image}
                  style={[
                    styles.image,
                    selectedGame === game.name && {
                      borderColor: "red",
                      borderWidth: 2,
                    },
                  ]}
                />
                <Text
                  style={{
                    fontFamily: "Montserrat 600",
                    marginLeft: 10,
                    color: GRADIENT_1,
                  }}
                >
                  {game.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={GRADIENT_1} />
        ) : selectedGame ? (
          renderSelectedGameCards()
        ) : (
          renderAllGames()
        )}
      </ScrollView>
    </>
  );
};

const Card = ({
  title,
  imagee,
  rating,
  location,
  hourlyRate,
  bankName,
  accountNumber,
  email,
  gigId,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Booking", {
          title,
          imagee,
          location,
          rating,
          hourlyRate,
          bankName,
          accountNumber,
          email,
          gigId,
        })
      }
    >
      <View style={styles.card}>
        <Image source={imagee} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Rating
          type="star"
          startingValue={rating}
          imageSize={20}
          readonly={true}
          ratingColor={GRADIENT_1}
          ratingBackgroundColor="#c8c7c8"
          style={styles.starRating}
        />
        <Text style={styles.location}>{location}</Text>
      </View>
    </TouchableOpacity>
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
  sliderContainer: {
    height: 90,
    marginTop: 25,
    paddingHorizontal: 20,
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  slider: {
    flexGrow: 0,
  },
  image: {
    borderRadius: 50,
    marginRight: 10,
    marginLeft: 10,
  },
  cardsContainer: {
    height: 270,
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: GRADIENT_1,
    alignItems: "center",
    justifyContent: "center",
  },
  gameTitleContainer: {
    marginBottom: 15,
  },
  gameTitle: {
    color: WHITE,
    fontFamily: "Montserrat 700",
    fontSize: 18,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    width: 200,
    height: 200,
    padding: 15,
    marginRight: 15,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  cardImage: {
    width: 190,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: GRADIENT_1,
    fontFamily: "Montserrat 600",
  },
  starRating: {
    marginVertical: 5,
  },
  location: {
    fontSize: 14,
    color: GRADIENT_1,
    fontFamily: "Montserrat 500",
  },
  noGigsText: {
    fontSize: 16,
    color: GRADIENT_1,
    fontFamily: "Montserrat 600",
    textAlign: "center",
    marginTop: 20,
  },
});

export default PlayerHome;
