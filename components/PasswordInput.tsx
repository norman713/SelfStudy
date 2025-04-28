import { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";

interface PasswordInputPros {
  style?: ViewStyle;
  placeholder: string;
  onChangeText?: (text: string) => void;
}

export default function PasswordInput({
  style,
  placeholder,
  onChangeText,
}: PasswordInputPros) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={!isPasswordVisible}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
      >
        {!isPasswordVisible ? (
          <FontAwesome name="eye-slash" size={22} color="black" />
        ) : (
          <FontAwesome name="eye" size={22} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    backgroundColor: Colors.gray,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: "100%",
    height: 40,
  },
  input: {
    flex: 1,
    marginRight: 5,
    textAlignVertical: "center", // 👈 Chính giữa dọc placeholder và text
    fontSize: 16,
  },
  button: {
    opacity: 0.8,
    justifyContent: "center",
  },
});
