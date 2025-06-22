import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Complete() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SESSION COMPLETE!</Text>
      <View>
        <MaterialCommunityIcons
          name="check-decagram-outline"
          size={200}
          color="white"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7A7A7A", // Gray background
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
});
