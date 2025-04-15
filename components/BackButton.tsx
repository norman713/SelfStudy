import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function BackButton() {
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Feather name="arrow-left-circle" size={35} color="#7AB2D3"></Feather>
    </TouchableOpacity>
  );
}
