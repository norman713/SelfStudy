import { Text, StyleSheet, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomFonts from "@/hooks/useCustomFonts";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import BottomNavBar from "@/components/navigation/ButtonNavBar";
import { router, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Calendar } from "react-native-calendars";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PlanItem from "@/components/plan/PlanItem";

interface Plan {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  notifyBefore: string;
  status: string;
  progress: number;
  completeDate: string | null;
}
const mockPlans: Plan[] = [
  {
    id: "1",
    name: "Design mobile UI",
    description: "Create UI wireframes for new app",
    startDate: "2025-05-13",
    endDate: "2025-06-14",
    notifyBefore: "1",
    status: "In Progress",
    progress: 0.4,
    completeDate: null,
  },
  {
    id: "2",
    name: "Prepare pitch deck",
    description: "Slides for investor meeting",
    startDate: "2025-01-30",
    endDate: "2025-06-20",
    notifyBefore: "2",
    status: "Not Started",
    progress: 0.0,
    completeDate: null,
  },
  {
    id: "3",
    name: "Deploy new API",
    description: "Push backend to production",
    startDate: "2025-06-13",
    endDate: "2025-06-21",
    notifyBefore: "1",
    status: "Done",
    progress: 1,
    completeDate: "2025-04-30",
  },
];

export default function Plan() {
  const { fontsLoaded } = useCustomFonts();
  const router = useRouter();

  if (!fontsLoaded) return null;

  const [markedDatesArray, setMarkedDatesArray] = useState<string[]>([
    "2025-04-30",
    "2025-05-01",
    "2025-05-02",
  ]);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectDatePlans, setSelectDatePlans] = useState<Plan[]>([]);
  const [todayPlanNum, setTodayPlanNum] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Ngày hiện tại
    const todayPlans = mockPlans.filter(
      (plan) => plan.startDate <= today && plan.endDate >= today
    );
    setTodayPlanNum(todayPlans.length);
    setSelectDatePlans(todayPlans);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    // Lọc kế hoạch dựa trên selectedDate nằm trong phạm vi startDate đến endDate
    const filteredPlans = mockPlans.filter(
      (plan) => plan.startDate <= selectedDate && plan.endDate >= selectedDate
    );
    setSelectDatePlans(filteredPlans);
  }, [selectedDate]);

  // markedDatesArray
  useEffect(() => {
    const deadlines = mockPlans.map((plan) => plan.endDate);
    setMarkedDatesArray(deadlines);
  }, [mockPlans]);

  const getMarkedDates = () => {
    const markedDates: Record<string, any> = {};

    markedDatesArray.forEach((date) => {
      markedDates[date] = {
        marked: true,
        dotColor: Colors.red,
      };
    });

    if (selectedDate) {
      markedDates[selectedDate] = {
        ...(markedDates[selectedDate] || {}),
        selected: true,
        selectedColor: Colors.primary,
        selectedTextColor: "#FFFFFF",
      };
    }

    return markedDates;
  };
  const handlePlanPress = (planId: string) => {
    // Điều hướng đến trang PlanDetail và truyền planId qua URL
    router.push(`/Me/PlanDetail?planId=${planId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>
          Hey, you have <Text style={styles.highlightText}>{todayPlanNum}</Text>{" "}
          plans today!
        </Text>
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={getMarkedDates()}
            theme={{
              arrowColor: Colors.primary,
              dayTextColor: "#000000",
            }}
          />
        </View>
        <View style={styles.planListContainer}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="target" size={30} color="#7AB2D3" />
            <Text style={styles.headerText}>Plans</Text>
          </View>
          {selectDatePlans.map((item) => (
            <Pressable key={item.id} onPress={() => handlePlanPress(item.id)}>
              <PlanItem
                planName={item.name}
                progress={Number(item.progress) * 100}
                deadline={item.endDate}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomNavBar onAddPress={() => router.push("/Authen/Login")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContainer: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  title: {
    fontFamily: "Roboto_400Regular",
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginVertical: 20,
  },
  calendarContainer: {
    width: 350,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderColor: "rgba(1,1,1,0.1)",
    borderWidth: 1,
  },
  planListContainer: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
  highlightText: {
    color: Colors.primary,
    fontWeight: "900",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    marginLeft: 8,
  },
});
