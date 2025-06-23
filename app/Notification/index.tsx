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
  const [selectedTab, setSelectedTab] = useState<"plan" | "invitation">("plan");
  const [notifications, setNotifications] = useState<any[]>([
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
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleReadStatus = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleAccept = (id: number) => {
    console.log(`Accepted invitation for notification ID: ${id}`);
  };

  const handleDecline = (id: number) => {
    console.log(`Declined invitation for notification ID: ${id}`);
  };

  // Filter notifications based on selected tab
  const filteredNotifications = notifications.filter((notif) =>
    selectedTab === "invitation" ? "people" in notif : !("people" in notif)
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "plan" && styles.activeTab]}
          onPress={() => setSelectedTab("plan")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "plan" && styles.activeTabText,
            ]}
          >
            Plans
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "invitation" && styles.activeTab]}
          onPress={() => setSelectedTab("invitation")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "invitation" && styles.activeTabText,
            ]}
          >
            Invitations
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.markAllContainer}
          onPress={markAllAsRead}
        >
          <Text style={styles.markAllText}>Mark all as read</Text>
          <MaterialIcons
            name="check-circle-outline"
            size={24}
            color="#7AB2D3"
          />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {filteredNotifications.map((notif) =>
            "people" in notif ? (
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
            ) : notif.expiredTime ? (
              <PlanWill
                key={notif.id}
                name={notif.name}
                createAt={notif.createAt}
                expiredTime={notif.expiredTime}
                isRead={notif.isRead}
                onToggleRead={() => toggleReadStatus(notif.id)}
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
  container: { flex: 1, backgroundColor: "white" },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#7AB2D3",
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 16,
    color: "#777",
  },
  activeTabText: {
    color: "#7AB2D3",
    fontWeight: "bold",
  },
  content: { flex: 1, paddingHorizontal: 20, paddingBottom: 70 },
  markAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
    marginTop: 20,
  },
  markAllText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7AB2D3",
  },
  scrollContainer: { paddingBottom: 16 },
  bottomNavBar: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Noti;
