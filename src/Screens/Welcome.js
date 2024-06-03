import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { WHITE } from "../Constants/Colors";
import { Images } from "../Constants/Images";

const Welcome = ({ navigation }) => {
  const [screen, setScreen] = useState(1);

  const handleSkip = () => {
    // Navigate to the main screen or desired screen after skipping
    navigation.navigate("Login");
  };

  const handleNext = () => {
    if (screen < 3) {
      setScreen(screen + 1);
    } else {
      // Navigate to the main screen or desired screen after completing the tutorial
      navigation.navigate("Login");
    }
  };

  const handlePrev = () => {
    if (screen > 1) {
      setScreen(screen - 1);
    }
  };

  const renderContent = () => {
    switch (screen) {
      case 1:
        return (
          <>
            <Image source={Images.wel1} style={styles.image} />
            <Text style={styles.title}>Reserve your spaces</Text>
            <Text style={styles.description}>
              Get ready to play your favorite games without the hassle of
              finding and booking spaces. Join our community of sports
              enthusiasts and make every game count with pay2play.
            </Text>
          </>
        );
      case 2:
        return (
          <>
            <Image
              source={Images.wel2}
              style={{ height: 233, width: 350, marginTop: "20%" }}
            />
            <Text style={styles.title}>Make Payment</Text>
            <Text style={styles.description}>
              Your payment information is encrypted and secure. We use
              industry-standard security measures to protect your data.
            </Text>
          </>
        );
      case 3:
        return (
          <>
            <Image source={Images.wel3} style={styles.image} />
            <Text style={styles.title}>Connect with Players</Text>
            <Text style={styles.description}>
              Meet and play with fellow sports enthusiasts in your area. Build
              your network and have fun!
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenText}>
          <Text style={styles.currentScreenText}>{screen}</Text>
          <Text style={styles.totalScreenText}>/3</Text>
        </Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={{ fontFamily: "Montserrat 600", fontSize: 18 }}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {renderContent()}

      <View style={styles.pagination}>
        <View style={[styles.dot, screen === 1 && styles.activeDot]} />
        <View style={[styles.dot, screen === 2 && styles.activeDot]} />
        <View style={[styles.dot, screen === 3 && styles.activeDot]} />
      </View>

      <View style={styles.footer}>
        {screen > 1 ? (
          <TouchableOpacity onPress={handlePrev}>
            <Text style={styles.prevText}>Prev</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} /> // Add a spacer to align "Next" button to the right
        )}
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 17,
    alignItems: "center",
    justifyContent: "space-between", // Ensure the content is spaced out
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  screenText: {
    fontFamily: "Montserrat 600",
    fontSize: 18,
  },
  currentScreenText: {
    color: "#000", // or any dark color
  },
  totalScreenText: {
    color: "#A8A8A9", // or any light color to make it dull
  },
  image: {
    width: 300,
    height: 300,
    marginTop: "20%",
  },
  title: {
    fontFamily: "Montserrat 800",
    fontSize: 24,
    textAlign: "center",
    marginTop: 20,
  },
  description: {
    fontFamily: "Montserrat 600",
    fontSize: 14,
    color: "#A8A8A9",
    textAlign: "center",
    marginTop: 10,
  },
  pagination: {
    flexDirection: "row",
    marginVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#A8A8A9",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 30, // Adjust margin bottom as needed
  },
  spacer: {
    width: 60, // Adjust the width to match the width of the Prev button
  },
  prevButton: {
    backgroundColor: "#A8A8A9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextButton: {
    backgroundColor: "#ff0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  prevText: {
    color: "#C4C4C4",
    fontFamily: "Montserrat 600",
    fontSize: 16,
  },
  nextText: {
    color: "#F83758",
    fontFamily: "Montserrat 600",
    fontSize: 18,
  },
});

export default Welcome;
