import React, { forwardRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from "react-native";
import useCustomFonts from "@/hooks/useCustomFonts";

interface ToggleTabButtonProps {
  title: string;
  active: boolean;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

const ToggleTabButton = forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  ToggleTabButtonProps
>(({ title, active, onPress, style, textStyle }, ref) => {
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableOpacity
      ref={ref}
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        active ? styles.active : styles.inactive,
        Platform.OS === "ios" ? styles.shadow : { elevation: 2 },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          active ? styles.activeText : styles.inactiveText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    backgroundColor: "#7AB2D3",
  },
  inactive: {
    backgroundColor: "#1A1A1A",
  },
  text: {
    fontFamily: "Poppins_700Bold",
    fontSize: 12,
  },
  activeText: {
    color: "#FFFFFF",
  },
  inactiveText: {
    color: "#D0D0D0",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default ToggleTabButton;
