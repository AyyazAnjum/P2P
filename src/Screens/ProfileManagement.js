import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Loader from "../Components/Loader";
import { Images } from "../Constants/Images";
import { useNavigation } from "@react-navigation/native";

const ProfileManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(FIRESTORE_DB, "users"));
        const usersList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.selectedRole !== "admin"); // Exclude admin users
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
        Alert.alert("Error", "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      await deleteDoc(doc(FIRESTORE_DB, "users", userId));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      Alert.alert("Success", "User account deleted successfully.");
    } catch (error) {
      console.error("Error deleting user: ", error);
      Alert.alert("Error", "Failed to delete user account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <TouchableOpacity
        style={{
          flexDirection: "row",
          gap: 20,
          alignItems: "center",
          marginBottom: 16,
        }}
        onPress={() => navigation.goBack()}
      >
        <Image source={Images.back} />
        <Text style={styles.header}>Profile Management</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {users.map((user) => (
          <View key={user.id} style={styles.userContainer}>
            <Text style={styles.userText}>Name: {user.username}</Text>
            <Text style={styles.userText}>Email: {user.email}</Text>
            <Text style={styles.userText}>Role: {user.selectedRole}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDelete(user.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollView: {
    paddingBottom: 20,
  },
  userContainer: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  userText: {
    fontSize: 16,
    marginBottom: 4,
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
  },
  deleteButton: {
    backgroundColor: "#FF6347",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ProfileManagement;
