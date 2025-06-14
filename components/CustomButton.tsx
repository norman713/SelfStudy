import {
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  Text,
  View,
  Platform,
} from "react-native";
import { ReactNode } from "react";
import useCustomFonts from "@/hooks/useCustomFonts";

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: "primary" | "secondary";
  borderRadius?: number;
  shadow?: boolean;
  fontSize?: number;
  iconLeft?: ReactNode; // icon component bên trái, ví dụ <Ionicons ... />
}

export default function CustomButton({
  title,
  onPress,
  style,
  textStyle,
  color = "primary",
  borderRadius = 10,
  shadow = true,
  fontSize = 20,
  iconLeft,
}: CustomButtonProps) {
  const { fontsLoaded } = useCustomFonts();

  if (!fontsLoaded) return null;

  const buttonColor = color === "primary" ? "#7AB2D3" : "#C0C0C0";
  const textColor = color === "primary" ? "#FFFFFF" : "#000000";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: buttonColor, borderRadius },
        shadow && Platform.OS === "ios" ? styles.shadow : { elevation: 6 },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {iconLeft && <View style={styles.iconWrapper}>{iconLeft}</View>}
        <Text style={[styles.text, { color: textColor, fontSize }, textStyle]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    marginRight: 8,
  },
  text: {
    fontFamily: "Poppins_700Bold",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
