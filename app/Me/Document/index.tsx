import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Linking,
  SafeAreaView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "@/components/Header";

interface DocInfo {
  name: string;
  uri: string;
  size?: number;
}

export default function Page() {
  const [docs, setDocs] = useState<DocInfo[]>([
    {
      name: "ProjectProposal.pdf",
      uri: "https://example.com/ProjectProposal.pdf",
      size: 256000,
    },
    {
      name: "MeetingNotes.docx",
      uri: "https://example.com/MeetingNotes.docx",
      size: 51200,
    },
    {
      name: "BudgetReport.pdf",
      uri: "https://example.com/BudgetReport.pdf",
      size: 128000,
    },
  ]);

  const pickDoc = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: false,
      });
      if (result.type === "success") {
        const { name, uri, size } = result;
        setDocs((prev) => [...prev, { name, uri, size }]);
      }
    } catch (err) {
      console.error("DocumentPicker Error:", err);
    }
  };

  const openDoc = async (uri: string) => {
    await Linking.openURL(uri);
  };

  const confirmDelete = (uriToDelete: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc muốn xóa tài liệu này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            setDocs((prev) => prev.filter((doc) => doc.uri !== uriToDelete));
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        style={styles.list}
        data={docs}
        keyExtractor={(item) => item.uri}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={styles.fileInfo}
              onPress={() => openDoc(item.uri)}
            >
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              {item.size !== undefined && (
                <Text style={styles.size}>
                  {(item.size / 1024).toFixed(1)} KB
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item.uri)}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={24}
                color="#C0C0C0"
              />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có file nào.</Text>}
      />
      <View style={styles.buttonWrapper}>
        <Button title="Chọn PDF/Word" onPress={pickDoc} color="#7AB2D3" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginBottom: 12,
  },
  fileInfo: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    color: "#333",
  },
  size: {
    marginTop: 4,
    fontSize: 14,
    color: "#888",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#AAA",
  },
  buttonWrapper: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
});
