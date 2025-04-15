import React from "react";
import { TextInput, View } from "react-native";
import { View as NativeView } from "react-native"; // Dùng View từ React Native

interface LoginInputProps {
  placeholder: string;
  style?: object; // Allow Tailwind-like class names as strings
  onChangeText?: (text: string) => void;
  editable?: boolean; // To control the editable state
}

export default function LoginInput({
  placeholder,
  style,
  onChangeText,
  editable = true, // Default to editable
}: LoginInputProps) {
  return (
    <View
      className={`w-full bg-gray-200 ${style}`}
      style={{ borderRadius: 10 }} // Áp dụng border-radius là 10px
    >
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        editable={editable}
        className="px-3 py-2 text-base" // NativeWind classes for TextInput
      />
    </View>
  );
}
