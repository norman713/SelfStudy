import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router"; // Để sử dụng điều hướng trong Expo Router

export default function TeamInfo() {
  const router = useRouter(); // Để điều hướng đến trang UpdateDescription
  const [teamName, setTeamName] = useState("TEAM 1"); // Tên nhóm hiện tại
  const [teamDescription, setTeamDescription] = useState(
    "This is a team bla bla description to check max size of the text and handle"
  ); // Mô tả nhóm hiện tại

  // Hàm điều hướng khi nhấn vào mô tả nhóm
  const navigateToUpdateDescription = () => {
    router.push("/Team/UpdateDescription"); // Điều hướng đến trang UpdateDescription
  };

  return (
    <View style={styles.container}>
      {/* Ảnh đại diện */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg", // Thay bằng URL ảnh của bạn
          }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editIcon}>
          <Ionicons name="camera" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tên nhóm */}
      <Text style={styles.teamName}>{teamName}</Text>

      {/* Mã nhóm */}
      <Text style={styles.teamCode}>Team code: Ayz6D</Text>

      {/* Các nút hành động */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="search" size={24} color="black" />
          <Text style={styles.actionText}>Find member</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="user-check" size={24} color="black" />
          <Text style={styles.actionText}>Change member role</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="user-plus" size={24} color="black" />
          <Text style={styles.actionText}>Invite user</Text>
        </TouchableOpacity>
      </View>

      {/* Mô tả nhóm */}
      <TouchableOpacity onPress={navigateToUpdateDescription}>
        <Text style={styles.description}>{teamDescription}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#7AB2D3",
    padding: 5,
    borderRadius: 20,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  teamName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  teamCode: {
    fontSize: 14,
    color: "#888",
  },
  description: {
    fontSize: 16,
    color: "#A0A0A0",
    marginTop: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "center",
    justifyContent: "center",
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
