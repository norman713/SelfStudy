import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { Ionicons, Feather } from "@expo/vector-icons";
import useCustomFonts from "@/hooks/useCustomFonts";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function Profile() {
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#7AB2D3", "#B9E5E8"]} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://anhcute.net/wp-content/uploads/2024/09/Anh-chibi-cho-Shiba-nghich-ngom-dang-yeu.jpg",
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraIcon}>
            <Feather name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputRow}>
              <TextInput style={styles.input} value="Anna123" />
              <Feather name="edit-2" size={20} color="#7AB2D3" />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Date of birth</Text>
            <View style={styles.inputRow}>
              <TextInput style={styles.input} value="12-02-2004" />
              <Feather name="calendar" size={20} color="#7AB2D3" />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.inputRow}>
              <TextInput style={styles.input} value="FEMALE" />
              <Feather name="chevron-down" size={20} color="#7AB2D3" />
            </View>
          </View>

          <Pressable>
            <Text style={styles.resetText}>Reset password</Text>
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Save"
            onPress={() => router.push("/Authen/Login")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  gradient: {
    height: 180,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "white",
  },

  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#7AB2D3",
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  form: {
    marginTop: 33,
    gap: 20,
  },
  inputWrapper: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: {
    fontSize: 16,
    flex: 1,
    fontFamily: "Poppins_400Regular",
  },
  resetText: {
    color: "#7AB2D3",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 40,
    paddingBottom: 20,
  },
});
