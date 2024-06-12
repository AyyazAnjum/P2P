import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { FIRESTORE_DB } from "../../FirebaseConfig"; // Adjust the path as necessary
import { collection, getDocs } from "firebase/firestore";
import Loader from "../Components/Loader"; // Ensure you have a Loader component or remove it
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { Images } from "../Constants/Images";
import { useNavigation } from "@react-navigation/native";
export default function Complain() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(
          collection(FIRESTORE_DB, "reports")
        );
        const complaintsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComplaints(complaintsList);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const renderComplaint = ({ item }) => (
    <View style={styles.complaintContainer}>
      <Text style={styles.complaintText}>Reason: {item.reason}</Text>
      <Text style={styles.complaintText}>Reported by: {item.email}</Text>
      <Text style={styles.complaintText}>
        Date: {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 50 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{ height: 30, width: 30 }} source={Images.back} />
        </TouchableOpacity>

        <Text style={[styles.title, { marginBottom: 0 }]}>
          Players Complains
        </Text>
      </View>
      {loading ? (
        <Loader loading={loading} />
      ) : (
        <FlatList
          data={complaints}
          renderItem={renderComplaint}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Complaints Yet</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: "center",
    // alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GRADIENT_1,
    marginBottom: 10,
  },
  complaintContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 10,
    width: "100%",
  },
  complaintText: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  emptyText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
});
