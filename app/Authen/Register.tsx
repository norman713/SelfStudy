import LoginInput from "@/components/LoginInput";
import PasswordInput from "@/components/PasswordInput";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomFonts from "@/hooks/useCustomFonts";
import CustomButton from "@/components/CustomButton";
import BackButton from "@/components/BackButton";
import { useState } from "react";
import { isValidEmail } from "@/util/validator";

export default function RegisterScreen() {
  const { fontsLoaded } = useCustomFonts();
  const [request, setRequest] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirm, setConfirm] = useState("");

  if (!fontsLoaded) {
    return null;
  }

  const handleRegister = () => {
    // Validation
    if (
      request.username === "" ||
      request.email === "" ||
      request.password === "" ||
      confirm === ""
    ) {
      alert("All fields are required.");
      return;
    }

    if (!isValidEmail(request.email)) {
      alert("Invalid email format.");
      return;
    }

    if (request.password !== confirm) {
      alert("The password and the confirmation password must match.");
      return;
    }

    // Registration logic here (e.g., save user, navigate to a different screen, etc.)
    alert("Registration successful!");
  };

  const updateField = (fieldName: keyof typeof request, value: string) => {
    setRequest((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        gap: 110,
        backgroundColor: "white",
      }}
    >
      <View className="self-start mt-5">
        <BackButton />
      </View>
      <View className="justify-center items-center w-full py-12 px-3">
        <Text className="font-bold text-3xl mb-10 text-[#7AB2D3] text-center w-full">
          Register
        </Text>
        <View className="flex justify-center items-center w-full gap-5 pb-12">
          <LoginInput
            placeholder="Enter username"
            style={{ width: "100%" }}
            onChangeText={(text) => updateField("username", text)}
          />
          <LoginInput
            placeholder="Enter email"
            style={{ width: "100%" }}
            onChangeText={(text) => updateField("email", text)}
          />
          <PasswordInput
            placeholder="Enter password"
            style="w-full"
            onChangeText={(text) => updateField("password", text)}
          />
          <PasswordInput
            placeholder="Confirm password"
            style="w-full"
            onChangeText={(text) => setConfirm(text)}
          />
        </View>
        <CustomButton title="Register" onPress={handleRegister} />
      </View>
    </SafeAreaView>
  );
}
