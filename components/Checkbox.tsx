import React, { useState } from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CheckboxProps {
  onToggle?: (isChecked: boolean) => void; // Hàm callback khi toggle
  isChecked?: boolean; // Trạng thái tick (từ bên ngoài)
}

export default function Checkbox({ onToggle, isChecked }: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(false);

  const checked = isChecked !== undefined ? isChecked : internalChecked;

  const handlePress = () => {
    const newCheckedState = !checked;
    if (isChecked === undefined) {
      setInternalChecked(newCheckedState);
    }
    if (onToggle) {
      onToggle(newCheckedState);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <MaterialCommunityIcons
        name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
        size={24}
        color={checked ? "#7AB2D3" : "#7AB2D3"}
      />
    </Pressable>
  );
}
