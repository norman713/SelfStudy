import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { router } from "expo-router";
import AddPlan from "@/components/plan/AddPlan";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Error from "@/components/Message/Error";
import { hasDuplicateStrings } from "@/util/validator";
import Checkbox from "@/components/Checkbox";

type Member = { id: string; name: string; avatar: string };
type Task = {
  id: string;
  name: string;
  status: string;
  assignee: Member | null;
};
const mockTasks: Task[] = [
  { id: "1", name: "Mock Task 1", status: "INCOMPLETE", assignee: null },
];

export default function PlanScreen() {
  const [planInfo, setPlanInfo] = useState({
    name: "",
    description: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    notifyBefore: "00:00:00",
  });
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskName, setEditingTaskName] = useState("");
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  const [members] = useState<Member[]>([
    { id: "u1", name: "Anna12", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: "u2", name: "Anna13", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: "u3", name: "Anna23", avatar: "https://i.pravatar.cc/150?img=3" },
  ]);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newTask,
        status: "INCOMPLETE",
        assignee: null,
      },
    ]);
    setNewTask("");
  };

  const handleDeleteTask = (taskId: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

  const toggleTaskCompletion = (taskId: string, checked: boolean) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: checked ? "COMPLETED" : "INCOMPLETE" }
          : t
      )
    );
  const startEditingTask = (taskId: string, name: string) => {
    setEditingTaskId(taskId);
    setEditingTaskName(name);
  };

  const saveEditedTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, name: editingTaskName } : t))
    );
    setEditingTaskId(null);
    setEditingTaskName("");
  };

  const handleSave = () => {
    // Validation
    if (!planInfo.name) {
      setShowError(true);
      setMessage({ title: "Error", description: "Name is required." });
      return;
    }
    if (new Date(planInfo.startDate) >= new Date(planInfo.endDate)) {
      setShowError(true);
      setMessage({
        title: "Error",
        description: "The start date must come before the end date.",
      });
      return;
    }
    if (hasDuplicateStrings(tasks.map((t) => t.name))) {
      setShowError(true);
      setMessage({
        title: "Error",
        description: "Cannot create tasks with duplicate names.",
      });
      return;
    }

    setLoading(true);
    // Mock save delay
    setTimeout(() => {
      setLoading(false);
      // Log mock data to console
      console.log("Mock plan saved:", planInfo);
      console.log("Mock tasks saved:", tasks);
      // Navigate back
      router.push("/Team/Plan");
    }, 1000);
  };
  // Cho modal chọn assignee
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const openAssignModal = (taskId: string) => {
    setCurrentTaskId(taskId);
    setSearchText("");
    setModalVisible(true);
  };

  const assignMember = (member: Member) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === currentTaskId ? { ...t, assignee: member } : t))
    );
    setModalVisible(false);
    setCurrentTaskId(null);
  };

  // Lọc danh sách theo searchText
  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeview}>
      <BackButton />
      <ScrollView style={styles.container}>
        <AddPlan setPlanInfo={setPlanInfo} />
        <View style={styles.divideLine} />

        <View style={styles.tasksSectionWrapper}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          {tasks.map((item) => (
            <View key={item.id} style={styles.taskContainer}>
              <Checkbox
                isChecked={item.status === "COMPLETED"}
                onToggle={(chk) => toggleTaskCompletion(item.id, chk)}
              />
              <View style={styles.taskContent}>
                {editingTaskId === item.id ? (
                  <TextInput
                    style={styles.taskInput}
                    value={editingTaskName}
                    onChangeText={setEditingTaskName}
                    onSubmitEditing={() => saveEditedTask(item.id)}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => startEditingTask(item.id, item.name)}
                  >
                    <Text
                      style={[
                        styles.taskText,
                        item.status === "COMPLETED" && styles.taskTextCompleted,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.assignButton}
                onPress={() => openAssignModal(item.id)}
              >
                {item.assignee ? (
                  <Image
                    source={{ uri: item.assignee.avatar }}
                    style={styles.avatar}
                  />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      size={24}
                      color="#7AB2D3"
                    />
                    <Text style={styles.assignText}>Choose assignee</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <MaterialCommunityIcons
                  name="delete"
                  size={24}
                  color="#C0C0C0"
                />
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.addTaskContainer}>
            <TouchableOpacity onPress={handleAddTask}>
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={30}
                color="#7AB2D3"
              />
            </TouchableOpacity>
            <TextInput
              style={styles.addTaskInput}
              placeholder="Add new task"
              value={newTask}
              onChangeText={setNewTask}
            />
          </View>
        </View>
      </ScrollView>

      {/* Modal chọn assignee có search bar */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search user</Text>
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search user..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              data={filteredMembers}
              keyExtractor={(m) => m.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.memberRow}
                  onPress={() => assignMember(item)}
                >
                  <Image
                    source={{ uri: item.avatar }}
                    style={styles.avatarSmall}
                  />
                  <Text style={styles.memberName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <CustomButton title="Save" onPress={handleSave} />
      </View>

      {showError && (
        <Error
          title={message.title}
          description={message.description}
          onClose={() => setShowError(false)}
          visible={showError}
          onOkPress={() => setShowError(false)}
        />
      )}

      {loading && <Text style={styles.loadingText}>Saving...</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeview: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  container: { flex: 1 },
  divideLine: {
    height: 1,
    backgroundColor: "rgba(1,1,1,0.2)",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#7AB2D3",
    marginBottom: 20,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  tasksSectionWrapper: { flex: 1, paddingHorizontal: 10 },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    width: "100%",
    height: 44,
  },
  taskInput: { flex: 1, marginLeft: 10, fontSize: 14, color: "#000" },
  taskCompleted: { textDecorationLine: "line-through", color: "#808080" },
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
    padding: 10,
  },
  taskContent: { flex: 1, marginHorizontal: 10 },
  addTaskInput: { flex: 1, marginLeft: 10, fontSize: 14, color: "#000" },
  buttonContainer: { width: "100%", paddingHorizontal: 10 },
  loadingText: { textAlign: "center", marginTop: 10 },
  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  assignText: { marginLeft: 4, color: "#7AB2D3" },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  taskText: { fontSize: 14, color: "#000" },
  taskTextCompleted: { textDecorationLine: "line-through", color: "gray" },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  modalSearchInput: {
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  memberName: { fontSize: 16 },
  closeButton: { marginTop: 12, alignSelf: "flex-end" },
  closeText: { color: "#7AB2D3", fontSize: 16 },
});
