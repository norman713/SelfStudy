import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface SelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Track hovered item index

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Main Dropdown Button */}
      <Pressable style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.selectedText}>{value}</Text>
        <MaterialIcons
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#333"
        />
      </Pressable>

      {/* Dropdown Options */}
      {isOpen && (
        <View style={styles.dropdown}>
          {options.map((option, index) => (
            <Pressable
              key={index}
              style={[
                styles.dropdownItem,
                hoveredIndex === index && styles.hoveredItem, // Apply hover effect
              ]}
              onPress={() => handleOptionSelect(option)}
              onPressIn={() => setHoveredIndex(index)} // Set hover index
              onPressOut={() => setHoveredIndex(null)} // Reset hover index
            >
              <Text style={styles.dropdownItemText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1, // Ensure dropdown overlaps other elements
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Stronger downward shadow
    shadowOpacity: 0.3, // More prominent shadow
    shadowRadius: 6, // Softer shadow edges
    elevation: 8, // Higher elevation for Android
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 }, // Make shadow heavier below
    shadowOpacity: 0.1,
    shadowRadius: 0, // Larger blur for smoother shadow edges
    elevation: 7, // Higher elevation for Android shadow
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff", // Default background color
  },
  hoveredItem: {
    backgroundColor: "#E3F2FD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Select;
