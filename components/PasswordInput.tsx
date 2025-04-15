import { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface PasswordInputPros {
  style?: string; // style as a string for NativeWind classes
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
    <View
      className={`flex-row items-center bg-gray-200 rounded-lg px-3 py-2 w-full ${style}`}
    >
      <TextInput
        placeholder={placeholder}
        className="flex-1 mr-2 text-base" // Use NativeWind for input styling
        secureTextEntry={!isPasswordVisible}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        className="opacity-80"
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
      >
        {(!isPasswordVisible && (
          <FontAwesome name="eye-slash" size={22} color="black" />
        )) || <FontAwesome name="eye" size={22} color="black" />}
      </TouchableOpacity>
    </View>
  );
}
