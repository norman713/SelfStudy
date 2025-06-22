import React from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import defaultIcon from "../../assets/images/plan/notification.png";

interface PlanWillProps {
  name: string;
  expiredTime?: string;
  createAt: string;
  isRead: boolean;
  onToggleRead: () => void;
}

const PlanWill: React.FC<PlanWillProps> = ({
  name,
  expiredTime,
  createAt,
  isRead,
  onToggleRead,
}) => {
  return (
    <Pressable onPress={onToggleRead} style={styles.container}>
      <View style={styles.statusRow}>
        <View style={styles.statusContainer}>
          {isRead ? (
            <View style={styles.readStatus}>
              <Text style={styles.statusText}>read</Text>
              <MaterialIcons
                name="check-circle-outline"
                size={16}
                color="grey"
              />
            </View>
          ) : (
            <View style={styles.unreadStatus}>
              <Text style={styles.statusText}>unread</Text>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={16}
                color="grey"
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.iconWrapper}>
          <Image source={defaultIcon} style={styles.iconImage} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{name}</Text>
          {createAt && <Text style={styles.remindTime}>{createAt}</Text>}
          <Text style={styles.expiredTime}>
            Your plan will expire at {expiredTime}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  readStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  unreadStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    color: "grey",
    marginRight: 5,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  iconWrapper: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#7AB2D3",
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  remindTime: {
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.5)",
    marginBottom: 4,
  },
  expiredTime: {
    fontSize: 13,
    color: "#000000",
  },
});

export default PlanWill;
