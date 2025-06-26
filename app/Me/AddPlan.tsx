import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { router } from "expo-router";
import AddPlan from "@/components/plan/AddPlan";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Error from "@/components/Message/Error";
import { hasDuplicateStrings } from "@/util/validator";
import userApi from "@/api/userApi";

export default function PlanScreen() {
  const [planInfo, setPlanInfo] = useState({
    name: "",
    description: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    notifyBefore: "00:00:00",
  });
  const [tasks, setTasks] = useState([
    { id: 1, name: "Task01", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks((prev) => [
        ...prev,
        { id: prev.length + 1, name: newTask.trim(), completed: false },
      ]);
      setNewTask("");
    }
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskCompletion = (id: number, isChecked: boolean) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: isChecked } : t))
    );
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

    // Calculate remindTimes based on notifyBefore (format: "HH:mm:ss")
    const [hours, minutes, seconds] = planInfo.notifyBefore
      .split(":")
      .map(Number);
    const endDate = new Date(planInfo.endDate);
    const remindTime = new Date(endDate);
    remindTime.setHours(remindTime.getHours() - hours);
    remindTime.setMinutes(remindTime.getMinutes() - minutes);
    remindTime.setSeconds(remindTime.getSeconds() - seconds);

    const newData = {
      name: planInfo.name,
      description: planInfo.description,
      startAt: planInfo.startDate,
      endAt: planInfo.endDate,
      remindTimes: [remindTime.toISOString()],
      tasks: tasks.map((task) => task.name),
    };

    userApi.addPlan(newData).then(() => {
      console.log("Plan saved successfully");
      router.push("/Me/Plan");
    });
    setLoading(true);
    // Mock save delay
    setTimeout(() => {
      setLoading(false);
      console.log("Mock plan saved:", planInfo);
      console.log("Mock tasks saved:", tasks);
      router.push("/Me/Plan");
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeview}>
      <BackButton />
      <ScrollView style={styles.container}>
        <AddPlan setPlanInfo={setPlanInfo} />
        <View style={styles.divideLine} />

        <View style={styles.tasksSectionWrapper}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          <ScrollView>
            {tasks.map((item) => (
              <View key={item.id} style={styles.taskContainer}>
                <TouchableOpacity
                  onPress={() => toggleTaskCompletion(item.id, !item.completed)}
                >
                  <MaterialCommunityIcons
                    name={
                      item.completed
                        ? "checkbox-marked"
                        : "checkbox-blank-outline"
                    }
                    size={24}
                    color="#7AB2D3"
                  />
                </TouchableOpacity>
                <TextInput
                  style={[
                    styles.taskInput,
                    item.completed && styles.taskCompleted,
                  ]}
                  value={item.name}
                  editable={false}
                />
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
          </ScrollView>
        </View>
      </ScrollView>

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
  addTaskInput: { flex: 1, marginLeft: 10, fontSize: 14, color: "#000" },
  buttonContainer: { width: "100%", paddingHorizontal: 10 },
  loadingText: { textAlign: "center", marginTop: 10 },
});
