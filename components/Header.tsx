import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import Sidebar from "../components/navigation/SideBar";
import { usePathname } from "expo-router";
import { useNavigationContext } from "@/context/NavigationContext";
import { useUser } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Header({ showMenu = true, onLogout = () => {} }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Plan");
  const pathname = usePathname();
  const { setSidePath } = useNavigationContext();
  const router = useRouter();
  const [viewWidth, setViewWidth] = useState(0);

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setViewWidth(width);
  };
  const { user } = useUser();

  useEffect(() => {
    const loadActiveTab = () => {
      let tab = "Plan";
      switch (pathname) {
        case "/Me/Plan":
        case "/Team/Plan":
          tab = "Plan";
          break;
        case "/Me/Document":
          tab = "Document";
          break;
        case "/Me/Session":
          tab = "Session";
          break;
        case "/Me/Statistic":
          tab = "Statistic";
          break;
      }

      if (tab === activeTab) return;
      setActiveTab(tab);
      setSidePath(tab);
    };
    loadActiveTab();
  }, [pathname]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleSelectOption = (option: string) => {
    setIsDropdownVisible(false);
    if (option === "Profile") {
      router.push("/Me/Profile");
    } else if (option === "Log out") {
      onLogout();

      AsyncStorage.clear();
      router.push("/Authen/Login");
    }
  };

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.container}>
        {showMenu && (
          <LinearGradient
            colors={[Colors.secondary, Colors.primary]}
            style={styles.iconContainer}
          >
            <Pressable onPress={toggleSidebar}>
              <Ionicons name="list" size={24} color="white" />
            </Pressable>
          </LinearGradient>
        )}
        <Pressable
          style={styles.rightContainer}
          onLayout={handleLayout}
          onPress={toggleDropdown}
        >
          <Ionicons
            name="chevron-down"
            size={24}
            color={Colors.primary}
            style={styles.iconDown}
          />
          <Text style={styles.userName}>{user?.username}</Text>
          <Image
            source={{
              uri:
                user?.avatarUrl ??
                "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
            }}
            style={styles.avatar}
          />
        </Pressable>
      </View>
      <View style={styles.bottomBorder} />

      {isDropdownVisible && (
        <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
          <View style={styles.dropdownOverlay}>
            <View style={[styles.dropdown, { right: viewWidth }]}>
              <Pressable
                style={styles.dropdownItem}
                onPress={() => handleSelectOption("Profile")}
              >
                <Text style={styles.dropdownText}>Profile</Text>
              </Pressable>
              <Pressable
                style={styles.dropdownItem}
                onPress={() => handleSelectOption("Log out")}
              >
                <Text style={styles.dropdownText}>Log out</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      <Modal
        transparent={true}
        visible={isSidebarVisible}
        onRequestClose={toggleSidebar}
      >
        <View style={styles.modalContainer}>
          <Sidebar initialTab={activeTab} onClose={toggleSidebar} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    width: "100%",
    backgroundColor: "transparent",
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF5FA",
    borderRadius: 10,
    elevation: 4,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: 10,
  },
  userName: {
    fontSize: 16,
    color: "black",
    marginRight: 5,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
  iconDown: {
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bottomBorder: {
    borderBottomColor: "rgba(1,1,1,0.1)",
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  dropdownOverlay: {
    position: "absolute",
    top: 50,
    right: -80,
    zIndex: 9999, // Ensure it appears on top
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: 95,
  },
  dropdownItem: {
    paddingVertical: 5,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
