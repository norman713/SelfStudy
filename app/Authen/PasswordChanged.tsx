import CustomButton from "@/components/CustomButton";
import { Text, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomFonts from "@/hooks/useCustomFonts";
import { router } from "expo-router";

export default function PasswordChangedScreen() {
  const { fontsLoaded } = useCustomFonts();

  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/Success icon.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Password changed!</Text>
      <Text style={styles.instruction}>
        Your password has changed successfully
      </Text>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Back to login"
          onPress={() => {
            router.push("/Authen/Login");
          }}
          color="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 165,
  },
  image: {
    width: 150,
    height: 150,
  },
  title: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 36,
    marginTop: 20,
    color: "#7AB2D3",
  },
  instruction: {
    color: "#1E282DA6",
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    width: "100%",
  },
});
