import { Stack } from "expo-router";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BackButton from "@/components/BackButton";

const Navigation = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    ></Stack>
  );
}
