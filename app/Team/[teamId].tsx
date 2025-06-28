import React, { useEffect, useRef, useState } from "react";
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
import userApi from "@/api/userApi";
import Header from "@/components/Header";

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
  const { setId: setTeamID } = useTeamContext();

  //get user info in this team
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const response = await memberApi.getUserInfo(userId, teamId);
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
    setIsLoading(true);
    teamApi
      .getTeamInfo(teamId)
      .then((res) => {
        const team = res as unknown as {
          id: string;
          name: string;
          description: string;
          teamCode: string;
          totalMembers: number;
        };

        setTeamInfo(team);

        setTeamID(team.id); // Set the team ID in the context
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to load team information.");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
        setMembers(response.members || []);
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
  const handleRemoveMember = async (memberId: string) => {
    if (!teamId || !userId) return; // Ensure teamId and userId are available

    try {
      setIsLoading(true); // Set loading state to true
      // Call the deleteMember API to remove the member
      await memberApi.deleteMember(userId, teamId, memberId);
      // Remove the member from the state after successful deletion
      setMembers(members.filter((member) => member.userId !== memberId));
      Alert.alert("Success", "Member removed successfully.");
    } catch (error) {
      console.error("Error removing member:", error);
      Alert.alert("Error", "Failed to remove member.");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // Handle name editing
  const handleEditName = () => {
    setIsEditing(true);
  };

  // handle save name
  const handleSaveName = async () => {
    if (!teamId || !userId) return;

    const trimmedName = newTeamName.trim();
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
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [activeMemberId, setActiveMemberId] = useState<number | null>(null);
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
    // Set the selected member
    setActiveMember(member);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Close the profile modal
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // handle reset code
  const handleResetCode = async () => {
    if (!teamId || !userId) return;

    setIsLoading(true);
    try {
      await teamApi.resetCode(teamId, userId); // Call the resetCode API
      Alert.alert("Success", "Team code has been reset successfully!");
      // Optionally, you can reload team info or perform other updates
    } catch (error) {
      console.error("Error resetting team code:", error);
      Alert.alert("Error", "Failed to reset team code.");
    } finally {
      setIsLoading(false);
    }
  };
  // handle leave team
  const handleLeaveTeam = async () => {
    if (!userId || !teamId) return;

    try {
      setIsLoading(true);
      await memberApi.leaveTeam(userId, teamId);

      Alert.alert("Success", "You have left the team.");
      // Optionally, navigate away from the current page
      router.push("/Team/Main");
    } catch (error) {
      console.error("Error leaving the team:", error);
      Alert.alert("Error", "Failed to leave the team.");
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedRole, setSelectedRole] = useState<string | null>(null); // Store the selected role
  const [roleModalVisible, setRoleModalVisible] = useState(false); // Control modal visibility

  // Step 1: Open modal to select role
  const handleRoleMember = (memberId: string) => {
    setActiveMemberId(memberId); // Store the active member ID
    setRoleModalVisible(true); // Show the role selection modal
  };

  // Step 2: Handle role selection
  const handleRoleSelection = (role: string) => {
    setSelectedRole(role); // Set the selected role
    setRoleModalVisible(false); // Close the modal after selection
    updateMemberRole(role); // Call the API to update the role
  };

  // Step 3: Call the updateRole API to update the role of the member
  const updateMemberRole = async (role: string) => {
    if (!activeMemberId || !teamId || !userId) return;

    try {
      setIsLoading(true); // Set loading state to true
      await memberApi.updateRole(userId, teamId, activeMemberId, role); // Call the updateRole API
      // Update the role in the state after successful update
      setMembers(
        members.map((member) =>
          member.userId === activeMemberId ? { ...member, role } : member
        )
      );
      Alert.alert("Success", `Role updated to ${role}`);
    } catch (error) {
      console.error("Error updating role:", error);
      Alert.alert("Error", "Failed to update role.");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const [isEditingDescription, setIsEditingDescription] = useState(false); // State for description editing
  const [newDescription, setNewDescription] = useState(teamInfo?.description); // State for new team description input
  const [userInfo, setUserInfo] = useState<any>(null); // State to store user information
  // Handle description editing
  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  // Handle save description
  const handleSaveDescription = async () => {
    if (!teamId || !userId) return;

    const trimmedDescription = newDescription.trim();
    if (trimmedDescription === teamInfo?.description) {
      setIsEditingDescription(false); // Close the editor if there's no change
      return;
    }

    try {
      setIsLoading(true); // Set loading state to true
      // Call the updateTeam API to update the team description
      await teamApi.updateTeam(teamId, userId, undefined, trimmedDescription);
      // Update the team info with the new description
      setTeamInfo({ ...teamInfo, description: trimmedDescription });
      setNewDescription(trimmedDescription);
      Alert.alert("Success", "Team description updated.");
    } catch (error) {
      console.error("Error updating team description:", error);
      Alert.alert("Error", "Failed to update team description.");
    } finally {
      setIsEditingDescription(false);
      setIsLoading(false);
    }
  };
  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        Alert.alert("Error", "User ID is missing."); // Hiện lỗi khi userId không có
        return;
      }

      setIsLoading(true);
      try {
        const response = await userApi.getUserInfo();
        setUserInfo(response);
      } catch (error) {
        console.error("Error fetching user info:", error);
        Alert.alert("Error", "Failed to load user information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",

        backgroundColor: "#FFFFFF",
        gap: 20,
      }}
    >
      <Header />
      <View style={styles.container}>
        {/* Team Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://res.cloudinary.com/drvyagz4w/image/upload/v1750258950/111e8400-e29b-41d4-a716-446655440001.jpg",
            }}
            style={styles.avatar}
          />

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
              <TouchableOpacity onPress={handleResetCode} disabled={isLoading}>
                <Ionicons name="reload" size={15} color="#7AB2D3" />
              </TouchableOpacity>
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
        {/* Team Description */}
        <View style={styles.teamDescriptionContainer}>
          {isEditingDescription ? (
            <TextInput
              style={styles.teamDescriptionInput}
              value={newDescription}
              onChangeText={setNewDescription}
              onBlur={handleSaveDescription} // Save description when focus is lost
              autoFocus
            />
          ) : (
            <Text
              style={styles.teamDescription}
              onPress={role === "CREATOR" ? handleEditDescription : undefined} // Only allow editing for CREATOR role
            >
              {teamInfo?.description || "No description available"}
            </Text>
          )}
        </View>

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
            <Text>Show members ({teamInfo?.totalMembers || 0})</Text>
          </TouchableOpacity>

          {/* Members List */}
          {showMembers && (
            <View>
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
                      <View style={{ gap: 5 }}>
                        <Text style={styles.memberName}>{item.username}</Text>
                        <Text
                          style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: 12 }}
                        >
                          {item.role}
                        </Text>
                      </View>
                    </View>

                    {/* show .. for all role */}
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-end",
                      }}
                    >
                      {
                        <TouchableOpacity
                          onPress={() => toggleMenu(item.userId)}
                        >
                          <Entypo
                            name="dots-three-horizontal"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      }

                      {showMenu && activeMemberId === item.userId && (
                        <View style={styles.menu}>
                          <TouchableOpacity
                            onPress={() => handleProfileView(item)}
                          >
                            <Text>View profile</Text>
                          </TouchableOpacity>

                          {/* Kiểm tra và ẩn "Update role" nếu role là ADMIN */}
                          {role === "CREATOR" && (
                            <TouchableOpacity
                              onPress={() => handleRoleMember(item.userId)}
                            >
                              <Text>Update role</Text>
                            </TouchableOpacity>
                          )}

                          {/* Remove Member Button */}
                          {role !== "MEMBER" && (
                            <TouchableOpacity
                              onPress={() => handleRemoveMember(item.userId)}
                            >
                              <Text>Remove</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        </View>

        {/* Role Selection Modal */}
        {roleModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Select Role
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={() => handleRoleSelection("MEMBER")}>
                  <Text>MEMBER</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRoleSelection("ADMIN")}>
                  <Text>ADMIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRoleSelection("CREATOR")}
                >
                  <Text>CREATOR</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => setRoleModalVisible(false)} // Close modal
                style={styles.cancelButton}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Profile Modal */}
        {activeMember && (
          <ProfileCard
            visible={modalVisible}
            onClose={handleCloseModal}
            id={activeMember.userId} // Passing the selected user's data to the ProfileCard
          />
        )}

        {/* button leave/delete */}
        <View style={styles.buttom}>
          {/* Leave Team Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLeaveTeam} // Call handleLeaveTeam when pressed
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
    gap: 10,
    backgroundColor: "#FFFFFF",
    display: "flex",
    flex: 1,
    height: "100%",
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
  teamDescriptionContainer: {
    marginBottom: 10,
    width: "100%",
  },
  teamDescriptionInput: {
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "100%",
  },
  teamDescription: {
    fontSize: 16,
    color: "#333",
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
  memberItem: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
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
    display: "flex",
    flex: 1,
  },
  menu: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    zIndex: 1000,
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  menuText: {
    paddingVertical: 5,
    textAlign: "center",
  },
  modalOverlay: {
    position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
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
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "red",
  },
});
