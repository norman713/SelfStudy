import { View, TextInput, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";

interface LoginInputPros {
  placeholder: string;
  style?: ViewStyle;
  onChangeText?: (text: string) => void;
  editable?: boolean;
}

export default function LoginInput({
  placeholder,
  style,
  onChangeText,
  editable = true,
}: LoginInputPros) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        editable={editable}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: Colors.gray,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: "100%",
    height: 40,
  },
  input: {
    height: "100%",
    textAlignVertical: "center",
    paddingVertical: 0,
    fontSize: 16,
  },
});
