import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, Alert } from "react-native";
import SearchBar from "@/components/SearchBar"; // Import your SearchBar component
import { Ionicons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import memberApi from "@/api/memberApi"; // Import your memberApi

interface Member {
  id: string;
  username: string;
  avatarUrl: string;
}

export default function SearchScreen() {
  const [filteredData, setFilteredData] = useState<Member[]>([]); // Hold filtered data
  const [size, setSize] = useState<number>(10);
  const [members, setMembers] = useState<Member[]>([]);
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  console.log("team id:", teamId);

  //get member list
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await memberApi.getList(teamId, "", size); // cursor = "" for initial
        console.log("Fetched members:", response);
        setMembers(response.members || []);
        setFilteredData(response.members || []); // Set initial filtered data
      } catch (error) {
        console.error("Error fetching member list:", error);
        Alert.alert("Error", "Failed to load members.");
      } finally {
      }
    };

    if (teamId) {
      fetchMembers();
    }
  }, [teamId, size]);

  // Handle filtered data passed from the SearchBar component
  const handleFilteredData = (result: Member[]) => {
    setFilteredData(result); // Set the filtered data based on the search
  };

  return (
    <View style={styles.container}>
      <BackButton />
      {/* Search Bar */}
      <SearchBar
        data={members}
        searchKey="username"
        onFiltered={handleFilteredData}
        placeholder="Search for a user"
      />

      {/* User List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : String(Math.random())
        } // Use a fallback key if id is undefined
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            <Text style={styles.userName}>{item.username}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
    gap: 20,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    color: "#333",
  },
});
