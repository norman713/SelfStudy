import React, { useEffect, useState } from "react";
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
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PlanInfo from "../../components/plan/PlanInfo";
import BackButton from "@/components/BackButton";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import Checkbox from "@/components/CheckBox";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { formatDateToISOString } from "@/util/format";
import teamApi from "@/api/teamApi";
import { useTeamContext } from "@/context/TeamContext";
import { useUser } from "@/context/UserContext";
interface Reminder {
  id: string;
  remindAt: string;
}
interface Task {
  id: string;
  name: string;
  completed: boolean;
  assigneeId?: string;
  assigneeAvatarUrl?: string;
}
interface UpdateTask {
  id: string;
  completed: boolean;
}
interface UpdateTasksAssignee {
  id: string;
  assigneeId: string;
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

type Member = { id: string; name: string; avatar: string };
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
  ].join(":");
  console.log("Time difference:", output);
  return output;
}

export default function PlanScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const searchParams = useLocalSearchParams();
  const { user } = useUser();
  const id = searchParams.planId as string;
  const { getId } = useTeamContext();
  const [planInfo, setPlanInfo] = useState<Plan>();
  const [newTask, setNewTask] = useState("");
  const [newTasksToAdd, setNewTasksToAdd] = useState<
    { name: string; assigneeId: string }[]
  >([]);

  const [updateTask, setUpdateTask] = useState<UpdateTask[]>([]);
  const [updateTasksAssignee, setUpdateTasksAssignee] = useState<
    UpdateTasksAssignee[]
  >([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskName, setEditingTaskName] = useState("");
  const [deletedTaskIds, setDeletedTaskIds] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState({ title: "", description: "" });

  const [members, setMembers] = useState<Member[]>([]);

  // Modal choose assignee
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
      prev.map((t) =>
        t.id === currentTaskId
          ? { ...t, assigneeId: member.id, assigneeAvatarUrl: member.avatar }
          : t
      )
    );
    if (!currentTaskId) return;

    setUpdateTasksAssignee((prev) => {
      const exists = prev.some((t) => t.id === currentTaskId);
      if (exists) {
        return prev.map((t) =>
          t.id === currentTaskId ? { ...t, assigneeId: member.id } : t
        );
      } else {
        return [
          ...prev,
          {
            id: currentTaskId,
            assigneeId: member.id,
          },
        ];
      }
    });
    setModalVisible(false);
    setCurrentTaskId(null);
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // fetch team info
  useEffect(() => {
    teamApi.getPlan(id).then((data) => {
      const plan = data as unknown as Plan;
      setPlanInfo(plan);
      console.log("Plan data:", plan);
      setTasks(plan.tasks || []);
    });
  }, []);

  //fetch member
  useEffect(() => {
    teamApi.searchMembers(getId(), searchText).then((response) => {
      const res = response as unknown as {
        members: { userId: string; username: string; avatarUrl: string }[];
      };
      const mapped = res.members.map((m) => ({
        id: m.userId,
        name: m.username,
        avatar: m.avatarUrl || "https://i.pravatar.cc/150?img=1",
      }));
      setMembers(mapped);
    });
  }, []);

  // task
  const handleAddTask = () => {
    if (!newTask.trim()) return;

    // Mặc định người tạo là assignee nếu chưa chọn ai
    const defaultAssigneeId = user?.id || "";

    const tempTask = {
      id: `temp-${Date.now()}`,
      name: newTask,
      completed: false,
      assigneeId: defaultAssigneeId,
      assigneeAvatarUrl: user?.avatarUrl,
    };

    setTasks((prev) => [...prev, tempTask]);

    setNewTasksToAdd((prev) => [
      ...prev,
      {
        name: newTask,
        assigneeId: defaultAssigneeId,
      },
    ]);

    setNewTask("");
  };

  // task status
  const toggleTaskCompletion = (taskId: string, checked: boolean) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (task.assigneeId !== user?.id) {
      Alert.alert("Can not edit", "You are not the assignee.", [
        { text: "OK" },
      ]);
      return;
    }
    setUpdateTask((prev) => {
      const exists = prev.some((t) => t.id === taskId);
      if (exists) {
        return prev.map((t) =>
          t.id === taskId ? { ...t, completed: checked } : t
        );
      } else {
        const targetTask = tasks.find((t) => t.id === taskId);
        if (!targetTask || !targetTask.assigneeId) return prev;

        return [
          ...prev,
          {
            id: taskId,
            completed: checked,
            assigneeId: targetTask.assigneeId,
          },
        ];
      }
    });

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: checked } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setDeletedTaskIds((prev) => [...prev, taskId]);
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

  // PlanInfo handlers
  const handleChange = (field: string, value: string) => {
    setPlanInfo((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = () => {
    // Basic validation
    if (!planInfo?.name) {
      setShowError(true);
      setMessage({ title: "Error", description: "Name is required." });
      return;
    }

    Promise.all([
      teamApi.updatePlan(id, {
        name: planInfo.name,
        description: planInfo.description,
        startAt: new Date(planInfo.startAt).toISOString(),
        endAt: new Date(planInfo.endAt).toISOString(),
      }),
      teamApi.updateTasksStatus(
        id,
        updateTask.map((task) => ({
          id: task.id,
          isCompleted: task.completed,
        }))
      ),
      teamApi.deleteTasks(id, deletedTaskIds),

      teamApi.updateTasksAssignee(
        id,
        updateTasksAssignee.map((task) => ({
          id: task.id,
          assigneeId: task.assigneeId,
        }))
      ),
      newTasksToAdd.length > 0
        ? teamApi.addTask({
            planId: id,
            tasks: newTasksToAdd,
          })
        : Promise.resolve(), // nếu không có task mới thì skip
    ]).finally(() => {
      router.push({
        pathname: "/Team/Plan",
        params: { reloadId: Date.now().toString() },
      });
    });
  };

  return (
    <SafeAreaView style={styles.safeview}>
      <BackButton />
      <ScrollView style={styles.container}>
        {planInfo && (
          <PlanInfo
            name={planInfo.name}
            description={planInfo.description}
            startDate={planInfo.startAt}
            endDate={planInfo.endAt}
            notifyBefore={
              planInfo.reminders[0]?.remindAt
                ? computeNotifyBefore(
                    new Date(planInfo.endAt),
                    new Date(planInfo.reminders[0]?.remindAt)
                  )
                : "00:00:00"
            }
            status={planInfo.completeAt ? "COMPLETED" : "INCOMPLETE"}
            completeDate={planInfo.completeAt}
            handleChangeValue={handleChange}
          />
        )}
        <View style={styles.divideLine} />

        <View style={styles.tasksSectionWrapper}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          {tasks.map((item) => (
            <View key={item.id} style={styles.taskContainer}>
              <Checkbox
                isChecked={item.completed}
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
                        item.completed && styles.taskTextCompleted,
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
                {item.assigneeId ? (
                  <Image
                    source={{ uri: item.assigneeAvatarUrl }}
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
