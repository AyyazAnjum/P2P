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

const SidebarContent = ({ show, close, staff, admin }) => {
  const navigation = useNavigation();
  const [imageUrl, setImageUrl] = useState(null);

  const handleLogout = async () => {
    console.warn("Logout");
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
                    Ali
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
          {/* <Loader loading={loading} /> */}
        </ScrollView>
      ) : null}

      {staff ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 55,
                backgroundColor: "#2FCD74",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", gap: 12 }}>
                {/* <Image
                  source={imageUrl ? { uri: imageUrl } : Images.smallpic}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                /> */}
                <View style={{ justifyContent: "center" }}>
                  <Text
                    style={{
                      fontFamily: "Montserrat 500",
                      fontSize: 12,
                      color: WHITE,
                    }}
                  >
                    Staff Member
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat 500",
                      fontSize: 14,
                      color: WHITE,
                    }}
                  >
                    ali
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
                onPress={() => {
                  navigation.navigate("EditProfile");
                }}
              >
                <Image source={Images.bin} style={{ height: 24, width: 24 }} />
                <Text style={styles.text}>Bin Details</Text>
              </TouchableOpacity>
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
                <Image
                  source={Images.route}
                  style={{ height: 24, width: 24 }}
                />
                <Text style={styles.text}>Route Recomendation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  gap: 14,
                  alignItems: "center",
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
          {/* <Loader loading={loading} /> */}
        </ScrollView>
      ) : null}

      {admin ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 55,
                backgroundColor: "#2FCD74",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 18,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", gap: 12 }}>
                {/* <Image
                  source={imageUrl ? { uri: imageUrl } : Images.smallpic}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                /> */}
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
                    Abc
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
                onPress={() => {
                  navigation.navigate("BinDetail");
                }}
              >
                <Image source={Images.bin} style={{ height: 24, width: 24 }} />
                <Text style={styles.text}>Bin Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
                onPress={() => {
                  navigation.navigate("CitizenComplains");
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
                  gap: 14,
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
          {/* <Loader loading={loading} /> */}
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
