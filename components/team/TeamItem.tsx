import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ImageSourcePropType,
} from "react-native";

interface TeamItemProps {
  title: string;
  imageSource: string; // Compatible with ImageSourcePropType
  isAdmin?: boolean;
  style?: ViewStyle;
  onPress?: () => void; // Thêm onPress tùy chọn
}

export default function TeamItem({
  title,
  imageSource,
  isAdmin = false,
  style,
  onPress, // Nhận prop onPress
}: TeamItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View
      style={[
        styles.wrapper,
        showTooltip && { zIndex: 999 }, // tăng zIndex nếu tooltip mở
        style,
      ]}
    >
      <TouchableOpacity onPress={onPress}>
        {/* Thêm onPress vào đây, nếu có */}
        <View style={styles.container}>
          {/* Left: Avatar + Title */}
          <View style={styles.leftSection}>
            <Image source={{ uri: imageSource }} style={styles.avatar} />
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Right: Admin icon */}
          {isAdmin && (
            <TouchableOpacity
              style={styles.adminWrapper}
              onPress={() => setShowTooltip(!showTooltip)}
              activeOpacity={0.8}
            >
              <Image
                src={imageSource}
                style={styles.adminIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* Tooltip */}
      {isAdmin && showTooltip && (
        <View style={styles.tooltipAbsolute}>
          <Text style={styles.adminLabelText}>You're admin of this team.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    color: "#222",
  },
  adminWrapper: {
    padding: 4,
  },
  adminIcon: {
    width: 24,
    height: 24,
  },
  tooltipAbsolute: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    width: 100,
  },
  adminLabelText: {
    fontSize: 12,
    color: "#666",
  },
});
