import {
  Text,
  StyleSheet,
  View,
  Image,
  Linking,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomFonts from "@/hooks/useCustomFonts";
import LoginInput from "@/components/LoginInput";
import CustomButton from "@/components/CustomButton";
import PasswordInput from "@/components/PasswordInput";
import { Link, router } from "expo-router";
import BackButton from "@/components/BackButton";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { isValidEmail } from "@/util/validator";
import userApi from "@/api/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../context/UserContext";

export default function LoginScreen() {
  const { fontsLoaded } = useCustomFonts();
  const [loginRequest, setLoginRequest] = useState({
    email: "",
    password: "",
  });
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState({
    title: "",
    description: "",
  });
  const { setUser } = useUser();

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loginRequest.email == "" || loginRequest.password == "") {
      setShowError(true);
      setMessage({
        title: "Error",
        description: "The email or password is empty.",
      });
      return;
    }
    if (!isValidEmail(loginRequest.email)) {
      setShowError(true);
      setMessage({
        title: "Error",
        description: "Invalid email format.",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await userApi.login(
        loginRequest.email,
        loginRequest.password
      );
      const { accessToken, refreshToken } = response;
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      setShowError(false);
      setMessage({ title: "", description: "" });
      const userInfo = await userApi.getUserInfo();
      setUser(userInfo);
      router.push("/Me/Plan");
    } catch (err) {
      setShowError(true);
      setMessage({
        title: "Login failed",
        description: "Email or password is incorrect.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Linking.openURL(
      "http://selfstudy.up.railway.app/oauth2/authorization/google"
    );
  };
  useEffect(() => {
    AsyncStorage.getItem("accessToken").then(async (token) => {
      if (token) {
        console.log("Token: ", token);
        // If token exists, set it in the user context
        const userInfo = await userApi.getUserInfo().catch((error) => {
          console.error("Failed to fetch user info:", error);
          AsyncStorage.removeItem("accessToken");
          AsyncStorage.removeItem("refreshToken");
          return null;
        });
        setUser(userInfo);
        router.push("/Me/Plan");
      }
    });
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButton}>
        <BackButton />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Login</Text>
        <LoginInput
          placeholder="Enter your email"
          style={styles.inputEmail}
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

        <Link style={styles.link} href="/Authen/ForgotPassword">
          Forgot password?
        </Link>
        <CustomButton title="Login" onPress={handleLogin} />
        <View style={styles.divideContainer}>
          <View style={styles.divideLine}></View>
          <Text style={styles.option}>Or</Text>
          <View style={styles.divideLine}></View>
        </View>
        <Pressable style={styles.googleButton} onPress={handleGoogleLogin}>
          <Image source={require("../../assets/images/google-icon.png")} />
          <Text style={styles.googleText}>Login with Google</Text>
        </Pressable>
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Link style={styles.signUpLink} href="/Authen/Register">
            Sign up here
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },

  backButton: {
    alignSelf: "flex-start",
    marginTop: 20,
    marginLeft: 0,
  },

  title: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 36,
    marginTop: 20,
    marginBottom: 40,
    color: "#7AB2D3",
    textAlign: "center",
    width: "100%",
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 10,
    paddingVertical: 60,
    paddingHorizontal: 10,
  },
  inputEmail: {
    marginBottom: 10,
    width: "100%",
  },
  link: {
    width: "100%",
    textAlign: "right",
    marginTop: 10,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#7AB2D3",
    fontSize: 15,
    fontFamily: "Roboto_700Bold",
  },

  divideLine: {
    flex: 1,
    height: 1,
    backgroundColor: "gray",
  },
  divideContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  option: {
    marginHorizontal: 5,
    color: "gray",
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
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
  },
  googleText: {
    fontFamily: "Poppins_400Regular",
    marginLeft: 5,
    color: "gray",
    fontSize: 20,
  },
  footerText: {
    marginTop: 40,
    fontFamily: "Roboto_400Regular",
    color: "black",
    textAlign: "center",
    fontSize: 16,
  },
  signUpLink: {
    color: "#7AB2D3",
    fontFamily: "Roboto_700Bold",
    fontWeight: "bold",
  },
});
