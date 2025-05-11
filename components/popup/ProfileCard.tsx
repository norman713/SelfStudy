import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient from expo-linear-gradient

interface ProfileCardProps {
  visible: boolean;
  onClose: () => void;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
    dateOfBirth: string;
    gender: string;
  };
}

export default function ProfileCard({
  visible,
  onClose,
  user,
}: ProfileCardProps) {
  if (!visible) return null; // If profile card is not visible, return null to hide

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Gradient Background at the top */}
          <LinearGradient
            colors={["#7AB2D3", "#B9E5E8"]} // Gradient colors (light blue to lighter blue)
            style={styles.gradient}
          >
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Profile Info */}
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: user.avatarUrl,
              }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{user.username}</Text>

            {/* Birthdate and Gender */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                <Ionicons name="calendar" size={16} color="#000" />{" "}
                {user.dateOfBirth}
              </Text>
              <Text style={styles.infoText}>
                <Ionicons name="male-female" size={16} color="#000" />{" "}
                {user.gender}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  popup: {
    width: "60%",
    backgroundColor: "#fff", // White background for the bottom part of the card
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    gap: 10,
  },
  gradient: {
    width: "100%",
    height: 120, // Height of the gradient section at the top
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    position: "absolute",
    top: -80,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff", // White border around the avatar
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  infoContainer: {
    alignItems: "flex-start",
  },
  infoText: {
    fontSize: 14,
    color: "#7AB2D3",
    marginVertical: 3,
  },
});
