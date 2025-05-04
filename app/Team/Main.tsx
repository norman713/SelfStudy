import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import ToggleTabButton from "@/components/ToggleTabButton";
import Header from "@/components/Header";
import BottomNavBar from "@/components/navigation/ButtonNavBar";
import { router, useRouter } from "expo-router";
import TeamItem from "@/components/team/TeamItem";
import SearchBar from "@/components/SearchBar";
import CreateTeamPopup from "@/components/popup/CreateTeam";
const mockTeamData = [
  {
    id: 1,
    title: "Mat",
    imageSource: {
      uri: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
    },
  },
  {
    id: 2,
    title: "Physic",
    imageSource: {
      uri: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
    },
  },
  {
    id: 3,
    title: "Chemistry",
    imageSource: {
      uri: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
    },
    isAdmin: true,
  },
];

export default function TeamScreen() {
  const [activeTab, setActiveTab] = useState("team");
  const [activeFilter, setActiveFilter] = useState<"joined" | "managed">(
    "joined"
  );

  const [allTeams, setAllTeams] = useState(mockTeamData); // Lưu trữ dữ liệu gốc
  const [filteredTeams, setFilteredTeams] = useState(mockTeamData); // Dữ liệu sau khi lọc

  // Hiển thị team dựa trên filter
  const getVisibleTeams = () => {
    if (activeFilter === "joined") return filteredTeams;
    return filteredTeams.filter((team) => team.isAdmin); // Chỉ hiển thị admin
  };

  const [showCreatePopup, setShowCreatePopup] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 10, marginVertical: 8, width: "100%" }}>
        <SearchBar
          data={mockTeamData}
          searchKey="title"
          onFiltered={setFilteredTeams}
          placeholder="Search team name..."
        />
      </View>

      {/* Filter Tabs + join button */}
      <View style={styles.tagsContainer}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#1E282D",
            borderRadius: 5,
            padding: 5,
            gap: 5,
          }}
        >
          <ToggleTabButton
            title="JOINED"
            active={activeFilter === "joined"}
            onPress={() => setActiveFilter("joined")}
          />
          <ToggleTabButton
            title="MANAGED"
            active={activeFilter === "managed"}
            onPress={() => setActiveFilter("managed")}
          />
        </View>

        <View>
          <CustomButton
            title="Join a team"
            fontSize={16}
            iconLeft={
              <Ionicons name="add-circle-sharp" size={20} color="#fff" />
            }
            onPress={() => setShowCreatePopup(true)} // Mở popup khi nhấn
            color="primary"
          />
        </View>
      </View>

      <View style={styles.teamList}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {getVisibleTeams().map((team) => (
            <TeamItem
              key={team.id}
              title={team.title}
              imageSource={team.imageSource}
              isAdmin={team.isAdmin}
            />
          ))}
        </ScrollView>
      </View>

      {/* Popup tạo team */}
      <CreateTeamPopup
        visible={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        onSave={(name, desc) => {
          // Tạo team mới
          const newTeam = {
            id: Date.now(), // Tạo ID mới dựa trên timestamp
            title: name,
            imageSource: {
              uri: "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
            },
            isAdmin: true, // Đảm bảo team mới có quyền admin
            description: desc,
          };
          // Thêm vào danh sách allTeams và filteredTeams
          const updatedTeams = [newTeam, ...allTeams];
          setAllTeams(updatedTeams);
          setFilteredTeams(updatedTeams); // Cập nhật danh sách hiển thị
          setShowCreatePopup(false); // Đóng popup sau khi thêm
        }}
      />

      {/* Nav Bar */}
      <BottomNavBar onAddPress={() => setShowCreatePopup(true)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECECEC",
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 8,
    paddingHorizontal: 14,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  tagsContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  teamList: {
    flex: 1,
    width: "100%",
  },

  tabBarItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
});
