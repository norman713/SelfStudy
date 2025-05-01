import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Circle, Svg } from "react-native-svg";
import Header from "@/components/Header";
import BottomNavBar from "@/components/navigation/ButtonNavBar";

export default function Statistic() {
  // Mock data — có thể sửa tuỳ ý
  const [hoursSpent] = useState("12:45");
  const [finishedPlans] = useState(7);
  const [totalCompletion] = useState(85); // %
  const [completeSessions] = useState(65); // %

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Weekly report</Text>

          <View style={styles.topStatsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{finishedPlans}</Text>
              <Text style={styles.statLabel}>Finished plans</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{hoursSpent}</Text>
              <Text style={styles.statLabel}>Hour spent on study session</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Plans finish in total</Text>
            <View style={styles.circularChart}>
              <Svg height="180" width="180" viewBox="0 0 36 36">
                <Circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#EAEAEA"
                  strokeWidth="2.5"
                />
                <Circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#7AB2D3"
                  strokeWidth="2.5"
                  strokeDasharray={`${totalCompletion} ${
                    100 - totalCompletion
                  }`}
                  strokeDashoffset="25"
                  transform="rotate(-90 18 18)"
                />
              </Svg>
              <Text style={styles.percentageText}>{totalCompletion}%</Text>
            </View>
          </View>

          <View style={styles.pieContainer}>
            <Text style={styles.chartTitle}>Study session complete</Text>
            <View style={styles.pieContainer1}>
              <Svg height="180" width="180" viewBox="0 -8 35 50">
                <Circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#4A628A"
                  strokeWidth="15"
                />
                <Circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#7AB2D3"
                  strokeWidth="15"
                  strokeDasharray={`${completeSessions} ${
                    100 - completeSessions
                  }`}
                  strokeDashoffset="25"
                  transform="rotate(-90 18 18)"
                />
              </Svg>

              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendBox, { backgroundColor: "#7AB2D3" }]}
                  />
                  <Text style={styles.legendText}>Complete</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendBox, { backgroundColor: "#4A628A" }]}
                  />
                  <Text style={styles.legendText}>Incomplete</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7AB2D3",
    textAlign: "center",
    marginVertical: 35,
  },
  topStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    width: "45%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    alignItems: "center",
    paddingVertical: 15,
    elevation: 2,
  },
  statNumber: {
    fontSize: 54,
    fontWeight: "bold",
    color: "#7AB2D3",
  },
  statLabel: {
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.5)",
    textAlign: "center",
  },

  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.5)",
    marginBottom: 10,
    textAlign: "center",
  },
  circularChart: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  percentageText: {
    position: "absolute",
    fontSize: 40,
    fontWeight: "bold",
    color: "#7AB2D3",
  },
  pieContainer: {
    alignItems: "center",

    marginBottom: 20,
  },
  pieContainer1: {
    display: "flex",
    flexDirection: "row",
  },
  legendContainer: {
    flexDirection: "column",
    marginTop: 10,
    justifyContent: "center",
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendBox: {
    width: 15,
    height: 15,
    borderRadius: 3,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: "#4A628A",
  },
  bottom: {
    alignItems: "center",
  },
});
