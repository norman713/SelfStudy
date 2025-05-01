import React, { useEffect, useState } from "react";
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

import LoadingScreen from "@/components/LoadingScreen";
import { Colors } from "@/constants/Colors";

import { hasDuplicateStrings } from "@/util/validator";

export default function PlanScreen() {
  interface Task {
    id: string;
    name: string;
    status: string;
  }

  interface PlanInfo {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    notifyBefore: string;
    status: string;
    completeDate: string | null;
  }

  interface Message {
    title: string;
    description: string;
  }

  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Mock Task 1", status: "INCOMPLETE" },
    { id: "2", name: "Mock Task 2", status: "COMPLETED" },
  ]);

  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    name: "Mock Plan",
    description: "This is a mock plan description.",
    startDate: formatDateToISOString(new Date()),
    endDate: formatDateToISOString(new Date(Date.now() + 86400000)),
    notifyBefore: "00:30:00",
    status: "INCOMPLETE",
    completeDate: null,
  });

  const [newTask, setNewTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskName, setEditingTaskName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [addedTasks, setAddedTask] = useState<string[]>([]);
  const [deletedTaskIds, setDeletedTaskIds] = useState<string[]>([]);
  const [showError, setShowError] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({
    title: "",
    description: "",
  });

  const handleAddTask = (): void => {
    if (newTask.trim() !== "") {
      setAddedTask((prevTasks: string[]) => [...prevTasks, newTask]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id: string, isChecked: boolean): void => {
    setTasks((prevTasks: Task[]) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, status: isChecked ? "COMPLETED" : "INCOMPLETE" }
          : task
      )
    );
  };

  const handleDeleteTask = (id: string): void => {
    setTasks((prevTasks: Task[]) => prevTasks.filter((task) => task.id !== id));
    setDeletedTaskIds((prev: string[]) => [...prev, id]);
  };

  const startEditingTask = (id: string, name: string): void => {
    setEditingTaskId(id);
    setEditingTaskName(name);
  };

  const saveEditedTask = (id: string): void => {
    setTasks((prevTasks: Task[]) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, name: editingTaskName } : task
      )
    );
    setEditingTaskId(null);
    setEditingTaskName("");
  };

  const handleDeleteNewTask = (index: number): void => {
    setAddedTask((prevTasks: string[]) =>
      prevTasks.filter((_, taskIndex) => taskIndex !== index)
    );
  };

  const handleChange = (field: string, value: string) => {
    setPlanInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (): void => {
    if (planInfo.name === "") {
      setShowError(true);
      setMessage({ title: "Error", description: "Name is required." });
      return;
    }

    if (
      new Date(planInfo.startDate).getTime() >=
      new Date(planInfo.endDate).getTime()
    ) {
      setShowError(true);
      setMessage({
        title: "Error",
        description: "The start date must come before the end date.",
      });
      return;
    }

    const taskNames = tasks.map((item: Task) => item.name);

    if (hasDuplicateStrings([...taskNames, ...addedTasks])) {
      setShowError(true);
      setMessage({
        title: "Error",
        description: "Cannot have tasks with the same name.",
      });
      return;
    }

    console.log("Saved plan:", planInfo);
    console.log("Tasks:", tasks);
    console.log("Added tasks:", addedTasks);
    console.log("Deleted task IDs:", deletedTaskIds);
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
        <View style={styles.divideLine}></View>
        <View style={styles.tasksSectionWrapper}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          {tasks.map((item: Task) => {
            return (
              <View key={item.id}>
                <View style={styles.taskContainer}>
                  <Checkbox
                    isChecked={item.status === "COMPLETED"}
                    onToggle={(isChecked) =>
                      toggleTaskCompletion(item.id, isChecked)
                    }
                  />
                  <View style={styles.taskContent}>
                    {editingTaskId === item.id ? (
                      <TextInput
                        style={styles.taskInput}
                        value={editingTaskName}
                        onChangeText={setEditingTaskName}
                        onSubmitEditing={() => saveEditedTask(item.id)}
                        autoCorrect={false}
                        keyboardType="default"
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() => startEditingTask(item.id, item.name)}
                      >
                        <Text
                          style={[
                            styles.taskText,
                            item.status === "COMPLETE" &&
                              styles.taskTextCompleted,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={24}
                      color="#C0C0C0"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          {addedTasks.map((item: string, index: number) => (
            <View key={index} style={styles.taskContainer}>
              <MaterialCommunityIcons
                name="checkbox-blank-outline"
                size={24}
                color={Colors.green}
              />
              <TextInput
                style={[styles.taskInput, { marginLeft: 10 }]}
                value={item}
                editable={false}
              />
              <TouchableOpacity onPress={() => handleDeleteNewTask(index)}>
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
      <View style={styles.buttonContainer}>
        <CustomButton title="Save" onPress={handleSave} />
      </View>

      {loading && <LoadingScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeview: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "white",
    padding: 10,
  },
  container: {
    flex: 1,
  },
  tasksSectionWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#7AB2D3",
    marginBottom: 20,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    elevation: 4,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  taskContent: {
    flex: 1,
    marginHorizontal: 10,
  },
  taskText: {
    fontSize: 14,
    color: "#000",
  },
  taskInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  addTaskInput: {
    fontSize: 14,
    color: "#000",
    flex: 1,
    marginLeft: 10,
  },
  divideLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(1,1,1,0.2)",
    margin: 20,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
});
