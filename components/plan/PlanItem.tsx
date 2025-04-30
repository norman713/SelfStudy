import { Colors } from "@/constants/Colors";
import { formatDateTime } from "@/util/format";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";

// Định nghĩa kiểu cho props
interface PlanItemProps {
  progress: number;
  planName: string;
  deadline: string;
}

export default function PlanItem({
  progress,
  planName,
  deadline,
}: PlanItemProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  const radius = 30;

  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (normalizedProgress / 100) * circumference;

  return (
    <View style={styles.container}>
      {/* Progress Circle SVG */}
      <Svg
        height={(radius + strokeWidth) * 2}
        width={(radius + strokeWidth) * 2}
      >
        {/* Định nghĩa gradient */}
        <Defs>
          <LinearGradient id="gradientId" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={Colors.primary} />
            <Stop offset="100%" stopColor={Colors.secondary} />
          </LinearGradient>
        </Defs>

        {/* Vòng tròn nền */}
        <Circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="#E3E3E3"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Vòng tròn tiến độ */}
        <Circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="url(#gradientId)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius + strokeWidth} ${
            radius + strokeWidth
          })`}
        />

        {/* Text phần trăm nằm giữa vòng tròn */}
        <SvgText
          x={radius + strokeWidth}
          y={radius + strokeWidth}
          fill="black"
          fontSize="13"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {`${normalizedProgress.toFixed(0)}%`.trim()}
        </SvgText>
      </Svg>

      {/* Plan Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.planName}>{planName}</Text>
        <View style={styles.deadlineContainer}>
          <Text style={styles.deadlineLabel}>Deadline:</Text>
          <Text style={styles.deadline}>{formatDateTime(deadline)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: "rgba(1,1,1,0.1)",
    borderWidth: 1,
    width: "100%",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 10,
  },
  planName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  deadlineLabel: {
    fontSize: 13,
    color: "gray",
    marginRight: 4,
  },
  deadline: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7AB2D3",
  },
});
