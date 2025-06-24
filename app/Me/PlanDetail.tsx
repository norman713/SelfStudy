import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PlanInfo from "../../components/plan/PlanInfo";
import BackButton from "@/components/BackButton";
import { router, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import Checkbox from "@/components/CheckBox";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { formatDateToISOString } from "@/util/format";
// Using mock data instead of real APIs
const mockPlanInfo = {
  name: "Mock Plan",
  description: "This is a mock plan description.",
  startDate: formatDateToISOString(new Date()),
  endDate: formatDateToISOString(new Date(Date.now() + 86400000)),
  notifyBefore: "00:30:00",
  status: "INCOMPLETE",
  completeDate: null,
};

export default function PlanScreen() {
  // Mock data
  const mockTasks = [
    { id: "1", name: "Mock Task 1", status: "INCOMPLETE" },
    { id: "2", name: "Mock Task 2", status: "COMPLETED" },
  ];

  // State
  const [tasks, setTasks] = useState(mockTasks);
  const [planInfo, setPlanInfo] = useState(mockPlanInfo);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskName, setEditingTaskName] = useState("");
  const searchParams = useLocalSearchParams();
  const id = searchParams.id as string;
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState({ title: "", description: "" });

  // Handlers
  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks((prev) => [
        ...prev,
        { id: Date.now().toString(), name: newTask, status: "INCOMPLETE" },
      ]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (taskId: string, isChecked: boolean) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: isChecked ? "COMPLETED" : "INCOMPLETE" }
          : t
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

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

  const handleChange = (field: string, value: string) => {
    setPlanInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Basic validation
    if (!planInfo.name) {
      setShowError(true);
      setMessage({ title: "Error", description: "Name is required." });
      return;
    }

    // Mock save: log to console
    console.log("Saved plan:", planInfo);
    console.log("Tasks:", tasks);
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
      </ScrollView>
      <View style={styles.tasksSectionWrapper}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        {tasks.map((item) => (
          <View key={item.id} style={styles.taskContainer}>
            <Checkbox
              isChecked={item.status === "COMPLETED"}
              onToggle={(checked) => toggleTaskCompletion(item.id, checked)}
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

            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
              <MaterialCommunityIcons name="delete" size={24} color="#C0C0C0" />
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

      <View style={styles.buttonContainer}>
        <CustomButton title="Save" onPress={handleSave} />
      </View>

      {/* {showError && (
        <Error
          title={message.title}
          description={message.description}
          onClose={() => setShowError(false)}
          visible={showError}
          onOkPress={() => setShowError(false)}
        />
      )} */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeview: { flex: 1, backgroundColor: "white", padding: 10 },
  container: { flex: 1 },
  tasksSectionWrapper: { flex: 1, paddingHorizontal: 20 },
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
  addTaskContainer: { flexDirection: "row", alignItems: "center" },
  addTaskInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  taskTextCompleted: { textDecorationLine: "line-through", color: "gray" },
  divideLine: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 20,
  },
  buttonContainer: { paddingHorizontal: 10 },
});
