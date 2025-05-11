import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import ProfileCard from "@/components/popup/ProfileCard";
import { useLocalSearchParams } from "expo-router";

// Define Member type
interface Member {
  id: number;
  name: string;
  avatar: string;
  role: string;
  birthdate: string;
  gender: string;
}
export default function TeamInfo() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  console.log(teamId);
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  const [activeMember, setActiveMember] = useState<Member | null>(null); // Store selected member for profile view
  // Mock data with different roles (creator, admin, member)
  const mockTeamData = {
    teamName: "Team Cầu Lông",
    teamDescription:
      "This is a team bla bla description to check max size of the text and handle",
    teamCode: "Ayz6dfghjD",
    memberCount: 8,
    members: [
      {
        id: 1,
        name: "Liam123",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        role: "creator", // creator role
        birthdate: "27/10/2002",
        gender: "Male",
      },
      {
        id: 2,
        name: "h12",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        role: "admin", // admin role
        birthdate: "15/03/2000",
        gender: "Male",
      },
      {
        id: 3,
        name: "h1",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        role: "member", // regular member role
        birthdate: "01/05/1998",
        gender: "Female",
      },
      {
        id: 4,
        name: "hdfghj",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        role: "member", // regular member role
        birthdate: "01/05/1998",
        gender: "Female",
      },
    ],
  };

  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState(mockTeamData.members);
  const [teamName, setTeamName] = useState(mockTeamData.teamName);
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

  const handleSaveName = () => {
    setTeamName(newTeamName);
    setIsEditing(false);
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
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="camera" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Team Name */}
        <View style={styles.teamNameContainer}>
          {isEditing ? (
            <TextInput
              style={styles.teamNameInput}
              value={newTeamName}
              onChangeText={setNewTeamName}
              onBlur={handleSaveName} // Save name when focus is lost
              autoFocus
            />
          ) : (
            <Text style={styles.teamName} onPress={handleEditName}>
              {teamName}
            </Text>
          )}
          <Feather name="edit-3" size={24} color="#7AB2D3" />
        </View>

        {/* Team Code */}
        <View style={styles.teamCodeContainer}>
          <Text style={styles.teamCode}>
            Team code: {mockTeamData.teamCode}
          </Text>
          <Ionicons name="reload" size={15} color="#7AB2D3" />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => router.push("/Team/Main")}
            style={styles.actionButton}
          >
            <Ionicons name="search" size={24} color="black" />
            <Text style={styles.actionText}>Find member</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="settings" size={24} color="black" />
            <Text style={styles.actionText}>Notification settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="user-plus" size={24} color="black" />
            <Text style={styles.actionText}>Invite user</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <TouchableOpacity onPress={navigateToUpdateDescription}>
          <Text style={styles.description}>{mockTeamData.teamDescription}</Text>
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
            <Text>Show members</Text>
          </TouchableOpacity>

          {/* Members List */}
          {showMembers && (
            <FlatList
              data={mockTeamData.members}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.memberItem}>
                  <View style={styles.memberDetails}>
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.memberAvatar}
                    />
                    <Text style={styles.memberName}>{item.name}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleMenu(item.id)} // Toggle the menu for member actions
                  >
                    <Entypo
                      name="dots-three-horizontal"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>

                  {/* Conditional Dropdown Menu */}
                  {showMenu && activeMemberId === item.id && (
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
        <View style={styles.buttom}>
          {/* Leave Team Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log("Leave team clicked")}
          >
            <MaterialCommunityIcons name="exit-to-app" size={24} color="red" />
            <Text style={styles.buttonText}>Leave team</Text>
          </TouchableOpacity>

          {/* Delete Team Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log("Delete team clicked")}
          >
            <Feather name="trash-2" size={24} color="red" />
            <Text style={styles.buttonText}>Delete team</Text>
          </TouchableOpacity>
        </View>
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
});
