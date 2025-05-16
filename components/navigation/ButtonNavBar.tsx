import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, BackHandler } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigationContext } from "@/context/NavigationContext";
import { usePathname } from "expo-router";

interface BottomNavBarProps {
  onAddPress?: () => void;
}

export default function BottomNavBar({ onAddPress }: BottomNavBarProps) {
  const [activeTab, setActiveTab] = useState("");
  const { onChangeBottomPath, setBottomPath } = useNavigationContext();
  const pathname = usePathname();

  useEffect(() => {
    const loadActiveTab = () => {
      let tab = "";

      if (pathname.startsWith("/Me")) {
        tab = "Me";
      }

      if (pathname.startsWith("/MissedDeadline")) {
        tab = "MissedDeadline";
      }

      if (pathname.startsWith("/Notification")) {
        tab = "Notification";
      }

      if (pathname.startsWith("/Team")) {
        tab = "Team";
      }

      if (activeTab === tab) return;
      setActiveTab(tab);
      setBottomPath(tab);
    };
    loadActiveTab();
  }, [pathname]);

  return (
    <View style={styles.container}>
      {/* Left Navigation Items */}
      <View style={[styles.leftNavItems, !onAddPress && styles.noAddNavItems]}>
        <Pressable
          style={styles.navItem}
          onPress={() => {
            onChangeBottomPath(activeTab, "Me");
            setActiveTab("Me");
          }}
        >
          <MaterialIcons
            name="person"
            size={24}
            color={activeTab === "Me" ? "#7AB2D3" : "#C0C0C0"}
          />
          <Text
            style={[
              styles.navText,
              { color: activeTab === "Me" ? "#7AB2D3" : "#C0C0C0" },
            ]}
          >
            Me
          </Text>
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => {
            onChangeBottomPath(activeTab, "MissedDeadline");
            setActiveTab("MissedDeadline");
          }}
        >
          <MaterialIcons
            name="error"
            size={24}
            color={activeTab === "MissedDeadline" ? "#7AB2D3" : "#C0C0C0"}
          />
          <Text
            style={[
              styles.navText,
              { color: activeTab === "MissedDeadline" ? "#7AB2D3" : "#C0C0C0" },
            ]}
          >
            Missed Deadline
          </Text>
        </Pressable>
      </View>

      {/* Center Add Button (Only if onAddPress is provided) */}
      {onAddPress && (
        <View style={styles.centerButtonWrapper}>
          <LinearGradient
            colors={["#B9E5E8", "#7AB2D3"]}
            style={styles.addButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <Pressable
              onPress={() => {
                setActiveTab("Add");
                onAddPress();
              }}
            >
              <Ionicons name="add-outline" size={36} color="white" />
            </Pressable>
          </LinearGradient>
        </View>
      )}

      {/* Right Navigation Items */}
      <View style={[styles.rightNavItems, !onAddPress && styles.noAddNavItems]}>
        <Pressable
          style={styles.navItem}
          onPress={() => {
            onChangeBottomPath(activeTab, "Team");
            setActiveTab("Team");
          }}
        >
          <MaterialIcons
            name="group"
            size={24}
            color={activeTab === "Team" ? "#7AB2D3" : "#C0C0C0"}
          />
          <Text
            style={[
              styles.navText,
              { color: activeTab === "Team" ? "#7AB2D3" : "#C0C0C0" },
            ]}
          >
            Team
          </Text>
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => {
            onChangeBottomPath(activeTab, "Notification");
            setActiveTab("Notification");
          }}
        >
          <MaterialIcons
            name="notifications"
            size={24}
            color={activeTab === "Notification" ? "#7AB2D3" : "#C0C0C0"}
          />
          <Text
            style={[
              styles.navText,
              {
                color: activeTab === "Notification" ? "#7AB2D3" : "#C0C0C0",
              },
            ]}
          >
            Notification
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    elevation: 5,
    paddingHorizontal: 20,
    width: "95%",
    borderRadius: 40,
    borderColor: "rgba(1,1,1,0.1)",
    borderWidth: 1,
    paddingVertical: 3,
    marginBottom: 5,
    justifyContent: "space-between",
  },
  leftNavItems: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  rightNavItems: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  noAddNavItems: {
    gap: 40,
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    fontWeight: "600",
  },
  centerButtonWrapper: {
    position: "absolute",
    top: "-55%",
    left: "45%",
    transform: [{ translateX: 0 }],
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
