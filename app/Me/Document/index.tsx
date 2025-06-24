import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Linking,
  StyleSheet,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
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
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
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
    setModalVisible(false);
  };

  const confirmDeleteFolder = (fid: string) => {
    Alert.alert(
      "Delete folder",
      "Do you want to delete this folder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setFolders((prev) => prev.filter((f) => f.id !== fid)),
        },
      ],
      { cancelable: false }
    );
  };

  // Mở/đóng folder
  const toggleFolder = (id: string) =>
    setExpandedFolder((prev) => (prev === id ? null : id));

  // Chọn file
  const pickDoc = async () => {
    if (!expandedFolder) {
      Alert.alert("Lỗi", "Hãy mở một folder trước khi thêm file.");
      return;
    }
    try {
      const res: any = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (res.type === "success") {
        setFolders((prev) =>
          prev.map((f) =>
            f.id === expandedFolder
              ? {
                  ...f,
                  docs: [
                    ...f.docs,
                    { name: res.name, uri: res.uri, size: res.size },
                  ],
                }
              : f
          )
        );
      }
    } catch (err: any) {
      console.error("Error picking document:", err);
      Alert.alert("Lỗi", "Không thể chọn file: " + err.message);
    }
  };

  // Mở tài liệu
  const openDoc = (uri: string) => Linking.openURL(uri);

  // Xóa tài liệu
  const confirmDeleteDoc = (fid: string, uri: string) =>
    Alert.alert(
      "Xác nhận xóa tài liệu",
      "Bạn có chắc muốn xóa tài liệu này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () =>
            setFolders((prev) =>
              prev.map((f) =>
                f.id === fid
                  ? { ...f, docs: f.docs.filter((d) => d.uri !== uri) }
                  : f
              )
            ),
        },
      ],
      { cancelable: false }
    );

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add Folder</Text>
        </TouchableOpacity>
      </View>

      {/* Folder List */}
      <FlatList
        data={folders}
        keyExtractor={(f) => f.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Press “Add Folder” to start.</Text>
        }
        renderItem={({ item }) => {
          const isOpen = item.id === expandedFolder;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <TouchableOpacity
                  onPress={() => toggleFolder(item.id)}
                  style={styles.headerLeft}
                >
                  <MaterialCommunityIcons
                    name="folder-open-outline"
                    size={28}
                    color="#4F8EF7"
                  />
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.docs.length}</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.headerRight}>
                  <TouchableOpacity onPress={() => toggleFolder(item.id)}>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#888"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => confirmDeleteFolder(item.id)}
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={22}
                      color="#E74C3C"
                      style={{ marginLeft: 12 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {isOpen && (
                <View style={styles.cardBody}>
                  <TouchableOpacity style={styles.innerBtn} onPress={pickDoc}>
                    <MaterialCommunityIcons
                      name="file-plus-outline"
                      size={20}
                      color="#4F8EF7"
                    />
                    <Text style={styles.innerBtnText}>Thêm Document</Text>
                  </TouchableOpacity>

                  {item.docs.length === 0 ? (
                    <Text style={styles.emptyText}>Chưa có file nào.</Text>
                  ) : (
                    item.docs.map((doc) => (
                      <View key={doc.uri} style={styles.docRow}>
                        <TouchableOpacity
                          style={styles.docInfo}
                          onPress={() => openDoc(doc.uri)}
                        >
                          <Text style={styles.docName} numberOfLines={1}>
                            {doc.name}
                          </Text>
                          {doc.size != null && (
                            <Text style={styles.docSize}>
                              {(doc.size / 1024).toFixed(1)} KB
                            </Text>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => confirmDeleteDoc(item.id, doc.uri)}
                        >
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={22}
                            color="#C0C0C0"
                          />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>
          );
        }}
      />

      <BottomNavBar />

      {/* Modal tạo Folder */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Folder</Text>
            <TextInput
              placeholder="Name of folder"
              value={newFolderName}
              onChangeText={setNewFolderName}
              style={styles.input}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleAddFolder}
              >
                <Text style={styles.saveText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  controls: { flexDirection: "row", padding: 16 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F8EF7",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: { color: "#fff", fontSize: 16, marginLeft: 6, fontWeight: "600" },
  list: { paddingHorizontal: 16, paddingBottom: 80 },
  card: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  headerRight: { flexDirection: "row", alignItems: "center" },
  cardTitle: { fontSize: 17, fontWeight: "600", marginLeft: 12 },
  badge: {
    backgroundColor: "#EAF5FA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: { fontSize: 13, color: "#4F8EF7" },
  cardBody: { borderTopWidth: 1, borderTopColor: "#EEE", padding: 12 },
  innerBtn: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  innerBtnText: {
    marginLeft: 6,
    fontSize: 15,
    color: "#4F8EF7",
    fontWeight: "500",
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  docInfo: { flex: 1, marginRight: 10 },
  docName: { fontSize: 15, color: "#333" },
  docSize: { fontSize: 13, color: "#888", marginTop: 2 },
  emptyText: { textAlign: "center", color: "#AAA", padding: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  modalBtns: { flexDirection: "row", justifyContent: "flex-end" },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginLeft: 12,
  },
  cancelBtn: { backgroundColor: "#F0F0F0" },
  saveBtn: { backgroundColor: "#4F8EF7" },
  cancelText: { color: "#555", fontSize: 15 },
  saveText: { color: "#fff", fontSize: 15 },
});
