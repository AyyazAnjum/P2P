import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Images } from "../Constants/Images";

const About = () => {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.goBackButton}
      >
        <Image source={Images.back} style={styles.goBackImage} />
        <Image source={Images.logo} style={styles.logoImage} />
      </TouchableOpacity>
      <Text style={styles.header}>About Pay2Play</Text>
      <Text style={styles.paragraph}>
        Welcome to Pay2Play, your ultimate solution for booking and managing
        sports and recreation activities. Our platform connects players with
        vendors offering various sports facilities, ensuring a seamless
        experience for everyone involved.
      </Text>

      <Text style={styles.subHeader}>Meet the Team</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Muhammad Naeem :</Text> Developed the app's
        front end using Expo React Native and the back end using Firebase.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Maharulnisa:</Text> Designed the UI and UX of
        the app and also helped to Develop app.
      </Text>
      <Text style={styles.subHeader}>Our Project</Text>
      <Text style={styles.paragraph}>
        Pay2Play is designed to make it easy for players to book and enjoy their
        favorite sports activities. Vendors can list their facilities and gigs,
        while admins ensure smooth operation and management.
      </Text>

      <Text style={styles.subHeader}>Features</Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Player Bookings:</Text> Players can pay for
        and book specific hours for various games like indoor cricket, football,
        and more.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Vendor Gigs:</Text> Vendors can post gigs
        offering different sports activities and facilities.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Reviews:</Text> Players can review the gigs
        they have booked, providing valuable feedback for vendors and other
        players.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Admin Control:</Text> Admins manage profiles
        and gigs, approve gigs for player visibility, and have the authority to
        delete gigs or approve vendor accounts.
      </Text>

      <Text style={styles.subHeader}>How It Works</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Player Interaction:</Text> Players browse and
        book available sports activities, pay securely, and leave reviews after
        participating.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Vendor Interaction:</Text> Vendors list their
        sports facilities and gigs, awaiting admin approval before they become
        visible to players.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Admin Oversight:</Text> Admins oversee the
        entire platform, approving gigs and vendor accounts, ensuring a
        high-quality experience for all users.
      </Text>

      <Text style={styles.subHeader}>Our Vision</Text>
      <Text style={styles.paragraph}>
        At Pay2Play, we aim to create a dynamic and engaging environment for
        sports enthusiasts. By bridging the gap between players and vendors, we
        promote active lifestyles and community involvement in sports.
      </Text>
      <Text style={styles.paragraph}>
        Thank you for joining us on this journey. Let's work together to enjoy
        sports and recreation like never before with Pay2Play!
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 22,
    backgroundColor: "#f5f5f5",
  },
  goBackButton: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 60,
    marginTop: 5,
  },
  goBackImage: {
    width: 24,
    height: 24,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginLeft: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: "Montserrat 700",
    marginBottom: 10,
    alignSelf: "center",
  },
  subHeader: {
    fontSize: 20,
    fontFamily: "Montserrat 700",
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: "Montserrat 400",
    marginBottom: 10,
    lineHeight: 22,
    color: "#212623",
  },
  listItem: {
    fontSize: 16,
    fontFamily: "Montserrat 400",
    marginBottom: 10,
    lineHeight: 22,
    color: "#212623",
  },
  bold: {
    fontFamily: "Montserrat 700",
  },
});

export default About;
