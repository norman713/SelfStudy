import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  TextStyle,
} from "react-native";
import useCustomFonts from "@/hooks/useCustomFonts";

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: string; // Sử dụng kiểu string cho lớp tailwind
  textStyle?: TextStyle; // Thay đổi kiểu thành TextStyle
  color?: "primary" | "secondary";
  borderRadius?: number;
  shadow?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  style,
  textStyle,
  color = "primary", // Mặc định color là "primary"
  borderRadius = 5,
  shadow = true,
}: CustomButtonProps) {
  const { fontsLoaded, error } = useCustomFonts();

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Hoặc bạn có thể xử lý UI khi font chưa tải
  }

  // Màu nền button
  const buttonColor = color === "primary" ? "bg-[#7AB2D3]" : "bg-[#C0C0C0]";
  const textColor = "#FFFFFF";

  const borderRadiusClass = borderRadius === 10 ? "rounded-sm" : "rounded-lg";

  const shadowClass = shadow
    ? "shadow-lg shadow-offset-[0_4px] shadow-opacity-[0.25] shadow-radius-[4px]"
    : "elevation-6";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`w-full py-2 px-5 ${buttonColor} ${borderRadiusClass} ${shadowClass} ${style} flex items-center justify-center`}
    >
      <Text
        style={{
          fontFamily: "Poppins_700Bold", // Đảm bảo font Poppins_700Bold đã được tải
          fontSize: 20,
          color: textColor, // Màu chữ mặc định là trắng
          ...textStyle, // Kết hợp với textStyle của người dùng
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
