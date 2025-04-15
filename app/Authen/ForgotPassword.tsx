import BackButton from "@/components/BackButton";
import CustomButton from "@/components/CustomButton";
import LoginInput from "@/components/LoginInput";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomFonts from "@/hooks/useCustomFonts";
import { router } from "expo-router";
import { useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ForgotPassWordScreen() {
  const { fontsLoaded } = useCustomFonts();
  const [email, setEmail] = useState("");

  if (!fontsLoaded) {
    return null;
  }

  const handleSendCode = async () => {
    if (email === "") {
      alert("The email is empty.");
      return;
    }

    // // Giả sử gửi mã thành công mà không gọi API
    // AsyncStorage.setItem("email", email);
    // router.push("/Authentication/Verification");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        paddingHorizontal: 20,
        gap: 110,
        backgroundColor: "white",
      }}
    >
      <View style={{ alignSelf: "flex-start", marginTop: 20, marginLeft: 0 }}>
        <BackButton />
      </View>
      <View className="justify-center items-center w-full">
        <Text className="font-bold text-3xl  text-[#7AB2D3] text-center w-full">
          Forgot password?
        </Text>
        <Text
          className="text-gray-500 text-center mt-2 mb-8"
          style={{ fontSize: 16 }}
        >
          Please enter the email linked with your account
        </Text>
        <View className="w-full items-center gap-5">
          <LoginInput
            placeholder="Enter your email"
            style={{ width: "100%" }}
            onChangeText={(text) => setEmail(text)}
          />
          <CustomButton
            title="Send code"
            style="mt-5"
            onPress={handleSendCode}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
