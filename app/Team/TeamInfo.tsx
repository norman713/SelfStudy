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
import Foundation from "@expo/vector-icons/Foundation";

export default function TeamInfo() {
  const router = useRouter();

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
      },
      {
        id: 2,
        name: "h12",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        role: "admin", // admin role
      },
      {
        id: 3,
        name: "h1",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        role: "member", // regular member role
      },
      {
        id: 4,
        name: "h2",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        role: "member", // regular member role
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

  return (
    <View style={styles.container}>
      {/* Team Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg", // Your image URL
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
      <Text style={styles.teamCode}>Team code: {mockTeamData.teamCode}</Text>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="search" size={24} color="black" />
          <Text style={styles.actionText}>Find member</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="user-check" size={24} color="black" />
          <Text style={styles.actionText}>Change member role</Text>
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
      <TouchableOpacity onPress={toggleShowMembers} style={styles.showMember}>
        <MaterialCommunityIcons
          name="account-group-outline"
          size={24}
          color="black"
        />
        <Text>Show members ({mockTeamData.memberCount})</Text>
      </TouchableOpacity>

      {/* Members List */}
      {showMembers && (
        <FlatList
          data={members}
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

              {/* Conditional rendering for icons */}
              <View style={styles.iconsContainer}>
                {item.role === "creator" && (
                  <Image
                    source={require("../../assets/images/icon/Main_Component.png")}
                    resizeMode="contain"
                  />
                )}
                {item.role === "admin" && (
                  <>
                    <Image
                      source={require("../../assets/images/icon/Main_Component.png")}
                      resizeMode="contain"
                    />
                    <TouchableOpacity
                      onPress={() => handleRemoveMember(item.id)}
                    >
                      <Foundation
                        name="minus-circle"
                        size={32}
                        color="#7AB2D3"
                      />
                    </TouchableOpacity>
                  </>
                )}
                {item.role === "member" && (
                  <TouchableOpacity onPress={() => handleRemoveMember(item.id)}>
                    <Foundation name="minus-circle" size={32} color="#7AB2D3" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
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
  teamCode: {
    fontSize: 14,
    color: "#7AB2D3",
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
    color: "#333",
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
});
