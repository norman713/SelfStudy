import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Modal,
  Image,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PlanInfo from "../../components/plan/PlanInfo";
import BackButton from "@/components/BackButton";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import Checkbox from "@/components/Checkbox";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { formatDateToISOString } from "@/util/format";

type Member = { id: string; name: string; avatar: string };
type Task = {
  id: string;
  name: string;
  status: string;
  assignee: Member | null;
};
type PlanInfoType = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  notifyBefore: string;
  status: string;
  completeDate: string | null;
};

const mockPlanInfo: PlanInfoType = {
  name: "Mock Plan",
  description: "This is a mock plan description.",
  startDate: formatDateToISOString(new Date()),
  endDate: formatDateToISOString(new Date(Date.now() + 86400000)),
  notifyBefore: "00:30:00",
  status: "INCOMPLETE",
  completeDate: null,
};

const mockTasks: Task[] = [
  { id: "1", name: "Mock Task 1", status: "INCOMPLETE", assignee: null },
  { id: "2", name: "Mock Task 2", status: "COMPLETED", assignee: null },
];

export default function PlanScreen() {
  const searchParams = useLocalSearchParams();
  const planId = searchParams.id as string;

  const [planInfo, setPlanInfo] = useState<PlanInfoType>(mockPlanInfo);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskName, setEditingTaskName] = useState("");
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState({ title: "", description: "" });

  const [members] = useState<Member[]>([
    { id: "u1", name: "Anna12", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: "u2", name: "Anna13", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: "u3", name: "Anna23", avatar: "https://i.pravatar.cc/150?img=3" },
  ]);

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

  // Task handlers
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

  const toggleTaskCompletion = (taskId: string, checked: boolean) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: checked ? "COMPLETED" : "INCOMPLETE" }
          : t
      )
    );

  const handleDeleteTask = (taskId: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

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

  // PlanInfo handlers
  const handleChange = (field: string, value: string) => {
    setPlanInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!planInfo.name) {
      setShowError(true);
      setMessage({ title: "Error", description: "Name is required." });
      return;
    }
    console.log("Saved plan:", planInfo, "Tasks:", tasks);
    router.push("/Me/Plan");
  };

  return (
    <SafeAreaView style={styles.safeview}>
      <BackButton />
      <ScrollView style={styles.container}>
        <PlanInfo
          name={planInfo.name}
          description={planInfo.description}
          startDate={planInfo.startDate}
          endDate={planInfo.endDate}
          notifyBefore={planInfo.notifyBefore}
          status={planInfo.status}
          completeDate={planInfo.completeDate}
          handleChangeValue={handleChange}
        />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeview: { flex: 1, backgroundColor: "white", padding: 10 },
  container: { flex: 1 },
  divideLine: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 20,
  },
  tasksSectionWrapper: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, color: "#7AB2D3", marginBottom: 20 },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  taskContent: { flex: 1, marginHorizontal: 10 },
  taskText: { fontSize: 14, color: "#000" },
  taskInput: { flex: 1, fontSize: 14, color: "#000" },
  taskTextCompleted: { textDecorationLine: "line-through", color: "gray" },
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addTaskInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  assignText: { marginLeft: 4, color: "#7AB2D3" },
  avatar: { width: 32, height: 32, borderRadius: 16 },

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

  buttonContainer: { padding: 10 },
});
