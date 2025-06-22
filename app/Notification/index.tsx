import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import PlanCard from "@/components/Noti/PlanCard";
import PlanWill from "@/components/Noti/PlanWill";
import Invite from "@/components/Noti/Invite";
import BottomNavBar from "@/components/navigation/ButtonNavBar";
import { SafeAreaView } from "react-native-safe-area-context";

const Noti: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: "PLAN 1",
      createAt: "09:00:00 12/02/2025",
      recoveryTime: "00:00:00 on 15/02/2025",
      isRead: false,
    },
    {
      id: 2,
      name: "PLAN 2",
      createAt: "10:00:00 10/02/2025",
      expiredTime: "23:59:59 14/02/2025",
      isRead: true,
    },
    {
      id: 3,
      name: "Invitation",
      createAt: "08:00:00 11/02/2025",
      people: "Annie",
      team: "SE100",
      isRead: false,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const toggleReadStatus = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: !notif.isRead } : notif
      )
    );
  };

  const handleAccept = (id: number) => {
    console.log(`Accepted invitation for notification ID: ${id}`);
  };

  const handleDecline = (id: number) => {
    console.log(`Declined invitation for notification ID: ${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.markAllContainer}
          onPress={markAllAsRead}
        >
          <Text style={styles.markAllText}>Mark as read all</Text>
          <MaterialIcons
            name="check-circle-outline"
            size={24}
            color="#7AB2D3"
          />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {notifications.map((notif) =>
            notif.id === 2 ? (
              <PlanWill
                key={notif.id}
                name={notif.name}
                createAt={notif.createAt}
                expiredTime={notif.expiredTime}
                isRead={notif.isRead}
                onToggleRead={() => toggleReadStatus(notif.id)}
              />
            ) : notif.id === 3 ? (
              <Invite
                key={notif.id}
                name={notif.name}
                createAt={notif.createAt}
                people={notif.people}
                team={notif.team}
                isRead={notif.isRead}
                onToggleRead={() => toggleReadStatus(notif.id)}
                onAccept={() => handleAccept(notif.id)}
                onDecline={() => handleDecline(notif.id)}
              />
            ) : (
              <PlanCard
                key={notif.id}
                name={notif.name}
                createAt={notif.createAt}
                recoveryTime={notif.recoveryTime}
                isRead={notif.isRead}
                onToggleRead={() => toggleReadStatus(notif.id)}
              />
            )
          )}
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavBar}>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 70,
  },
  markAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 16,
    gap: 10,
    marginTop: 20,
  },
  markAllText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7AB2D3",
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  modalButton: {
    alignItems: "center",
    marginVertical: 20,
  },
  bottomNavBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Noti;
