import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Images } from "../Constants/Images";
import { GRADIENT_1, WHITE } from "../Constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Loader from "./Loader";

const SidebarContent = ({ show, close, staff, admin }) => {
  const navigation = useNavigation();
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      Alert.alert("Logout", "You have been logged out.");
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      Alert.alert("Logout failed", error.message);
    }
    setLoading(false);
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
        setName(truncateName(userData.username || ""));
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

  const truncateName = (name) => {
    if (name.length > 14) {
      return name.substring(0, 14) + " ....";
    }
    return name;
  };

  return (
    <>
      {show ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 55,
                backgroundColor: GRADIENT_1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Image
                  source={imageUrl ? { uri: imageUrl } : Images.smalluser}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text
                    style={{
                      fontFamily: "Montserrat 500",
                      fontSize: 12,
                      color: WHITE,
                    }}
                  >
                    Player
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat 500",
                      fontSize: 14,
                      color: WHITE,
                    }}
                  >
                    {name || "Player"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.6} onPress={close}>
                <Image
                  source={Images.cross}
                  style={{ width: 23, height: 23 }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 43,
                gap: 24,
                flex: 1,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
                onPress={() => {
                  navigation.navigate("EditProfile");
                }}
              >
                <Image source={Images.edit} style={{ height: 24, width: 24 }} />
                <Text style={styles.text}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
                onPress={() => navigation.navigate("PlayerBooking")}
              >
                <Image
                  source={Images.booking}
                  style={{ height: 25, width: 25 }}
                />
                <Text style={styles.text}>Bookings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
                onPress={() => navigation.navigate("PlayerWish")}
              >
                <Image
                  source={Images.heart}
                  style={{ height: 25, width: 25 }}
                />
                <Text style={styles.text}>Wishlist</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
                onPress={() => navigation.navigate("About")}
              >
                <Image
                  source={Images.about}
                  style={{ height: 25, width: 25 }}
                />
                <Text style={styles.text}>About</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 50 }}>
              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  height: 50,
                  backgroundColor: "#1573FE",
                  width: 219,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontFamily: "Montserrat 500",
                  }}
                >
                  LOGOUT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Loader loading={loading} />
        </ScrollView>
      ) : null}

      {staff ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 55,
                backgroundColor: GRADIENT_1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Image
                  source={imageUrl ? { uri: imageUrl } : Images.smalluser}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text
                    style={{
                      fontFamily: "Montserrat 500",
                      fontSize: 12,
                      color: WHITE,
                    }}
                  >
                    Vendor
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat 500",
                      fontSize: 14,
                      color: WHITE,
                    }}
                  >
                    {name || "Vendor"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.6} onPress={close}>
                <Image
                  source={Images.cross}
                  style={{ width: 23, height: 23 }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 43,
                gap: 24,
                flex: 1,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
                onPress={() => {
                  navigation.navigate("EditProfile");
                }}
              >
                <Image source={Images.edit} style={{ height: 24, width: 24 }} />
                <Text style={styles.text}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
                onPress={() => navigation.navigate("VerifyBooking")}
              >
                <Image
                  source={Images.booking}
                  style={{ height: 25, width: 25 }}
                />
                <Text style={styles.text}>Approve Bookings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
                onPress={() => navigation.navigate("About")}
              >
                <Image
                  source={Images.about}
                  style={{ height: 25, width: 25 }}
                />
                <Text style={styles.text}>About</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 50 }}>
              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  height: 50,
                  backgroundColor: "#1573FE",
                  width: 219,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontFamily: "Montserrat 500",
                  }}
                >
                  LOGOUT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Loader loading={loading} />
        </ScrollView>
      ) : null}

      {admin ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 55,
                backgroundColor: GRADIENT_1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Image
                  source={imageUrl ? { uri: imageUrl } : Images.smalluser}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text
                    style={{
                      fontFamily: "Montserrat 500",
                      fontSize: 12,
                      color: WHITE,
                    }}
                  >
                    Admin
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat 500",
                      fontSize: 14,
                      color: WHITE,
                    }}
                  >
                    {name || "Admin"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.6} onPress={close}>
                <Image
                  source={Images.cross}
                  style={{ width: 23, height: 23 }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 43,
                gap: 24,
                flex: 1,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  marginLeft: 2,
                }}
                onPress={() => {
                  navigation.navigate("EditProfile");
                }}
              >
                <Image source={Images.edit} style={{ height: 24, width: 24 }} />
                <Text style={styles.text}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
                onPress={() => {
                  navigation.navigate("PlayerComplains");
                }}
              >
                <Image
                  source={Images.complain}
                  style={{ height: 30, width: 30 }}
                />
                <Text style={styles.text}>Complains</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
                onPress={() => navigation.navigate("ProfileManagement")}
              >
                <Image
                  source={Images.management}
                  style={{ height: 30, width: 30 }}
                />
                <Text style={styles.text}>Profile Management</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  gap: 14,
                  alignItems: "center",
                  marginLeft: 2,
                }}
                onPress={() => navigation.navigate("About")}
              >
                <Image
                  source={Images.about}
                  style={{ height: 25, width: 25 }}
                />
                <Text style={styles.text}>About</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 50 }}>
              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  height: 50,
                  backgroundColor: "#1573FE",
                  width: 219,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontFamily: "Montserrat 500",
                  }}
                >
                  LOGOUT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Loader loading={loading} />
        </ScrollView>
      ) : null}
    </>
  );
};

const styles = {
  text: {
    fontFamily: "Montserrat 400",
    fontSize: 16,
    color: "#21262380",
  },
};

export default SidebarContent;
