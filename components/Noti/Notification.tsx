import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import dayjs from 'dayjs';
import Checkbox from "../CheckBox";
import { useState } from "react";
import { router, useRouter } from "expo-router";

interface NotificationProps {
    id: string;
    title : string;
    createdAt: string;
    content: string;
    subject: string;
    subjectId: string;
    read: boolean;
    isChecked: boolean;
    onToggle?: () => void;
}

export default function Notification({
    id,
    title,
    createdAt,
    content,
    subject,
    subjectId,
    read,
    isChecked = false,
    onToggle
}: NotificationProps) {
    const teamId = '';
    const router = useRouter();
    const formattedDate = dayjs(createdAt, 'DD-MM-YY HH:mm:ss').format('HH:mm:ss DD/MM/YY');

    const handlePress = () => {
      var url = '';

      switch(subject) {
        case "TEAM":
          url = "/team/" + subjectId;
          break;
        case "PLAN":
          url = "planDetail/"
          break;
      }

      //Call Api to get plan type

      //router.push(`/Me/PlanDetail?planId=${id}`);
      //Routing

    }

    return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.statusRow}>
        <View style={styles.statusContainer}>
          {read ? (
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
              <Text style={[styles.statusText, { color: 'red' }]}>unread</Text>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={16}
                color="red"
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.contentRow}>
        <Checkbox 
            onToggle={onToggle || (() => {})} 
            isChecked={isChecked}>
        </Checkbox>
        <View style={styles.iconWrapper}>
            <Image source={require('../../assets/images/notification-bell.png')} style={styles.iconImage} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.expiredTime}>{formattedDate}</Text>
          <Text style={styles.description}>{content}</Text>
        </View>
      </View>

    </Pressable>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 10,
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  iconWrapper: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#FF5B5E",
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
  expiredTime: {
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.5)",
  },
  description: {
    fontSize: 14,
    color: "#000000",
  },
});