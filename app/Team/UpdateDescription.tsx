import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";

export default function UpdateDescription() {
  const router = useRouter();
  const [newDescription, setNewDescription] = useState(""); // Mô tả mới

  // Hàm lưu mô tả và quay lại trang TeamInfo
  const handleSave = () => {
    // Lưu mô tả (có thể là gọi API hoặc lưu trong state)
    router.push("/Team/TeamInfo"); // Điều hướng đến trang TeamInfo
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.backtittle}>
          <BackButton />
          <Text style={styles.title}>Team description</Text>
        </View>

        {/* Nút Save */}
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị avatar và tên nhóm */}
      <View style={styles.teamInfo}>
        <Image
          source={{
            uri: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg", // Thay bằng URL ảnh của bạn
          }}
          style={styles.avatar}
        />
        <Text style={styles.teamName}>Team Cầu Lông</Text>
      </View>

      {/* Mô tả nhóm luôn là một TextInput */}
      <View style={styles.content}>
        <TextInput
          style={styles.textInput}
          placeholder="Add the purpose, rules, or main theme of the group"
          value={newDescription}
          onChangeText={setNewDescription} // Cập nhật mô tả khi người dùng nhập
          multiline
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.2 },
    shadowRadius: 10,
  },
  backtittle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  saveButton: {
    fontSize: 20,
    color: "#7AB2D3",
    fontWeight: "bold",
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30, // Để ảnh tròn
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 10, // Khoảng cách giữa avatar và tên nhóm
  },
  teamName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  textInput: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
    marginHorizontal: 10,
    borderRadius: 8,
    textAlignVertical: "top",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
