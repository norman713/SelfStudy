import React, { useState } from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CheckboxProps {
  onToggle: (isChecked: boolean) => void;
  isChecked: boolean;
}
export default function Checkbox({ onToggle, isChecked }: CheckboxProps) {
  const handlePress = () => {
    onToggle(!isChecked);
  };

  return (
    <Pressable onPress={handlePress}>
      <MaterialCommunityIcons
        name={isChecked ? "checkbox-marked" : "checkbox-blank-outline"}
        size={24}
        color={isChecked ? "#7AB2D3" : "#7AB2D3"}
      />
    </Pressable>
  );
}
