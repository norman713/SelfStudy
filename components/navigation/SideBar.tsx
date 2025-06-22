import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigationContext } from "@/context/NavigationContext";

interface SidebarProps {
  initialTab: string;
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { sideNavPath, onChangeSidePath, bottomNavPath } =
    useNavigationContext();

  // Define menu items based on bottomNavPath
  const menuItems =
    bottomNavPath === "Team"
      ? [
          {
            id: "Main",
            label: "Main",
            icon: (
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                size={24}
                color="#1E282D"
              />
            ),
          },
          {
            id: "Plan",
            label: "Plan",
            icon: (
              <MaterialCommunityIcons name="target" size={24} color="#1E282D" />
            ),
          },
          {
            id: "Document",
            label: "Document",
            icon: (
              <MaterialCommunityIcons
                name="file-document-outline"
                size={24}
                color="#1E282D"
              />
            ),
          },
          {
            id: "Chat",
            label: "Chat",
            icon: (
              <MaterialCommunityIcons
                name="chat-outline"
                size={24}
                color="#1E282D"
              />
            ),
          },
        ]
      : [
          {
            id: "Plan",
            label: "Plan",
            icon: (
              <MaterialCommunityIcons name="target" size={24} color="#1E282D" />
            ),
          },
          {
            id: "Document",
            label: "Document",
            icon: (
              <MaterialCommunityIcons
                name="file-document-outline"
                size={24}
                color="#1E282D"
              />
            ),
          },
          {
            id: "Session",
            label: "Session",
            icon: (
              <MaterialCommunityIcons
                name="timer-outline"
                size={24}
                color="#1E282D"
              />
            ),
          },
          {
            id: "Statistic",
            label: "Statistic",
            icon: (
              <MaterialCommunityIcons
                name="chart-box-outline"
                size={24}
                color="#1E282D"
              />
            ),
          },
        ];

  return (
    <View style={styles.sidebar}>
      {/* Close Button */}
      <Pressable style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close-circle-outline" size={24} color="white" />
      </Pressable>

      <Image
        source={require("../../assets/images/Header.png")}
        style={styles.logo}
      />

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.menuItem,
              sideNavPath === item.id && styles.activeMenuItem, // Sử dụng sideNavPath để xác định tab đang chọn
            ]}
            onPress={() => {
              onChangeSidePath(sideNavPath, item.id);
            }}
          >
            {item.icon}
            <Text style={[styles.menuText]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    height: "100%",
    backgroundColor: "white",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 2,
  },
  logo: {
    width: "100%",
  },
  menu: {
    gap: 10,
    padding: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  activeMenuItem: {
    backgroundColor: "#EDEDED",
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#1E282D",
    fontFamily: "Poppins_400Regular",
  },
});
