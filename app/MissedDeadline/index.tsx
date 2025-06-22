import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import PrivatePage from "./Private";
import TeamPage from "./Team";
import { LinearGradient } from "expo-linear-gradient";
import BottomNavBar from "@/components/navigation/ButtonNavBar";
import { SafeAreaView } from "react-native-safe-area-context";

const MissedDeadline: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"private" | "team">("private");
  const [currentRole, setCurrentRole] = useState<string>(
    selectedTab === "private" ? "admin" : "member"
  );

  const handleTabChange = (tab: "private" | "team") => {
    setSelectedTab(tab);
    setCurrentRole(tab === "private" ? "admin" : "member");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Icon Section */}
      <View style={styles.iconContainer}>
        {currentRole === "admin" ? (
          <>
            <LinearGradient
              colors={["#B9E8BE", "#3FBE4E"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.iconButton}
            >
              <Pressable
                onPress={() => console.log("Refresh pressed")}
                style={({ pressed }) => [
                  styles.iconContent,
                  pressed && styles.iconPressed,
                ]}
              >
                <MaterialIcons name="refresh" size={20} color="white" />
              </Pressable>
            </LinearGradient>
            <LinearGradient
              colors={["#FFA4A5", "#FF2D30"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.iconButton}
            >
              <Pressable
                onPress={() => console.log("Delete pressed")}
                style={({ pressed }) => [
                  styles.iconContent,
                  pressed && styles.iconPressed,
                ]}
              >
                <MaterialIcons name="delete" size={20} color="white" />
              </Pressable>
            </LinearGradient>
          </>
        ) : (
          <>
            <View style={styles.iconPlaceholder} />
            <View style={styles.iconPlaceholder} />
          </>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, selectedTab === "private" && styles.activeTab]}
          onPress={() => handleTabChange("private")}
        >
          <Text style={styles.tabText}>PRIVATE</Text>
        </Pressable>

        <Pressable
          style={[styles.tab, selectedTab === "team" && styles.activeTab]}
          onPress={() => handleTabChange("team")}
        >
          <Text style={styles.tabText}>TEAM</Text>
        </Pressable>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {selectedTab === "private" && <PrivatePage />}
        {selectedTab === "team" && (
          <TeamPage
            onRoleChange={(role) => {
              console.log(`Role changed to: ${role}`);
              setCurrentRole(role); // Update role dynamically
            }}
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={{ alignItems: "center" }}>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    minHeight: 40, // Ensure consistent height for the icon container
  },
  iconButton: {
    borderRadius: 5,
    padding: 4,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  iconPressed: {
    opacity: 0.7, // Add visual feedback when pressed
  },
  iconPlaceholder: {
    marginLeft: 10,
    width: 40,
    height: 40,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#1E282D",
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: 5,
  },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: "#7AB2D3",
  },
  tabText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
  },
});

export default MissedDeadline;
