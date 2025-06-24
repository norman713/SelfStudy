import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BottomNavBar from "@/components/navigation/ButtonNavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "@/components/CheckBox";
import Notification from "@/components/Noti/Notification";
import Invite from "@/components/Noti/Invite";
import notificationApi from "@/api/notificationApi";
import invitationApi from "@/api/invitationApi";

interface Notification {
  id: string;
  title: string;
  createdAt: string;
  content: string;
  subject: string;
  subjectId: string;
  read: boolean;
}

interface Invitation {
  id: string;
  inviterName: string;
  inviterAvatarUrl: string;
  teamId: string;
  teamName: string;
  invitedAt: string;
}

const Noti: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"notification" | "invitation">("notification");
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
      notifications.map(() => false)
  );
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleCheckAllToggle = () => {
    const newCheckedState = !isAllChecked;
    setIsAllChecked(newCheckedState);
    setCheckedItems(notifications.map(() => newCheckedState));
    
    if(newCheckedState) {
      setMarkedIds(new Set(notifications.map(n => n.id)));
    }
    else {
      setMarkedIds(new Set());
    }
  };

  const handleItemToggle = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);

    if(newCheckedItems[index]) {
      setMarkedIds((prev) => new Set(prev).add(notifications[index].id));
    }
    else {
      const newSet = new Set(markedIds);
      newSet.delete(notifications[index].id);
      setMarkedIds(newSet);
    }
    
    setIsAllChecked(newCheckedItems.every((item) => item));
  };

  const handleTabChange = (tab : "notification" | "invitation") => {
      setSelectedTab(tab);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationApi.get(10, '');

        const data: Notification[] = Array.isArray(response.notifications)
          ? response.notifications.map((item: any) => ({
              id: item.id,
              title: item.title,
              createdAt: item.createdAt,
              content: item.content,
              subject: item.subject,
              subjectId: item.subjectId,
              read: item.read,
            }))
          : [];
        setNotifications(data);
       } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
  }, [reloadTrigger]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await invitationApi.get(10, '');

        const data: Invitation[] = Array.isArray(response.invitations)
          ? response.invitations.map((item: any) => ({
              id: item.id,
              inviterName: item.inviterName,
              inviterAvatarUrl: item.inviterAvatarUrl,
              teamId: item.teamId,
              teamName: item.teamName,
              invitedAt: item.invitedAt
            }))
          : [];
        setInvitations(data);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchInvitations();
  }, [reloadTrigger]);

  const handleDelete = async () => {
    if(isAllChecked) {
      await notificationApi.deleteAll();
    }
    else {
      await notificationApi.deleteSelected(markedIds);
    }

    setReloadTrigger((prev) => prev + 1);
  }

  const handleMark = async () => {
    if(isAllChecked) {
      await notificationApi.markAll();
    }
    else {
      await notificationApi.markSelected(markedIds);
    }

    setReloadTrigger((prev) => prev + 1);
  }

  console.log(notifications);

  return (
    <SafeAreaView style={styles.container}>
    {/* Icon Section */}
      <View style={styles.iconContainer}>
        {selectedTab === "notification" ? (
          <>
            <LinearGradient
              colors={["#B9E8BE", "#3FBE4E"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.iconButton}
            >
              <Pressable
                onPress={handleMark}
                style={({ pressed }) => [
                  styles.iconContent,
                  pressed && styles.iconPressed,
                ]}
              >
                <MaterialIcons name="check" size={20} color="white" />
              </Pressable>
            </LinearGradient>
            <LinearGradient
              colors={["#FFA4A5", "#FF2D30"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.iconButton}
            >
              <Pressable
                onPress={handleDelete}
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
          style={[styles.tab, selectedTab === "notification" && styles.activeTab]}
          onPress={() => handleTabChange("notification")}
        >
          <Text style={styles.tabText}>NOTIFICATION</Text>
        </Pressable>

        <Pressable
          style={[styles.tab, selectedTab === "invitation" && styles.activeTab]}
          onPress={() => handleTabChange("invitation")}
        >
          <Text style={styles.tabText}>INVITATION</Text>
        </Pressable>
      </View>

      {/* Check All Section */}
      <View style={styles.markAllContainer}>
        { selectedTab === "notification" &&
          <>
            <Checkbox onToggle={handleCheckAllToggle} isChecked={isAllChecked} />
            <Text style={styles.markAllText}>Check all</Text>
          </>
        }
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          { selectedTab === "notification" ? 
            (
              <>
              {
                notifications.map((noti, index) =>(
                  <Notification
                    id = {noti.id}
                    title= {noti.title}
                    createdAt= {noti.createdAt}
                    content= {noti.content}
                    subject= {noti.subject}
                    subjectId= {noti.subjectId}
                    read = {noti.read}
                    isChecked={checkedItems[index]}
                    onToggle={() => handleItemToggle(index)}
                  />
                )) 
              }
              </>
            ) :
            (
              <>
                {
                  invitations.map((inv) => (
                    <Invite
                      id= {inv.id}
                      inviterName={inv.inviterName}
                      inviterAvatarUrl={inv.inviterAvatarUrl}
                      invitedAt={inv.invitedAt}
                      teamName={inv.teamName}
                      teamId={inv.teamId}
                    />
                  ))
                }
              </>
            )  
          }
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
  tabContainer: {
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#1E282D",
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
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
  content: { 
    flex: 1, 
    paddingHorizontal: 20,
    paddingBottom: 70
  },
  markAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
    marginTop: 20,
    marginLeft: 10,
  },
  markAllText: {
    fontSize: 16,
    fontWeight: "500",
  },
  scrollContainer: { paddingBottom: 16 },
  bottomNavBar: {
    justifyContent: "center",
    alignItems: "center",
  },
   iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    minHeight: 40,
    marginRight: 10,
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
    opacity: 0.7,
  },
  iconPlaceholder: {
    marginLeft: 10,
    width: 40,
    height: 40,
  },
});

export default Noti;
