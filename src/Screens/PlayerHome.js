import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { Images } from "../Constants/Images";
import Sidebar from "../Components/Sidebar";
import { Rating } from "react-native-ratings"; // Import from react-native-ratings

const PlayerHome = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const gameImages = [
    { name: "Hockey", image: Images.hockey },
    { name: "Cricket", image: Images.cricket },
    { name: "Football", image: Images.football },
    { name: "Snooker", image: Images.snooker },
  ];

  const gamesData = {
    Cricket: [
      {
        title: "Punjab Cricket Club",
        image: Images.indoor,
        rating: 4.5,
        location: "New York, USA",
      },
      {
        title: "Card 2",
        image: Images.indoor,
        rating: 4.0,
        location: "London, UK",
      },
    ],
    Hockey: [
      {
        title: "Team 1",
        image: Images.hockey,
        rating: 4.5,
        location: "Location 1",
      },
      {
        title: "Team 2",
        image: Images.hockey,
        rating: 4.0,
        location: "Location 2",
      },
    ],
    Football: [
      {
        title: "Team A",
        image: Images.football,
        rating: 3.5,
        location: "City A",
      },
      {
        title: "Team B",
        image: Images.football,
        rating: 5.0,
        location: "City B",
      },
    ],
    Snooker: [
      {
        title: "Club 1",
        image: Images.snooker,
        rating: 4.2,
        location: "Location X",
      },
      {
        title: "Club 2",
        image: Images.snooker,
        rating: 3.8,
        location: "Location Y",
      },
    ],
  };

  const handleGamePress = (game) => {
    setSelectedGame((prevSelectedGame) =>
      prevSelectedGame === game ? null : game
    );
  };

  const renderSelectedGameCards = () => {
    if (!selectedGame) return null;
    return (
      <View style={styles.cardsContainer}>
        <View style={styles.gameTitleContainer}>
          <Text
            style={{
              color: WHITE,
              fontFamily: "Montserrat 700",
              marginBottom: 15,
              fontSize: 18,
            }}
          >
            {selectedGame}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.slider}
        >
          {gamesData[selectedGame].map((card, index) => (
            <Card
              key={index}
              title={card.title}
              image={card.image}
              rating={card.rating}
              location={card.location}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderAllGames = () =>
    Object.keys(gamesData).map((game) => (
      <View key={game} style={styles.cardsContainer}>
        <View style={styles.gameTitleContainer}>
          <Text
            style={{
              color: WHITE,
              fontFamily: "Montserrat 700",
              marginBottom: 15,
              fontSize: 18,
            }}
          >
            {game}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.slider}
        >
          {gamesData[game].map((card, index) => (
            <Card
              key={index}
              title={card.title}
              image={card.image}
              rating={card.rating}
              location={card.location}
            />
          ))}
        </ScrollView>
      </View>
    ));

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
          <Image source={Images.smalluser} style={styles.userIcon} />
        </View>

        <Text style={styles.sectionTitle}>All Games</Text>
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
                <Text style={styles.text2}>{game.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedGame ? renderSelectedGameCards() : renderAllGames()}
      </ScrollView>
    </>
  );
};

const Card = ({ title, image, rating, location }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Booking", { title, location, rating })
      }
    >
      <View style={styles.card}>
        <Image source={image} style={styles.cardImage} />
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
  text: {
    fontSize: 20,
    color: GRADIENT_1,
  },
  text2: {
    fontSize: 13,
    color: GRADIENT_1,
    fontFamily: "Montserrat 600",
    textAlign: "center",
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
  },
  cardsContainer: {
    height: 270,
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: GRADIENT_1,
    alignItems: "center",
    justifyContent: "center",
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
});

export default PlayerHome;
