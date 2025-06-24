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
  Alert,
  Pressable,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/Header";
import * as ImagePicker from 'expo-image-picker';
import { useTeamContext } from "@/context/TeamContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { connectChatSocket } from "@/util/chatsocket";
import chatApi from "@/api/chatApi";
import { err } from "react-native-svg";
import teamApi from "@/api/teamApi";
import { useUser } from "@/context/UserContext";
import axiosInstance from "@/api/axiosConfig";

interface TokenPayload {
  sub: string;
  role: string;
  exp: number;
}

const CURRENT_USER_ID = "u1";

export interface Message {
  id: string | undefined
  userId: string | undefined
  username: string | undefined
  avatarUrl: string | undefined
  content: string
  createdAt: string
  imageUrl: string 
  readBy: any[]
  deleted: boolean
}

export interface Team {
  id: string
  name: string
  description: string
  teamCode: string
  createDate: string
  creatorId: string
  totalMembers: number
  avatarUrl: string
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList<any>>(null);
  const { setId, getId } = useTeamContext();
  const [teamId, setTeamId] = useState<string | null>(null);
  const { user } = useUser();
  const [team, setTeam] = useState<any>();
  const socketRef = useRef<WebSocket | null>(null);
  const isAppending = useRef(false);

  useEffect(() => {
    const id = "111e8400-e29b-41d4-a716-446655440001";
    setId(id);          // context update
    setTeamId(id);  
  }, []);

