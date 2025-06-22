// ChatScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const CURRENT_USER_ID = "u1";
const AVATAR_URL =
  "https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70._SX1080_FMjpg_.jpg";

// Thêm url avatar của team
const teamAvatarUrl =
  "https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70._SX1080_FMjpg_.jpg";

const teamInfo = {
  name: "Team Cầu Lông",
  members: 6,
};

const initialMessages = [
  {
    id: "m1",
    user: { id: "u2", name: "Kha", avatar: { uri: AVATAR_URL } },
    text: "hi cả nhà yêu của kem",
    time: "13:50",
  },
  // ... các tin khác
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg = {
      id: Date.now().toString(),
      user: { id: CURRENT_USER_ID, name: "Bạn", avatar: { uri: AVATAR_URL } },
      text,
      time: new Date().toLocaleTimeString().slice(0, 5),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const renderItem = ({ item }: any) => {
    const isMe = item.user.id === CURRENT_USER_ID;
    return (
      <View
        style={[styles.messageRow, isMe ? styles.rowRight : styles.rowLeft]}
      >
        {!isMe && <Image source={item.user.avatar} style={styles.avatar} />}
        <View
          style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
        >
          {!isMe && <Text style={styles.name}>{item.user.name}</Text>}
          <Text style={styles.text}>{item.text}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        {isMe && <Image source={item.user.avatar} style={styles.avatar} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header có thêm avatar team */}
      <LinearGradient
        colors={["#6BA2E3", "#9BD3F0"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* Menu icon */}
        <TouchableOpacity style={styles.headerIcon}>
          <MaterialIcons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        {/* Avatar team */}
        <Image source={{ uri: teamAvatarUrl }} style={styles.teamAvatar} />
        {/* Tên team và số thành viên */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{teamInfo.name}</Text>
          <Text style={styles.headerSub}>{teamInfo.members} members</Text>
        </View>
      </LinearGradient>

      {/* Danh sách chat */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
      />

      {/* Input gửi tin */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a new message"
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EBF5F9" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerIcon: { width: 32 },
  teamAvatar: {
    width: 35,
    height: 35,
    borderRadius: 16,
    marginHorizontal: 12,
  },
  headerCenter: { flex: 1, alignItems: "flex-start" },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  headerSub: { color: "#E0F2FA", fontSize: 12, marginTop: 2 },

  chatList: { padding: 16, paddingBottom: 0 },

  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  rowLeft: { justifyContent: "flex-start" },
  rowRight: { justifyContent: "flex-end" },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },

  bubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  bubbleOther: {
    borderTopLeftRadius: 0,
  },
  bubbleMe: {
    backgroundColor: "#DCF8C6",
    borderTopRightRadius: 0,
  },

  name: { fontSize: 12, fontWeight: "600", marginBottom: 4, color: "#1E282D" },
  text: { fontSize: 14, color: "#1E282D" },
  time: { fontSize: 10, color: "#888", alignSelf: "flex-end", marginTop: 6 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
  },
  sendBtn: { marginLeft: 8 },
});
