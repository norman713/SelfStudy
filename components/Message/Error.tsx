import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import CustomButton from "../CustomButton";

interface ErrorProps {
  visible: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onOkPress: (event: GestureResponderEvent) => void;
}

export default function Error({
  visible,
  title,
  description,
  onClose,
  onOkPress,
}: ErrorProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <Pressable onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="black" />
          </Pressable>

          {/* Content Section */}
          <View style={styles.content}>
            {/* Icon và Title */}
            <View style={styles.header}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name="close-thick"
                  size={18}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.title}>{title}</Text>
            </View>

            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{description}</Text>
            </View>
          </View>

          {/* OK Button */}
          <CustomButton
            title="OK"
            onPress={onOkPress}
            color="primary"
            style={styles.okButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  content: {
    width: "100%",
    alignItems: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FF5B5E",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  descriptionContainer: {
    width: "100%",
    height: 38, // Đảm bảo chiều cao cố định
    justifyContent: "flex-start",
  },
  description: {
    fontSize: 16,
    color: "#000",
    textAlign: "left",
    textAlignVertical: "top",
  },
  okButton: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#FF5B5E", // Màu đỏ cho nút OK
  },
});