  useEffect(() => {
    if (isAppending.current) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      isAppending.current = false;
    }
  }, [messages]);

  useEffect(() => {
    if (!teamId) return;

    const fetchUserAndTeam = async () => {
      try {
        const response = await teamApi.getTeamInfo(getId());
        setTeam(response);
      } catch (error) {
          console.error('Error fetching team:', error);
      }
    };

    fetchUserAndTeam();
  }, [teamId]);

  useEffect(() => {
    if (!teamId) return;

    const fetchAllMessage = async () => {
      try {
        console.log(getId());
        const response = await chatApi.getChatMessages({teamId: getId()});
        setMessages(response.messages);
      } catch (error) {
          console.error('Error fetching all messages:', error);
      }
    };

    fetchAllMessage();
  }, [teamId]);

  useEffect(() => {
    if (!user?.id || !getId()) return; 

    const url = `ws://103.211.201.112:8086/ws/chat?userId=${user.id}&teamId=${getId()}`;
    console.log("Connecting to:", url);

    const socket = connectChatSocket(url, (message) => {
      try {
      switch (message.type) {
        case "new":
          const newMsg: Message = {
            ...message.data,
            readBy: [],
          };
          setMessages((prev) => [newMsg, ...prev]);
          isAppending.current = true;
          break;

        case "delete":
          const oldMsg: any = {
            ...message.data,
          };
          const deleteID = oldMsg.messageId;

          setMessages((prev: Message[]) =>
            prev.map((msg) =>
              msg.id === deleteID ? { ...msg, deleted: true} : msg
            )
          );
          break;

        default:
          console.log("Unhandled message type:", message.type);
          break;
      }
    } catch (err) {
      console.error("Failed to handle socket message:", err);
    }
  });

    socketRef.current = socket;

    return () => {
      socket.close();
    };

  }, [user?.id, getId]);

  const loadMoreMessages = async () => {
    if (messages.length === 0) return;

    const oldestMessage = messages[messages.length-1];
    const cursor = oldestMessage.createdAt.trim();
    const isoString = cursor.replace(" ", "T");
    try {
      const response = await chatApi.getChatMessages({
        teamId: getId(),
        cursor: isoString,
        size: 10
      });

      if (response.messages.length > 0) {
        setMessages((prev) => [...prev, ...response.messages]);
      }
    } catch (error : any) {
      console.error("Error loading older messages:", error.response.data);
    }
  };

  const handleChooseOption = () => {
    Alert.alert(
      'Select Option',
      'Choose an image source',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Take Photo',
          onPress: openCamera,
        },
        {
          text: 'Choose from Gallery',
          onPress: openGallery,
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = (messageId: string) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteMessage(messageId) }
      ]
    );
  };

  const deleteMessage = async (id: string) => {
    try{
      const response = await chatApi.deleteChatMessage(id);
    }catch(error){
      console.error('Error delete message:', error);
    }
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      sendImage(uri);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      sendImage(uri);
    }
  };

  const sendMessage = async() => {
    const text = input.trim();
    if (!text) return;

    try{
      const response = await chatApi.sendChatMessage(text, teamId);      
      setInput("");
    }catch (error){
      console.error('Error sending message:', error);
    }
  };

  const sendImage = async (uri : string) => {
    
    try{
      const formData = new FormData();

      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: "chat-image.jpg",
      } as any); 

      const res = await chatApi.sendChatImage(formData, teamId);
    } catch (error: any) {
        console.error("❌ Error sending image:");
        console.error("Message:", error.message);
        console.error("Is Axios Error:", error.isAxiosError);
        if (error.response) {
          console.error("🔻 Server responded with error:", error.response.status);
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          console.error("🔻 No response received. Request details:", error.request);
        } else {
          console.error("🔻 Error setting up request:", error);
        }
    }
  }

  const renderItem = ({ item }: any) => {
    const isMe = item.userId == user?.id;
    
    return (
      <View
        style={[styles.messageRow, isMe ? styles.rowRight : styles.rowLeft]}
      >
        {!isMe && <Image source={{uri : item.avatarUrl}} style={styles.avatar} />}
        <Pressable
          onLongPress={isMe ? () => handleDelete(item.id) : () => {}}
          style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
        >
          {!isMe && <Text style={styles.name}>{item.username}</Text>}
          {item.deleted ? (
            <Text style={styles.deleteText}>This message has been deleted</Text>
          ) : (
            <>
              <Text style={styles.text}>{item.content}</Text>
              {item.imageUrl != "" && (
                <Image
                  style={styles.chatImage}
                  source={{ uri: item.imageUrl }}
                />
              )}
            </>
          )}
          <Text style={styles.time}>{item.createdAt}</Text>
        </Pressable>
        {isMe && <Image source={{uri : user?.avatarUrl}} style={styles.avatar} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {/* Header có thêm avatar team */}
      <LinearGradient
        colors={["#6BA2E3", "#9BD3F0"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* Avatar team */}
        <Image source={{ uri: team?.avatarUrl }} style={styles.teamAvatar} />
        {/* Tên team và số thành viên */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{team?.name}</Text>
          <Text style={styles.headerSub}>{team?.totalMembers} members</Text>
        </View>
      </LinearGradient>

      {/* Danh sách chat */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
        inverted={true}
        onEndReachedThreshold={0.1}
        onEndReached={loadMoreMessages}
      />

      {/* Input gửi tin */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons onPress={handleChooseOption} name="image-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            autoFocus
            placeholder="Type a new message"
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <Ionicons name="send-outline" size={24} color="#007AFF" />
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
    borderBottomLeftRadius: 0,
  },
  bubbleMe: {
    backgroundColor: "#8de1f0",
    borderBottomRightRadius: 0,
  },

  name: { fontSize: 12, fontWeight: "600", marginBottom: 4, color: "#1E282D" },
  text: { fontSize: 14, color: "#1E282D" },
  deleteText: {fontSize: 14, color: "#535353", fontStyle: "italic"},
  time: { fontSize: 10, color: "#535353", alignSelf: "flex-end", marginTop: 6 },

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
  },
  sendBtn: { marginLeft: 8 },
  attachBtn: { marginRight: 8 },
  chatImage: {
    width: 200,
    height: 200,
    objectFit: "contain"
  }
});
