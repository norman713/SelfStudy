import {
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  Text,
  Platform,
} from "react-native";
import { Colors } from "@/constants/Colors";
import useCustomFonts from "@/hooks/useCustomFonts";

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: "primary" | "secondary";
  borderRadius?: number;
  shadow?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  style,
  textStyle,
  color = "primary",
  borderRadius = 10,
  shadow = true,
}: CustomButtonProps) {
  const { fontsLoaded } = useCustomFonts();

  if (!fontsLoaded) {
    return null;
  }

  const buttonColor = color === "primary" ? "#7AB2D3" : "#C0C0C0";
  const textColor = color === "primary" ? "#FFFFFF" : "#000000";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: buttonColor, borderRadius: borderRadius },
        shadow && Platform.OS === "ios" ? styles.shadow : { elevation: 6 },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  text: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
