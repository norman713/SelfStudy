import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import LoginInput from "@/components/LoginInput";

interface JoinPopupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (description: string) => void;
}

export default function JoinPopup({
  visible,
  onClose,
  onSave,
}: JoinPopupProps) {
  const [teamCode, setTeamCode] = useState("");

  useEffect(() => {
    if (!visible) {
      setTeamCode("");
    }
  }, [visible]);

  const handleSave = () => {
    const trimmedCode = teamCode.trim();

    if (!trimmedCode) {
      Alert.alert(
        "Missing Fields",
        "Please fill in both Name and Description."
      );
      return;
    }

    onSave(trimmedCode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Join team</Text>

          {/* Label + Input: Name */}
          <View style={styles.inputGroup}>
            <LoginInput
              placeholder="Enter team code"
              onChangeText={setTeamCode}
            />
          </View>

          {/* Save Button */}
          <View style={styles.save}>
            <CustomButton
              title="Save"
              fontSize={16}
              onPress={handleSave}
              color="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  popup: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    gap: 10,
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#5A9BD4",
    marginBottom: 10,
    fontFamily: "Poppins_700SemiBold",
  },
  inputGroup: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
    fontFamily: "Poppins_500Medium", // chuẩn semi-bold
  },

  textarea: {
    height: 80,
  },
  save: {
    paddingTop: 10,
    width: "100%",
  },
});
