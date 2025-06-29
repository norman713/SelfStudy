import React, { useState, useMemo, useEffect } from "react";

import { Calendar, DateData } from "react-native-calendars";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomFonts from "@/hooks/useCustomFonts";
import Header from "@/components/Header";
import BottomNavBar from "../../components/navigation/ButtonNavBar";
import { router, useNavigation } from "expo-router";
import PlanList from "@/components/plan/PlanListTeam";
import { Colors } from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import teamApi from "@/api/teamApi";
import { useTeamContext } from "@/context/TeamContext";


const getTodayString = () => new Date().toISOString().split("T")[0];
type MockPlan = {
  planName: string;
  date: string; // "YYYY-MM-DD"
};

interface Plan {
  id: string;
  progress: number;
  planName: string;
  deadline: string;
  isAssigned: boolean;
}

export default function Plan() {
  const { fontsLoaded } = useCustomFonts();
  const [markDates, setMarkDates] = useState<string[]>([]);
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1); 
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const { getId: getTeamId } = useTeamContext();
  const [plans, setPlans] = useState<Plan[]>([]);

  if (!fontsLoaded) return null;

  const handlePlanPress = (planId: string) => {
    router.push(`/Team/PlanDetail?planId=${encodeURIComponent(planId)}`);
  };
  useEffect(() => {
    teamApi.listPlansByDate(selectedDate, getTeamId()).then((response) => {
      const plansData = response as unknown as {
        id: string;
        name: string;
        endAt: string;
        progress: number;
        assigned: boolean;
      }[];
      setPlans(
        plansData.map((plan) => ({
          id: plan.id,
          progress: plan.progress * 100,
          planName: plan.name,
          deadline: plan.endAt,
          isAssigned: plan.assigned,
        }))
      );
    });

    teamApi.getPlansMarkInMonth(getTeamId(), month, year).then((response) => {
      const markData = response as unknown as string[];

      console.log("Marked Dates aaa:", markData);
      setMarkDates(markData);
    });
  }, [selectedDate]);

  const getMarkedDates = () => {
    const markedDates: Record<string, any> = {};

    markDates.forEach((date) => {
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
    console.log("Marked Dates:", markedDates, markDates);

    return markedDates;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text>Team ID: {teamId}</Text>
        <Text style={styles.title}>
          Hey, you have <Text style={styles.highlightText}>{plans.length}</Text>{" "}
          plans today!
        </Text>
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            markedDates={getMarkedDates()}
            onMonthChange={(date: DateData) => {
              setMonth(date.month);
              setYear(date.year);
            }}
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
          <PlanList plans={plans} onPlanPress={handlePlanPress} />
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
    alignItems: "flex-start",
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
