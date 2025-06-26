import { Text, StyleSheet, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCustomFonts from "@/hooks/useCustomFonts";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import BottomNavBar from "@/components/navigation/ButtonNavBar";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Calendar, DateData } from "react-native-calendars";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PlanItem from "@/components/plan/PlanItem";
import userApi from "@/api/userApi";

interface Plan {
  id: string;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  notifyBefore: string;
  status: string;
  progress: number;
  completeDate: string | null;
}

export default function Plan() {
  const { fontsLoaded } = useCustomFonts();
  const router = useRouter();

  const searchParams = useLocalSearchParams();
  if (!fontsLoaded) return null;

  const [markedDatesArray, setMarkedDatesArray] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectDatePlans, setSelectDatePlans] = useState<Plan[]>([]);
  const [todayPlanNum, setTodayPlanNum] = useState(0);

  const [currentSelectMonth, setCurrentSelectMonth] = useState<number>(0);
  const [currentSelectYear, setCurrentSelectYear] = useState<number>(0);

  useEffect(() => {
    if (!selectedDate) return;
    userApi.getPersonalPlans(selectedDate).then((data) => {
      const filteredPlans = data as unknown as Plan[];
      setSelectDatePlans(filteredPlans);
      console.log(
        "Preload:",
        searchParams.reloadId,
        "Selected Date:",
        selectedDate
      );
      const today = new Date().toISOString().split("T")[0];
      if (selectedDate === today) {
        setTodayPlanNum(filteredPlans.length);
      }
    });
  }, [selectedDate, searchParams.reloadId]);

  // markedDatesArray
  useEffect(() => {
    userApi
      .getPersonalPlansInMonths(currentSelectMonth, currentSelectYear)
      .then((data) => {
        const dates = data as unknown as string[];
        setMarkedDatesArray(dates);
      });
  }, [currentSelectMonth, currentSelectYear]);

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
            initialDate={new Date().toISOString().split("T")[0]}
            onMonthChange={(date: DateData) => {
              setCurrentSelectMonth(date.month);
              setCurrentSelectYear(date.year);
            }}
            onDayPress={(date: DateData) => {
              setSelectedDate(date.dateString);
            }}
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
                deadline={item.endAt}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomNavBar onAddPress={() => router.push("/Me/AddPlan")} />
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
