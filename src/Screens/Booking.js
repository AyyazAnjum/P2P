import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Rating } from "react-native-ratings";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Images } from "../Constants/Images";

const Booking = ({ route }) => {
  const { title, location, rating } = route.params;
  const [selectedHours, setSelectedHours] = useState([]);
  const [image, setImage] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  const hourlyRate = 1000;
  const totalCost = selectedHours.length * hourlyRate;

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        throw new Error(
          "Permission to access the photo library was not granted."
        );
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled) {
        console.log("Image picking cancelled.");
        return;
      }
      const uri = result?.uri ?? result?.assets?.[0]?.uri;
      if (!uri) {
        throw new Error("Image URI is null or undefined.");
      }
      setImage(uri);
    } catch (error) {
      console.error("Error picking image:", error);
      setImage(null);
    }
  };

  const handleBooking = () => {
    // Handle booking logic here, including the rating
    alert(`Booking Confirmed with rating: ${rating}`);
    navigation.goBack();
  };

  const toggleHourSelection = (hour) => {
    setSelectedHours((prevState) =>
      prevState.includes(hour)
        ? prevState.filter((h) => h !== hour)
        : [...prevState, hour]
    );
  };

  const renderHourButtons = () => {
    return Array.from({ length: 24 }, (_, i) => (
      <TouchableOpacity
        key={i}
        onPress={() => toggleHourSelection(i)}
        style={styles.hourButton(selectedHours.includes(i))}
      >
        <Text style={styles.hourText}>{`${i}:00 - ${i + 1}:00`}</Text>
      </TouchableOpacity>
    ));
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{ height: 30, width: 30 }} source={Images.back} />
        </TouchableOpacity>

        <Text style={[styles.title, { marginBottom: 0 }]}>Booking for</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Location: {location}</Text>

      <View style={styles.ratingContainer}>
        <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
        <Rating
          type="star"
          startingValue={rating}
          imageSize={20}
          readonly={true}
          style={styles.rating}
        />
        <Text style={styles.review}>
          Excellent service and great facilities!
        </Text>
        <Text style={styles.review}>Would definitely recommend to others.</Text>
      </View>

      <View style={styles.bookingContainer}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()} // Restricting to future dates
          />
        )}

        <Text style={styles.sectionTitle}>Select Hours</Text>
        <View style={styles.hoursContainer}>{renderHourButtons()}</View>

        <Text style={styles.totalCost}>Total Cost: {totalCost}/- Pkr</Text>

        <Text style={styles.sectionTitle}>Vendor Bank Info</Text>
        <Text style={styles.bankInfo}>Bank: XYZ Bank</Text>
        <Text style={styles.bankInfo}>Account Number: 123456789</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Upload Transaction Image</Text>
        </TouchableOpacity>
        {image && (
          <Image source={{ uri: image }} style={styles.transactionImage} />
        )}

        <TouchableOpacity onPress={handleBooking} style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GRADIENT_1,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: GRADIENT_1,
    marginBottom: 20,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: GRADIENT_1,
    marginBottom: 10,
  },
  rating: {
    marginVertical: 10,
  },
  review: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  bookingContainer: {
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: GRADIENT_1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  datePickerText: {
    color: WHITE,
  },
  hoursContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  hourButton: (selected) => ({
    backgroundColor: selected ? GRADIENT_1 : "#DDD",
    padding: 5,
    borderRadius: 5,
    margin: 5,
    width: "30%",
    alignItems: "center",
  }),
  hourText: {
    color: WHITE,
  },
  totalCost: {
    fontSize: 18,
    fontWeight: "bold",
    color: GRADIENT_1,
    marginBottom: 20,
  },
  bankInfo: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  imagePicker: {
    backgroundColor: GRADIENT_1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  imagePickerText: {
    color: WHITE,
  },
  transactionImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: GRADIENT_1,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  bookButtonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Booking;
