import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
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
        console.log("This is response team:", response.teams);
        const data: Team[] = Array.isArray(response.teams)
          ? response.teams.map((item: any) => ({
              id: item.id,
              name: item.name,
              isAdmin: item.managedByUser,
              imageSource:
                "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
            }))
          : []; // Nếu teams không phải mảng, trả về mảng rỗng
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
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />

      {/* Search Bar */}
      <View style={{ alignItems: "center", marginVertical: 10, width: "100%" }}>
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
            onPress={() => setShowJoinPopup(true)}
            color="primary"
          />
        </View>
      </View>

      <View style={styles.teamList}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {getVisibleTeams().map((team) => {
            console.log("Team props:", team); // Log ra props để kiểm tra
            return (
              <TeamItem
                key={team.id}
                title={team.name}
                imageSource={team.imageSource}
                isAdmin={team.isAdmin} // Check giá trị isAdmin
                onPress={() => {
                  router.push(`/Team/${team.id}`);
                }}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Popup tạo team */}
      <JoinPopup
        visible={showJoinPopup}
        onClose={() => setShowJoinPopup(false)}
        onSave={(name, desc) => {
          setShowJoinPopup(false);
        }}
      />
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
            isAdmin: true,
            description: desc,
          };
          const updatedTeams = [newTeam, ...allTeams];
          // setAllTeams(updatedTeams);
          setFilteredTeams(updatedTeams);
          setShowCreatePopup(false);
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
    flexDirection: "column",
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 10, // Đảm bảo khoảng cách giữa chữ và biên
  },
  tagsContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 10, // Thêm khoảng cách dưới để các phần tử không bị dính vào nhau
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

  // Responsive design for smaller screens
  smallScreen: {
    fontSize: width < 360 ? 14 : 16, // Giảm fontSize nếu màn hình nhỏ
  },

  // Điều chỉnh padding/margin khi màn hình nhỏ
  smallPadding: {
    paddingHorizontal: width < 360 ? 8 : 15, // Đổi padding theo kích thước màn hình
  },
});
