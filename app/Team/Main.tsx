import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import ToggleTabButton from "@/components/ToggleTabButton";
import Header from "@/components/Header";
import BottomNavBar from "@/components/navigation/ButtonNavBar";
import { useRouter } from "expo-router"; // Import useRouter từ expo-router
import TeamItem from "@/components/team/TeamItem";
import SearchBar from "@/components/SearchBar";
import CreateTeamPopup from "@/components/popup/CreateTeam";
import JoinPopup from "@/components/popup/JoinTeam";
import teamApi from "@/api/teamApi";
import memberApi from "@/api/memberApi";

const { width, height } = Dimensions.get("window");
interface Team {
  id: string;
  name: string;
  isAdmin: boolean;
  imageSource: string;
}

export default function TeamScreen() {
  const [activeTab, setActiveTab] = useState("team");
  const [activeFilter, setActiveFilter] = useState<"joined" | "managed">(
    "joined"
  );

  const [allTeams, setAllTeams] = useState<Team[]>([]); // Lưu trữ dữ liệu gốc
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]); // Dữ liệu sau khi lọc

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);

  const router = useRouter();
  const [teams, setTeams] = useState<any[]>([]); // State lưu danh sách team
  const [cursor, setCursor] = useState<string>(""); // State lưu cursor (dùng cho phân trang)
  const [size, setSize] = useState<number>(10); // Số lượng team mỗi lần tải
  const [isLoading, setIsLoading] = useState<boolean>(false); // State loading
  const userId = "554c0f1d-b1f4-4466-8778-8caaff792b45"; // User ID

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);

        const response = await teamApi.getAll(userId, cursor, size);

        const data: Team[] = Array.isArray(response.teams)
          ? response.teams.map((item: any) => ({
              id: item.id,
              name: item.name,
              isAdmin: item.managedByUser,
              imageSource: require("../../assets/images/imageTeam.jpg"),
            }))
          : [];
        setTeams(data);
        setFilteredTeams(data); // Đặt filtered teams
      } catch (error) {
        console.error("Error fetching teams", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams(); // Gọi API khi component mount hoặc khi cursor/size thay đổi
  }, [cursor, size]); // Dependencies: cursor và size

  const getVisibleTeams = () => {
    if (activeFilter === "joined") return filteredTeams;
    return filteredTeams.filter((team) => team.isAdmin); // Chỉ hiển thị admin
  };
  const handleJoinTeam = async (teamCode: string) => {
    try {
      const response = await memberApi.join(userId, teamCode);
      if (response) {
        Alert.alert("Success", "You have successfully joined the team!");
      } else {
        Alert.alert("Error", "Failed to join the team. Please try again.");
      }
    } catch (error) {
      console.error("Error joining team:", error);

      const errorMessage =
        error.response?.message || "There was an error joining the team.";
      Alert.alert("Error", errorMessage);
    }
  };

  // xử lý tạo team
  const handleSaveNewTeam = async (name: string, description: string) => {
    try {
      const response = await teamApi.create(userId, name, description);
      console.log("Team created successfully:", response);

      // Cập nhật danh sách đội sau khi tạo mới
      const newTeam = response; // Giả sử API trả về đội vừa tạo
      setFilteredTeams([newTeam, ...filteredTeams]);
    } catch (error) {
      console.error("Error creating team:", error);
      Alert.alert("Error", "There was an error creating the team.");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />
      {/* Search Bar */}
      <View
        style={{
          alignItems: "center",
          marginVertical: 10,
          paddingHorizontal: 10,
          width: "100%",
        }}
      >
        <SearchBar
          data={teams}
          searchKey="name"
          onFiltered={setFilteredTeams}
          placeholder="Search for teams..."
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
              <Ionicons name="add-circle-sharp" size={25} color="#fff" />
            }
            onPress={() => setShowJoinPopup(true)}
            color="primary"
          />
        </View>
      </View>

      <View style={styles.teamList}>
        <FlatList
          data={getVisibleTeams()}
          keyExtractor={(team) => team.id.toString()} // đảm bảo key là string
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: team }) => (
            <TeamItem
              title={team.name}
              imageSource={team.imageSource}
              isAdmin={team.isAdmin}
              onPress={() => {
                router.push(`/Team/${team.id}?userId=${userId}`);
              }}
            />
          )}
        />
      </View>
      {/* Popup join team */}
      <JoinPopup
        visible={showJoinPopup}
        onClose={() => setShowJoinPopup(false)}
        onSave={handleJoinTeam}
      />
      {/* Popup tạo team */}
      <CreateTeamPopup
        visible={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        onSave={handleSaveNewTeam} // Gọi API khi người dùng tạo đội mới
      />

      {/* Nav Bar */}
      <BottomNavBar onAddPress={() => setShowCreatePopup(true)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    gap: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  teamList: {
    flex: 1,
    width: "100%",
  },
  smallScreen: {
    fontSize: width < 360 ? 14 : 16,
  },
  smallPadding: {
    paddingHorizontal: width < 360 ? 8 : 15,
  },
});
