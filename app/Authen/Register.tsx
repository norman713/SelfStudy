import LoginInput from "@/components/LoginInput";
import PasswordInput from "@/components/PasswordInput";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomFonts from "@/hooks/useCustomFonts";
import CustomButton from "@/components/CustomButton";
import BackButton from "@/components/BackButton";
import { router } from "expo-router";
import { useState } from "react";
import { isValidEmail } from "@/util/validator";
import { Colors } from "@/constants/Colors";
import userApi from "@/api/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen() {
  const { fontsLoaded } = useCustomFonts();
  const [request, setRequest] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    dateOfBirth: "",
  });
  const [confirm, setConfirm] = useState("");
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState({
    title: "",
    description: "",
  });

  if (!fontsLoaded) {
    return null;
  }

  // const handleRegister = async () => {
  //   if (
  //     request.username === "" ||
  //     request.email === "" ||
  //     request.password === "" ||
  //     confirm === ""
  //   ) {
  //     setShowError(true);
  //     setMessage({
  //       title: "Error",
  //       description: "All fields are required.",
  //     });
  //     return;
  //   }

  //   if (!isValidEmail(request.email)) {
  //     setShowError(true);
  //     setMessage({
  //       title: "Error",
  //       description: "Invalid email format.",
  //     });
  //     return;
  //   }

  //   if (request.password !== confirm) {
  //     setShowError(true);
  //     setMessage({
  //       title: "Error",
  //       description: "The password and the confirmation password must match.",
  //     });
  //     return;
  //   }
  // };
  const handleRegister = async () => {
    if (
      request.username === "" ||
      request.email === "" ||
      request.password === "" ||
      request.gender === "" ||
      request.dateOfBirth === ""
    ) {
      setShowError(true);
      setMessage({
        title: "Error",
        description: "All fields are required.",
      });
      return;
    }

    if (!isValidEmail(request.email)) {
      setShowError(true);
      setMessage({
        title: "Error",
        description: "Invalid email format.",
      });
      return;
    }

    if (request.password !== confirm) {
      setShowError(true);
      setMessage({
        title: "Error",
        description: "The password and the confirmation password must match.",
      });
      return;
    }

    try {
      await userApi.validate(request.username, request.email, request.password, request.dateOfBirth, request.gender,);
      setShowError(false);
      setMessage({ title: "", description: "" });
      router.replace({
        pathname: "/Authen/Verification",
        params: {
          email: request.email,
          username: request.username,
          password: request.password,
          gender: request.gender,
          dateOfBirth: request.dateOfBirth,
        },
      });
    } catch (err) {
      setShowError(true);
      setMessage({
        title: "Register failed",
        description: "Email may already exist or server error.",
      });
    }
  };
  const updateField = (fieldName: keyof typeof request, value: string) => {
    setRequest((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButton}>
        <BackButton />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Register</Text>
        <View style={styles.inputContainer}>
          <LoginInput
            placeholder="Enter username"
            style={styles.input}
            onChangeText={(text) => updateField("username", text)}
          />
          <LoginInput
            placeholder="Enter email"
            style={styles.input}
            onChangeText={(text) => updateField("email", text)}
          />
          <LoginInput
            placeholder="Enter gender"
            style={styles.input}
            onChangeText={(text) => updateField("gender", text)}
          />
          <LoginInput
            placeholder="Enter date of birth"
            style={styles.input}
            onChangeText={(text) => updateField("dateOfBirth", text)}
          />
          <PasswordInput
            placeholder="Enter password"
            style={styles.input}
            onChangeText={(text) => updateField("password", text)}
          />
          <PasswordInput
            placeholder="Confirm password"
            style={styles.input}
            onChangeText={(text) => setConfirm(text)}
          />
        </View>

        <CustomButton title="Register" onPress={handleRegister} />
        <View style={styles.divideContainer}>
          <View style={styles.divideLine}></View>
          <Text style={styles.option}>Or</Text>
          <View style={styles.divideLine}></View>
        </View>
        <Pressable style={styles.googleButton}>
          <Image source={require("../../assets/images/google-icon.png")} />
          <Text style={styles.googleText}>Login with Google</Text>
        </Pressable>
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
  body: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 60,
    paddingHorizontal: 10,
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 20,
    paddingBottom: 50,
  },
  input: {
    width: "100%",
  },
  registerText: {
    color: "white",
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16,
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
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  option: {
    marginHorizontal: 5,
    color: "gray",
    fontSize: 14,
  },
});
