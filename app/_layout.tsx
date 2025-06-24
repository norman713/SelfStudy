import { Stack } from "expo-router";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TeamProvider } from "@/context/TeamContext";
import { NavigationProvider } from "@/context/NavigationContext";
import { UserProvider } from "../context/UserContext";

const Navigation = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <UserProvider>
      <NavigationProvider>
        <TeamProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </TeamProvider>
      </NavigationProvider>
    </UserProvider>
  );
}
