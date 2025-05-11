import { Stack } from "expo-router";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TeamProvider } from "@/context/TeamContext";
import React from "react";

const Navigation = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <TeamProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      ></Stack>
    </TeamProvider>
  );
}
