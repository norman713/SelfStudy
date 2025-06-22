import { Stack } from "expo-router";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TeamProvider } from "@/context/TeamContext";
import { NavigationProvider } from "@/context/NavigationContext";

const Navigation = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <NavigationProvider>
      <TeamProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </TeamProvider>
    </NavigationProvider>
  );
}
