import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import ProfileCard from "@/components/popup/ProfileCard";
import { useLocalSearchParams } from "expo-router";
import teamApi from "@/api/teamApi";
import memberApi from "@/api/memberApi";
import { useTeamContext } from "@/context/TeamContext";

interface Member {
  userId: string; // Unique identifier for the user
  username: string; // Username of the member
  avatarUrl: string; // URL of the user's avatar image
  role: string; // Role of the user (e.g., "CREATOR", "ADMIN", "MEMBER")
}
export default function TeamInfo() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [size, setSize] = useState<number>(10);
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  const [activeMember, setActiveMember] = useState<Member | null>(null); // Store selected member for profile view
  const [teamInfo, setTeamInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { role, setRole } = useTeamContext();
  const [members, setMembers] = useState<Member[]>([]);

  //get user info in this team
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const response = await memberApi.getUserInfo(userId, teamId);
        console.log("user info:", response.role);
        setRole(response.role);
      } catch (error) {
        console.error("Error fetching user info:", error);
        Alert.alert("Error", "Failed to load user information.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && teamId) {
      fetchUserInfo();
    }
  }, [userId, teamId, setRole]);

  //get team info
  useEffect(() => {
    const fetchTeamInfo = async () => {
      setIsLoading(true);
      try {
        const response = await teamApi.getTeamInfo(teamId);
        setTeamInfo(response);
      } catch (error) {
        Alert.alert("Error", "Failed to load team information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamInfo();
  }, [teamId]);

  useEffect(() => {
    if (teamInfo) {
      console.log("team info:", teamInfo);
    }
  }, [teamInfo]);
  //get member list
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const response = await memberApi.getList(teamId, "", size); // cursor = "" for initial
        console.log("Fetched members:", response);
        setMembers(
          (response.members || []).map((member: any) => ({
            ...member,
            avatarUrl: "https://randomuser.me/api/portraits/lego/1.jpg", // ảnh cố định
          }))
        );
      } catch (error) {
        console.error("Error fetching member list:", error);
        Alert.alert("Error", "Failed to load members.");
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchMembers();
    }
  }, [teamId, size]);

  const [showMembers, setShowMembers] = useState(false);

  const [teamName, setTeamName] = useState(teamInfo?.name);
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const [newTeamName, setNewTeamName] = useState(teamName); // State for new team name input

  // Navigate to UpdateDescription page
  const navigateToUpdateDescription = () => {
    router.push("/Team/UpdateDescription");
  };

  // Handle member removal
  const handleRemoveMember = (id: number) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  // Toggle show members
  const toggleShowMembers = () => {
    setShowMembers(!showMembers);
  };

  // Handle name editing
  const handleEditName = () => {
    setIsEditing(true);
  };

  // handle save name
  const handleSaveName = async () => {
    if (!teamId || !userId) return;

    const trimmedName = newTeamName.trim();

    // Nếu không thay đổi thì bỏ qua
    if (trimmedName === teamInfo?.name) {
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      await teamApi.updateTeam(teamId, userId, trimmedName); // 👈 chỉ gửi name
      setTeamInfo({ ...teamInfo, name: trimmedName }); // cập nhật UI
      setTeamName(trimmedName);
      Alert.alert("Success", "Team name updated.");
    } catch (error) {
      console.error("Error updating team name:", error);
      Alert.alert("Error", "Failed to update team name.");
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  const [showMenu, setShowMenu] = useState(false); // State for toggling menu visibility
  const [activeMemberId, setActiveMemberId] = useState<number | null>(null); // Track which member's menu is active
  // Handle the toggle for menu visibility
  const toggleMenu = (memberId: number) => {
    if (activeMemberId === memberId) {
      setShowMenu(!showMenu); // Toggle menu visibility if the same member is clicked
    } else {
      setActiveMemberId(memberId); // Otherwise, show menu for the selected member
      setShowMenu(true); // Ensure menu is shown
    }
  };
  const handleProfileView = (member: Member) => {
    setActiveMember(member); // Set the selected member
    setModalVisible(true); // Show the profile modal
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Close the profile modal
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  console.log("team id:", teamId);

  // Navigate to SearchScreen and pass members data as query params (optional)
  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* Team Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://gratisography.com/wp-content/uploads/2025/01/gratisography-dog-vacation-800x525.jpg", // Your image URL
            }}
            style={styles.avatar}
          />

          {/* Only show camera icon if the role is CREATOR */}
          {role === "CREATOR" && (
            <TouchableOpacity style={styles.editIcon}>
              <Ionicons name="camera" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Team Name */}
        <View style={styles.teamNameContainer}>
          {role === "CREATOR" ? (
            // If the role is CREATOR, allow editing
            isEditing ? (
              <TextInput
                style={styles.teamNameInput}
                value={newTeamName}
                onChangeText={setNewTeamName}
                onBlur={handleSaveName} // Save name when focus is lost
                autoFocus
              />
            ) : (
              <Text style={styles.teamName} onPress={handleEditName}>
                {teamInfo?.name || "Loading..."}
              </Text>
            )
          ) : (
            // If the role is not CREATOR, display team name without editing
            <Text style={styles.teamName}>
              {teamInfo?.name || "Loading..."}
            </Text>
          )}

          {/* Show the edit icon only if the role is CREATOR */}
          {role === "CREATOR" && (
            <Feather name="edit-3" size={24} color="#7AB2D3" />
          )}
        </View>

        {/* Team Code */}
        {role !== "MEMBER" && ( // Hide the entire section for MEMBER role
          <View style={styles.teamCodeContainer}>
            <Text style={styles.teamCode}>
              Team code: {teamInfo?.teamCode || "Loading..."}{" "}
              {/* Hiển thị "Loading..." nếu teamInfo chưa có */}
            </Text>

            {/* Show the reload icon only if the role is CREATOR */}
            {role === "CREATOR" && (
              <Ionicons name="reload" size={15} color="#7AB2D3" />
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* search */}
          <TouchableOpacity
            onPress={() => router.push(`/Team/SearchUser/${teamId}`)}
            style={styles.actionButton}
          >
            <Ionicons name="search" size={24} color="black" />
            <Text style={styles.actionText}>Find member</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Feather name="settings" size={24} color="black" />
            <Text style={styles.actionText}>Notification settings</Text>
          </TouchableOpacity>

          {/* Conditionally render the Invite User button only if the role is not MEMBER */}
          {role !== "MEMBER" && (
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="user-plus" size={24} color="black" />
              <Text style={styles.actionText}>Invite user</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Description */}
        <TouchableOpacity onPress={navigateToUpdateDescription}>
          <Text style={styles.description}>{teamInfo?.description}</Text>
        </TouchableOpacity>

        {/* Show Members */}
        <View style={styles.show}>
          <TouchableOpacity
            onPress={() => setShowMembers(!showMembers)}
            style={styles.showMember}
          >
            <MaterialCommunityIcons
              name="account-group-outline"
              size={24}
              color="black"
            />
            <Text>Show members ({teamInfo?.totalMembers || 0})</Text>{" "}
            {/* Dynamically display total members */}
          </TouchableOpacity>

          {/* Members List */}
          {showMembers && (
            <FlatList
              data={members}
              keyExtractor={(item) => item.userId.toString()}
              renderItem={({ item }) => (
                <View style={styles.memberItem}>
                  <View style={styles.memberDetails}>
                    <Image
                      source={{ uri: item.avatarUrl }}
                      style={styles.memberAvatar}
                    />
                    <Text style={styles.memberName}>{item.username}</Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleMenu(item.userId)}>
                    <Entypo
                      name="dots-three-horizontal"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>

                  {showMenu && activeMemberId === item.userId && (
                    <View style={styles.menu}>
                      <TouchableOpacity onPress={() => handleProfileView(item)}>
                        <Text>View profile</Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text>Update role</Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            />
          )}
        </View>

        {/* Profile Modal */}
        {activeMember && (
          <ProfileCard
            visible={modalVisible}
            onClose={handleCloseModal}
            user={activeMember} // Passing the selected user's data to the ProfileCard
          />
        )}
        {/* button leave/delete */}
        <View style={styles.buttom}>
          {/* Leave Team Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log("Leave team clicked")}
          >
            <MaterialCommunityIcons name="exit-to-app" size={24} color="red" />
            <Text style={styles.buttonText}>Leave team</Text>
          </TouchableOpacity>

          {/* Conditionally render the Delete Team button only if the role is CREATOR */}
          {role === "CREATOR" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowConfirmModal(true)}
            >
              <Feather name="trash-2" size={24} color="red" />
              <Text style={styles.buttonText}>Delete team</Text>
            </TouchableOpacity>
          )}
        </View>
        {showConfirmModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Are you sure you want to delete this team?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => setShowConfirmModal(false)}
                  style={styles.cancelButton}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      setIsLoading(true);
                      await teamApi.deleteTeam(teamId, userId);
                      setShowConfirmModal(false);
                      router.push("/Team/Main");
                    } catch (e) {
                      console.error("Failed to delete team:", e);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  style={styles.deleteButton}
                >
                  <Text style={{ color: "white" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#7AB2D3",
    padding: 5,
    borderRadius: 20,
  },
  teamNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  teamName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  teamNameInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#4f8ef7",
    width: "100%",
    textAlign: "center",
  },
  teamCodeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  teamCode: {
    fontSize: 14,
    color: "#7AB2D3",
    fontWeight: "700",
  },
  description: {
    fontSize: 16,
    color: "#A0A0A0",
    marginTop: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "center",
    justifyContent: "center",
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
  },
  showMember: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 20,
  },
  show: {
    width: "100%",
    gap: 10,
  },
  list: {
    gap: 20,
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 20,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  memberDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    color: "#000000",
  },
  memberRole: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.5)",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 20,
  },
  button: {
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    color: "red",
    fontSize: 12,
  },
  buttom: {
    gap: 10,
    width: "100%",
  },
  menu: {
    position: "absolute",
    backgroundColor: "white",
    top: 30,
    right: -50,
    borderRadius: 5,
    padding: 8,
    width: 150,
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000, // Explicitly set z-index for iOS (if needed)
  },
  menuText: {
    paddingVertical: 5,
    textAlign: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
});
