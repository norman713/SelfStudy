import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { Ionicons, Feather } from "@expo/vector-icons";
import useCustomFonts from "@/hooks/useCustomFonts";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import userApi from "@/api/userApi"; // Import the API call

export default function Profile() {
  const fontsLoaded = useCustomFonts();
  const [userData, setUserData] = useState({
    username: "",
    dateOfBirth: "",
    gender: "",
    avatarUrl: "",
  });

  const [newUserData, setNewUserData] = useState({
    username: "",
    dateOfBirth: "",
    gender: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userApi.getUserInfo();
        setUserData({
          username: response.username,
          dateOfBirth: response.dateOfBirth,
          gender: response.gender,
          avatarUrl: "https://randomuser.me/api/portraits/lego/1.jpg",
        });
        setNewUserData({
          username: response.username,
          dateOfBirth: response.dateOfBirth,
          gender: response.gender,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setNewUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Call the API with all updated fields
      const response = await userApi.updateUserInfo(
        "554c0f1d-b1f4-4466-8778-8caaff792b45",
        newUserData
      );
      Alert.alert("Success", "User info updated successfully.");
      setUserData(newUserData); // Update local state with the new data
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "Failed to update user info.");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#7AB2D3", "#B9E5E8"]} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: userData.avatarUrl || "https://via.placeholder.com/110", // Placeholder image if avatarUrl is empty
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraIcon}>
            <Feather name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={newUserData.username}
                onChangeText={(text) => handleInputChange("username", text)} // Update username
              />
              <Feather name="edit-2" size={20} color="#7AB2D3" />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Date of birth</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={newUserData.dateOfBirth}
                onChangeText={(text) => handleInputChange("dateOfBirth", text)} // Update dateOfBirth
              />
              <Feather name="calendar" size={20} color="#7AB2D3" />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={newUserData.gender}
                onChangeText={(text) => handleInputChange("gender", text)} // Update gender
              />
              <Feather name="chevron-down" size={20} color="#7AB2D3" />
            </View>
          </View>

          <Pressable>
            <Text style={styles.resetText}>Reset password</Text>
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton title="Save" onPress={handleSave} /> {/* Save button */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  gradient: {
    height: 180,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "white",
  },

  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: "46%",
    backgroundColor: "#7AB2D3",
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  form: {
    marginTop: 33,
    gap: 20,
  },
  inputWrapper: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: {
    fontSize: 16,
    flex: 1,
    fontFamily: "Poppins_400Regular",
  },
  resetText: {
    color: "#7AB2D3",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 40,
    paddingBottom: 20,
  },
});
