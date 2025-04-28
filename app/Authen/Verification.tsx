import CustomButton from "@/components/CustomButton";
import { Text, StyleSheet, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomFonts from "@/hooks/useCustomFonts";
import BackButton from "@/components/BackButton";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

export default function Verification() {
  const CELL_COUNT = 4;
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const loaded = useCustomFonts();
  const [timeLeft, setTimeLeft] = useState(120);

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    title: "",
    description: "",
  });

  if (!loaded) {
    return null;
  }

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const handleResend = async () => {
    // TODO: resend logic
  };

  const handleVerify = async () => {
    if (value.length < 4) {
      setShowMessage(true);
      setMessage({
        type: "error",
        title: "Error",
        description: "The verification code consists of 4 digits.",
      });
      return;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButton}>
        <BackButton />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.instruction}>
          Enter the verification code we just sent on your email address.
        </Text>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />

        <Text style={styles.countdown}>{formatTime(timeLeft)}</Text>
        <CustomButton
          title="Verify"
          onPress={() => router.push("/Authen/ResetPassword")}
        ></CustomButton>
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Didn't receive a code? </Text>
          <Pressable onPress={handleResend}>
            <Text style={styles.highlight}>Resend</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "white",
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 10,
    marginLeft: 0,
  },
  numberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: "PlusJakartaSans_700Bold",
    marginTop: 80,
    color: "#7AB2D3",
  },
  instruction: {
    color: "gray",
    textAlign: "left",
    marginVertical: 10,
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  highlight: {
    color: "#7AB2D3",
    fontFamily: "Roboto_700Bold",
    fontSize: 16,
    fontWeight: "bold",
  },
  countdown: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 10,
    color: "#000000",
    fontFamily: "Poppins_400Regular",
  },
  verifyText: {
    color: "white",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
  },
  codeFieldRoot: {
    marginVertical: 20,
    justifyContent: "space-between",
    width: "80%",
    alignSelf: "center",
    flexDirection: "row",
  },
  cell: {
    width: 57,
    height: 57,
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  focusCell: {
    borderColor: "#7AB2D3",
  },
  cellText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000000",
    fontFamily: "Poppins_700Bold",
  },
});
