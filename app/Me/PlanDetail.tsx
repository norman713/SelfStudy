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
import userApi from "@/api/userApi";

interface Reminder {
  id: string;
  remindAt: string;
}

interface Task {
  id: string;
  name: string;
  completed: boolean
  assigneeId?: string;
  assigneeAvatarUrl?: string;
}

interface Plan {
  id: string;
  isTeamPlan: boolean;
  completeAt: string;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  reminders: Reminder[];
  tasks: Task[];
}

/**
 * Computes the time difference between endAt and notifyDate in "HH:mm:ss" format.
 * @param endAt ISO string or Date object representing the end time.
 * @param notifyDate ISO string or Date object representing the notify time.
 * @returns {string} The difference as "HH:mm:ss".
 */
function computeNotifyBefore(endAt: Date, notifyDate: Date): string {
  const end = endAt;
  const notify = notifyDate;

  console.log("End time:", end);
  console.log("Notify time:", notify);

  let diff = end.getTime() - notify.getTime();

  if (diff < 0) diff = 0;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const output = [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":")
  console.log("Time difference:", output)
  return output
}

export default function PlanScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletedTaskIds, setDeletedTaskIds] = useState<string[]>([]);
  const [planInfo, setPlanInfo] = useState<Plan>();
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskName, setEditingTaskName] = useState("");
  const searchParams = useLocalSearchParams();
  const id = searchParams.planId as string;
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState({ title: "", description: "" });

  // Handlers
  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      userApi.addTasks(planInfo!.id, [newTask]).finally(() => {
        console.log("New task added:", newTask);
        router.replace({
          pathname: "/Me/PlanDetail",
          params: { planId: id, reloadId: Date.now().toString() }
        });
      })
    }
  };
  useEffect(() => {
    userApi.getPlanByID(id).then((data) => {
      const plan = data as unknown as Plan;
      setPlanInfo(plan);
      console.log("Plan data:", plan);
      setTasks(plan.tasks || []);
    });
  }, [id]);

  const toggleTaskCompletion = (taskId: string, isChecked: boolean) => {
    setTasks((prev) =>
      prev?.map((t) =>
        t.id === taskId
          ? { ...t, completed: isChecked }
          : t
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev?.filter((t) => t.id !== taskId));
    setDeletedTaskIds((prev) => [...prev, taskId]);

  };

  const startEditingTask = (taskId: string, name: string) => {
    setEditingTaskId(taskId);
    setEditingTaskName(name);
  };

  const saveEditedTask = (taskId: string) => {
    setTasks((prev) =>
      prev?.map((t) => (t.id === taskId ? { ...t, name: editingTaskName } : t))
    );
    setEditingTaskId(null);
    setEditingTaskName("");
  };

  const handleChange = (field: string, value: string) => {
    setPlanInfo((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = () => {
    // Basic validation
    if (!planInfo?.name) {
      setShowError(true);
      setMessage({ title: "Error", description: "Name is required." });
      return;
    }

    Promise.all([
      userApi.updateTasksStatus(id, tasks.map((task) => ({
        id: task.id,
        isCompleted: task.completed,
      }))),
      userApi.updatePlan(id, {
        name: planInfo.name,
        description: planInfo.description,
        startAt: new Date(planInfo.startAt).toISOString(),
        endAt: new Date(planInfo.endAt).toISOString(),
      }),
      userApi.deleteTasks(id, deletedTaskIds),
    ])
      .finally(() => {
        // Mock save: log to console
        console.log("Saved plan:", planInfo);
        console.log("Tasks:", tasks);

        router.push({
          pathname: "/Me/Plan",
          params: { reloadId: Date.now().toString() },
        });
      })
  };


  return (
    <SafeAreaView style={styles.safeview}>
      <BackButton />
      <ScrollView style={styles.container}>
        {planInfo && (<PlanInfo
          name={planInfo.name}
          description={planInfo.description}
          startDate={planInfo.startAt}
          endDate={planInfo.endAt}
          notifyBefore={planInfo.reminders[0]?.remindAt ? computeNotifyBefore(new Date(planInfo.endAt), new Date(planInfo.reminders[0]?.remindAt)) : "00:00:00"}
          status={planInfo.completeAt ? "COMPLETED" : "IN_PROGRESS"}
          completeDate={planInfo.completeAt}
          handleChangeValue={handleChange}
        />)}
        <View style={styles.divideLine} />
        <View style={styles.tasksSectionWrapper}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          {tasks && tasks.map((item) => (
            <View key={item.id} style={styles.taskContainer}>
              <Checkbox
                isChecked={item.completed}
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
                        // item.status === "COMPLETED" && styles.taskTextCompleted,
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

      </ScrollView>

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
