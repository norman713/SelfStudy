import React, { useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import SearchBar from "@/components/SearchBar"; // Import your SearchBar component
import { Ionicons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";

const mockUserData = [
  {
    id: 1,
    name: "Anna12",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "bnna13",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "c",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
];

export default function SearchScreen() {
  const [filteredData, setFilteredData] = useState(mockUserData);

  // Handle filtered data passed from the SearchBar component
  const handleFilteredData = (result: typeof mockUserData) => {
    setFilteredData(result);
  };

  return (
    <View style={styles.container}>
      <BackButton />
      {/* Search Bar */}
      <SearchBar
        data={mockUserData}
        searchKey="name"
        onFiltered={handleFilteredData}
        placeholder="Search for a user"
      />

      {/* User List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{item.name}</Text>
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
