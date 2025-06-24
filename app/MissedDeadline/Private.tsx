import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Checkbox from "@/components/Checkbox";
import PlanItemNoti from "@/components/plan/PlanItemNoti";

const plansData = [
  {
    progress: 78.6,
    planName: "PLAN01",
    deadline: "2024-12-02 11:20:00",
  },
  {
    progress: 60,
    planName: "PLAN02",
    deadline: "2024-12-03 10:00:00",
  },
];

const PrivatePage: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    plansData.map(() => false)
  );
  const [isAllChecked, setIsAllChecked] = useState(false);

  const handleCheckAllToggle = () => {
    const newCheckedState = !isAllChecked;
    setIsAllChecked(newCheckedState);
    setCheckedItems(plansData.map(() => newCheckedState));
  };

  const handleItemToggle = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);

    setIsAllChecked(newCheckedItems.every((item) => item));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Check All Section */}
      <View style={styles.checkAllContainer}>
        <Checkbox onToggle={handleCheckAllToggle} isChecked={isAllChecked} />
        <Text style={styles.checkAllText}>Check all</Text>
      </View>

      {plansData.map((plan, index) => (
        <PlanItemNoti
          key={index}
          progress={plan.progress}
          planName={plan.planName}
          deadline={plan.deadline}
          isChecked={checkedItems[index]}
          onToggle={() => handleItemToggle(index)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  checkAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  checkAllText: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "500",
  },
});

export default PrivatePage;
