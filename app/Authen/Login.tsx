import { Text, View, Image, Linking, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomFonts from "@/hooks/useCustomFonts";
import LoginInput from "@/components/LoginInput";
import CustomButton from "@/components/CustomButton";
import PasswordInput from "@/components/PasswordInput";
import { Link, router } from "expo-router";
import BackButton from "@/components/BackButton";
import { Colors } from "@/constants/Colors";
import { useState } from "react";

export default function LoginScreen() {
  const { fontsLoaded } = useCustomFonts();
  const [loginRequest, setLoginRequest] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    if (loginRequest.email === "" || loginRequest.password === "") {
      // If fields are empty, directly return without processing
      return;
    }

    // Directly navigate to the /Me/Plan screen
    router.push("/Authen/Login");
  };

  const handleGoogleLogin = () => {
    Linking.openURL(
      "http://selfstudy.up.railway.app/oauth2/authorization/google"
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "white",
      }}
    >
      <View style={{ alignSelf: "flex-start", marginTop: 20, marginLeft: 0 }}>
        <BackButton />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: 10,
          paddingVertical: 60,
          paddingHorizontal: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "PlusJakartaSans_700Bold",
            fontSize: 36,
            marginTop: 20,
            marginBottom: 40,
            color: "#7AB2D3",
            textAlign: "center",
            width: "100%",
          }}
        >
          Login
        </Text>
        <LoginInput
          placeholder="Enter your email"
          style={{ marginBottom: 10, width: "100%" }}
          onChangeText={(text) => {
            setLoginRequest((prev) => ({
              ...prev,
              email: text,
            }));
          }}
        />
        <PasswordInput
          placeholder="Enter your password"
          onChangeText={(text) => {
            setLoginRequest((prev) => ({
              ...prev,
              password: text,
            }));
          }}
        />
        <Link
          style={{
            width: "100%",
            textAlign: "right",
            marginTop: 10,
            marginBottom: 20,
            fontWeight: "bold",
            color: "#7AB2D3",
            fontSize: 15,
            fontFamily: "Roboto_700Bold",
          }}
          href="/Authen/ForgotPassword"
        >
          Forgot password?
        </Link>
        <CustomButton title="Login" onPress={handleLogin} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "gray" }}></View>
          <Text style={{ marginHorizontal: 5, color: "gray", fontSize: 14 }}>
            Or
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "gray" }}></View>
        </View>
        <Pressable
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.light.white,
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: 10,
            paddingVertical: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3.5,
            elevation: 5,
            width: "100%",
          }}
          onPress={handleGoogleLogin}
        >
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png",
            }}
            style={{ width: 50, height: 50 }} // Bạn có thể điều chỉnh kích thước tùy ý
          />
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              marginLeft: 5,
              color: "gray",
              fontSize: 20,
            }}
          >
            Login with Google
          </Text>
        </Pressable>
        <Text
          style={{
            marginTop: 40,
            fontFamily: "Roboto_400Regular",
            color: "black",
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Don't have an account?{" "}
          <Link
            style={{
              color: "#7AB2D3",
              fontFamily: "Roboto_700Bold",
              fontWeight: "bold",
            }}
            href="/Authen/Register" // Change this path to the correct route
          >
            Sign up here
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}
