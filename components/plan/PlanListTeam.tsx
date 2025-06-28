import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PlanItem from "./PlanItem";

interface Plan {
  id: string;
  progress: number;
  planName: string;
  deadline: string;
  isAdmin: boolean;
}

interface PlanListProps {
  onPlanPress: (planName: string) => void;
  plans?: Plan[];
}

export default function PlanList({ onPlanPress, plans }: PlanListProps) {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="target" size={30} color="#7AB2D3" />
        <Text style={styles.headerText}>Plans</Text>
      </View>
      {plans?.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => onPlanPress(item.planName)}
          style={styles.planItemContainer}
        >
          <PlanItem
            planName={item.planName}
            progress={item.progress}
            deadline={item.deadline}
          />
          {item.isAdmin && (
            <MaterialCommunityIcons
              name="account-outline"
              size={25}
              color="#7AB2D3"
              style={styles.adminIcon}
            />
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "flex-start",
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
  planItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  adminIcon: {
    marginLeft: 5,
  },
});
