import { StyleSheet, Text, Image, View } from "react-native";
import useCustomFonts from "@/hooks/useCustomFonts";
import { Colors } from "@/constants/Colors";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

export default function Index() {
  const { fontsLoaded } = useCustomFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StudyPal</Text>

      <Image
        source={require("../assets/images/IndexPicture.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>Welcome to StudyPal</Text>
        <Text style={styles.description}>
          StudyPal is a self-learning app that helps users organize their study
          routine, track progress, and stay motivated to achieve their goals.
        </Text>
      </View>

      <CustomButton
        title="Get Started"
        onPress={() => router.push("/Authen/Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    gap: 40,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  title: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 36,
    color: "#7AB2D3",
  },
  image: {
    width: 332,
    height: 280,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 20,
    color: Colors.black,
  },
  description: {
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    color: Colors.black,
    textAlign: "justify",
  },
  textContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
