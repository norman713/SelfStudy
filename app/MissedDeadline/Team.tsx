import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Select from "@/components/Select";
import PlanItemNoti from "@/components/plan/PlanItemNoti";
import Checkbox from "@/components/CheckBox";
import { router } from "expo-router";

// Mock data per team
const teamsData = {
  // Team1: {
  //   role: "admin",
  //   plans: [
  //     { progress: 78.6, planName: "PLAN01", deadline: "2024-12-02 11:20:00" },
  //     { progress: 30, planName: "PLAN02", deadline: "2024-12-03 10:00:00" },
  //   ],
  // },
  // Team2: {
  //   role: "admin",
  //   plans: [
  //     { progress: 90, planName: "PLAN03", deadline: "2024-12-04 14:00:00" },
  //     { progress: 50, planName: "PLAN04", deadline: "2024-12-05 12:00:00" },
  //   ],
  // },
  Biology: {
    role: "member",
    plans: [
      { progress: 40, planName: "PLAN05", deadline: "2024-12-06 16:00:00" },
      { progress: 70, planName: "PLAN06", deadline: "2024-12-07 18:00:00" },
    ],
  },
};

type TeamPageProps = {
  onRoleChange: (role: string) => void;
};

const TeamPage: React.FC<TeamPageProps> = ({ onRoleChange }) => {
  const teamKeys = Object.keys(teamsData) as Array<keyof typeof teamsData>;
  const [selectedTeam, setSelectedTeam] = useState<keyof typeof teamsData>(
    teamKeys[0]
  );
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  // Current team data
  const currentTeam = teamsData[selectedTeam];
  const isAdmin = currentTeam.role === "admin";

  // Notify parent about role
  useEffect(() => {
    onRoleChange(currentTeam.role);
  }, [selectedTeam]);

  // Reset checkboxes when team changes
  useEffect(() => {
    setCheckedItems(currentTeam.plans.map(() => false));
    setIsAllChecked(false);
  }, [selectedTeam]);

  const handleCheckAllToggle = () => {
    if (!isAdmin) return;
    const newState = !isAllChecked;
    setIsAllChecked(newState);
    setCheckedItems(currentTeam.plans.map(() => newState));
  };

  const handleItemToggle = (index: number) => {
    if (!isAdmin) return;
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
    setIsAllChecked(newChecked.every(Boolean));
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Current team</Text>

        {/* Dropdown select team */}
        <View style={styles.dropdownWrapper}>
          <Select
            options={teamKeys}
            value={selectedTeam}
            onChange={(val) => setSelectedTeam(val as keyof typeof teamsData)}
          />
        </View>

        {/* Check all for admin */}
        {isAdmin && (
          <View style={styles.checkAllContainer}>
            <Checkbox
              isChecked={isAllChecked}
              onToggle={handleCheckAllToggle}
            />
            <Text style={styles.checkAllText}>Check all</Text>
          </View>
        )}

        {/* Plans list */}
        {currentTeam.plans.map((plan, idx) => (
          <PlanItemNoti
            key={idx}
            progress={plan.progress}
            planName={plan.planName}
            deadline={plan.deadline}
            isChecked={checkedItems[idx]}
            onToggle={isAdmin ? () => handleItemToggle(idx) : undefined}
            showCheckbox={isAdmin}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "white" },
  container: { flexGrow: 1, padding: 16 },
  title: { fontSize: 14, color: "rgba(0,0,0,0.5)", marginBottom: 8 },
  checkAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkAllText: { marginLeft: 8, fontSize: 16, color: "#333" },
  dropdownWrapper: {
    marginBottom: 20,
    position: "relative",
    zIndex: 999, // iOS
    elevation: 999, // android
  },
});

export default TeamPage;
