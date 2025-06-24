import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from 'dayjs';

// Import a default icon
import defaultIcon from "../../assets/images/plan/invitation.png";
import invitationApi from "@/api/invitationApi";

interface InviteProps {
  id: string;
  inviterName: string;
  inviterAvatarUrl: string;
  teamId: string;
  teamName: string;
  invitedAt: string;
  onReply: (id: string) => void
}

const Invite: React.FC<InviteProps> = ({
  id,
  inviterName,
  inviterAvatarUrl,
  teamId,
  teamName,
  invitedAt,
}) => {
  const formattedDate = dayjs(invitedAt, 'DD-MM-YY HH:mm:ss').format('HH:mm:ss DD/MM/YY');

  const [visible, setVisible] = useState(true);

  const handleDecline = async () => {
    await invitationApi.reply(id, false);
    setVisible(false);
  };

  const handleAccept = async () => {
    await invitationApi.reply(id, true);
    setVisible(false);
  };

  const handlePress = () => {

  }

  return (
    visible && (
      <Pressable onPress={handlePress} style={styles.container}>
        {/* Content Row */}
        <View style={styles.contentRow}>
          {/* Container hình tròn bao quanh icon */}
          <View style={styles.iconWrapper}>
            <Image source={defaultIcon} style={styles.iconImage} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>Invitation</Text>
            <Text style={styles.expiredTime}>{invitedAt}</Text>
            <Text style={styles.description}>
              {inviterName} has invited you to the team {teamName}.
            </Text>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <Pressable style={styles.acceptButton} onPress={handleAccept}>
                <Text style={styles.acceptText}>Accept</Text>
              </Pressable>
              <Pressable style={styles.declineButton} onPress={handleDecline}>
                <Text style={styles.declineText}>Decline</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  readStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  unreadStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    color: "grey",
    marginRight: 5,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  iconWrapper: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#7AD37D",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  iconImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  expiredTime: {
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.5)",
  },
  description: {
    fontSize: 14,
    color: "#000000",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    gap: 10,
  },
  acceptButton: {
    backgroundColor: "#7AB2D3",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },

  acceptText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },
  declineButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },

  declineText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default Invite;
