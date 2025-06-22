import React, { useEffect, useRef } from "react";
import {
  Svg,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { View, StyleSheet } from "react-native";

interface ProgressCircleProps {
  radius?: number;
  strokeWidth?: number;
  totalTime: number;
  timeRemaining: number; // Thời gian còn lại (truyền từ bên ngoài)
  gradientColors?: [string, string];
  isRunning?: boolean;
  onComplete?: () => void;
  onTick?: (remaining: number) => void; // Callback để cập nhật thời gian
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  radius = 70,
  strokeWidth = 10,
  totalTime,
  timeRemaining,
  gradientColors = ["#7AB2D3", "#B9E5E8"],
  isRunning = false,
  onComplete,
  onTick,
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const CIRCUMFERENCE = 2 * Math.PI * radius;
  const strokeDashoffset = CIRCUMFERENCE * (1 - timeRemaining / totalTime);
  const size = radius * 2 + strokeWidth;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (timeRemaining > 0) {
          const newRemaining = timeRemaining - 1;
          onTick?.(newRemaining); // Gọi callback để cập nhật thời gian
        } else {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          onComplete?.();
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeRemaining]);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </LinearGradient>
          <LinearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#848484" />
            <Stop offset="100%" stopColor="#242424" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EAEAEA"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <SvgText
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="48"
          fontWeight="bold"
          fill="url(#textGradient)"
        >
          {formatTime(timeRemaining)}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProgressCircle;
