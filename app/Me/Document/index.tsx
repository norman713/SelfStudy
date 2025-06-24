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
  Modal,
  TextInput,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "@/components/Header";
import BottomNavBar from "@/components/navigation/ButtonNavBar";

interface DocInfo {
  name: string;
  uri: string;
  size?: number;
}

interface Folder {
  id: string;
  name: string;
  docs: DocInfo[];
}

export default function Page() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isFolderModalVisible, setFolderModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Tạo folder mới
  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
      Alert.alert("Lỗi", "Tên folder không được để trống.");
      return;
    }
    const id = Date.now().toString();
    setFolders((prev) => [
      ...prev,
      { id, name: newFolderName.trim(), docs: [] },
    ]);
    setNewFolderName("");
    setFolderModalVisible(false);
  };

  // Chọn folder
  const openFolder = (folderId: string) => {
    setCurrentFolderId(folderId === currentFolderId ? null : folderId);
  };

  // Chọn file và thêm vào folder đang mở
  const pickDoc = async () => {
    if (!currentFolderId) return;
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
        setFolders((prev) =>
          prev.map((f) =>
            f.id === currentFolderId
              ? { ...f, docs: [...f.docs, { name, uri, size }] }
              : f
          )
        );
      }
    } catch (err) {
      console.error("DocumentPicker Error:", err);
    }
  };

  // Mở document
  const openDoc = async (uri: string) => {
    await Linking.openURL(uri);
  };

  // Xác nhận xóa document
  const confirmDeleteDoc = (folderId: string, uriToDelete: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc muốn xóa tài liệu này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            setFolders((prev) =>
              prev.map((f) =>
                f.id === folderId
                  ? { ...f, docs: f.docs.filter((d) => d.uri !== uriToDelete) }
                  : f
              )
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {/* Thêm Folder */}
      <View style={styles.controls}>
        <Button
          title="➕ Thêm Folder"
          onPress={() => setFolderModalVisible(true)}
        />
      </View>

      {/* Danh sách Folder & Docs */}
      <FlatList
        data={folders}
        keyExtractor={(f) => f.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: folder }) => (
          <View style={styles.folderContainer}>
            <TouchableOpacity
              style={styles.folderHeader}
              onPress={() => openFolder(folder.id)}
            >
              <MaterialCommunityIcons
                name="folder-outline"
                size={24}
                color="#FFD700"
              />
              <Text style={styles.folderName}>{folder.name}</Text>
              <Text style={styles.count}>({folder.docs.length})</Text>
            </TouchableOpacity>

            {currentFolderId === folder.id && (
              <View style={styles.docsSection}>
                {/* Nút thêm Document chỉ hiện khi folder được mở */}
                <Button title="📄 Thêm Document" onPress={pickDoc} />

                {/* List các Document */}
                {folder.docs.length === 0 ? (
                  <Text style={styles.empty}>Chưa có file nào.</Text>
                ) : (
                  folder.docs.map((doc) => (
                    <View key={doc.uri} style={styles.docItem}>
                      <TouchableOpacity
                        style={styles.fileInfo}
                        onPress={() => openDoc(doc.uri)}
                      >
                        <Text style={styles.name} numberOfLines={1}>
                          {doc.name}
                        </Text>
                        {doc.size !== undefined && (
                          <Text style={styles.size}>
                            {(doc.size / 1024).toFixed(1)} KB
                          </Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => confirmDeleteDoc(folder.id, doc.uri)}
                      >
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={24}
                          color="#C0C0C0"
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Chưa có folder nào. Nhấn “Thêm Folder” để bắt đầu.
          </Text>
        }
      />

      <BottomNavBar />

      {/* Modal tạo Folder */}
      <Modal
        transparent
        visible={isFolderModalVisible}
        animationType="slide"
        onRequestClose={() => setFolderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tạo Folder Mới</Text>
            <TextInput
              placeholder="Tên folder"
              value={newFolderName}
              onChangeText={setNewFolderName}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Hủy"
                onPress={() => setFolderModalVisible(false)}
              />
              <Button title="Tạo" onPress={handleAddFolder} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  controls: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContent: { paddingHorizontal: 16 },
  folderContainer: {
    marginBottom: 12,
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
  },
  folderHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  folderName: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
  count: { fontSize: 14, color: "#555" },
  docsSection: { paddingHorizontal: 12, paddingBottom: 12 },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
  },
  fileInfo: { flex: 1, marginRight: 8 },
  name: { fontSize: 15, color: "#333" },
  size: { fontSize: 13, color: "#666", marginTop: 2 },
  empty: { textAlign: "center", color: "#999", padding: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 6,
    padding: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
