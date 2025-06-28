import React, { useState, useMemo, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomFonts from "@/hooks/useCustomFonts";
import Header from "@/components/Header";
import BottomNavBar from "../../components/navigation/ButtonNavBar";
import { router, useNavigation } from "expo-router";
import PlanList from "@/components/plan/PlanListTeam";
import { Colors } from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { useTeamContext } from "@/context/TeamContext";

// helper lấy ngày hôm nay dưới dạng "YYYY-MM-DD"
const getTodayString = () => new Date().toISOString().split("T")[0];

// Mock data kế hoạch
type MockPlan = {
  planName: string;
  date: string; // "YYYY-MM-DD"
};

const mockPlans: MockPlan[] = [
  { planName: "Team meeting", date: "2025-06-23" },
  { planName: "Submit report", date: "2025-06-23" },
  { planName: "Design session", date: "2025-06-24" },
  { planName: "Code review", date: "2025-06-23" },
  { planName: "Client call", date: "2025-06-25" },
];

const mockGroups = [
  { id: "g1", name: "Group A" },
  { id: "g2", name: "Group B" },
  { id: "g3", name: "Group C" },
];
export default function Plan() {
  const { fontsLoaded } = useCustomFonts();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const navigation = useNavigation();
  const { setId, getId } = useTeamContext();
  const [teamId, setTeamId] = useState<string | null>(null);

  const [groups] = useState(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState(groups[0].id);

  // Lấy teamId từ context
  useEffect(() => {
    const id = getId();
    setTeamId(id);
  }, [getId()]);
  if (!fontsLoaded) return null;

  const handlePlanPress = (planName: string) => {
    router.push(`/Team/PlanDetail?planName=${encodeURIComponent(planName)}`);
  };

  // Lọc ra plans của ngày đang chọn
  const plansForDate = mockPlans.filter((p) => p.date === selectedDate);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    // đánh dấu từng ngày có ít nhất 1 plan
    mockPlans.forEach(({ date }) => {
      if (!marks[date]) {
        marks[date] = { marked: true, dotColor: Colors.red };
      }
    });
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: Colors.primary,
      selectedTextColor: "#fff",
    };
    return marks;
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text>Team ID: {teamId}</Text>
        <Text style={styles.title}>
          Hey, you have{" "}
          <Text style={styles.highlightText}>{plansForDate.length}</Text> plans
          today!
        </Text>
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            markedDates={markedDates}
            onDayPress={(day: { dateString: React.SetStateAction<string> }) =>
              setSelectedDate(day.dateString)
            }
            theme={{
              arrowColor: Colors.primary,
              dayTextColor: "#000000",
              todayTextColor: Colors.primary,
              monthTextColor: "#333333",
            }}
          />
        </View>
        <View style={styles.planListContainer}>
          <PlanList plans={plansForDate} onPlanPress={handlePlanPress} />
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <BottomNavBar onAddPress={() => router.push("/Team/AddPlan")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 20,
  },
  title: {
    fontFamily: "Roboto_400Regular",
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  calendarContainer: {
    width: "90%",
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    marginBottom: 20,
  },
  planListContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  highlightText: {
    color: Colors.primary,
    fontWeight: "900",
  },
  bottom: {
    alignItems: "center",
  },
  dropdownContainer: {
    borderColor: Colors.primary,
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
    paddingVertical: 10,
  },
  picker: { height: 50, width: "50%" },
});
