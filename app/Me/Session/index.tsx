import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "@/components/CheckBox";
import ProgressCircle from "./time";
import Header from "@/components/Header";
import { Svg, Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import { useRouter } from "expo-router";
import ModalSetting from "./setting";
import CustomButton from "@/components/CustomButton";
import { Audio } from "expo-av";

export default function Page() {
  const router = useRouter();
  const [volume, setVolume] = useState(70);
  const [isLooping, setIsLooping] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [duration, setDuration] = useState(3600);
  const [focusTime, setFocusTime] = useState(1200);
  const [breakTime, setBreakTime] = useState(600);
  const [currentStage, setCurrentStage] = useState(1);
  const [state, setState] = useState("FOCUS");
  const [soundLink, setSoundLink] = useState(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  );
  const [sound, setSound] = useState<any>(null);

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: soundLink },
        { shouldPlay: true }
      );
      setSound(sound);
    } catch (error) {
      console.error("Error loading or playing sound:", error);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const [isPaused, setIsPaused] = useState(false); // Trạng thái Pause
  const handleStartPause = async () => {
    if (!hasStarted) {
      // Start lần đầu
      setIsRunning(true);
      setHasStarted(true);
      setIsPaused(false);
      setTimeRemaining(focusTime);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: soundLink },
        { shouldPlay: true, isLooping }
      );
      setSound(newSound);
    } else if (!isPaused) {
      // Đang chạy, bấm Pause → show Alert
      if (sound) await sound.pauseAsync();
      Alert.alert(
        "Paused",
        "Choose an action:",
        [
          {
            text: "Continue",
            onPress: async () => {
              setIsRunning(true);
              setIsPaused(false);
              if (sound) await sound.playAsync();
            },
          },
          {
            text: "Stop",
            style: "destructive",
            onPress: () => {
              setIsRunning(false);
              setHasStarted(false);
              setTimeRemaining(0);
              stopSound();
              router.push("/Me/Session/complete");
            },
          },
        ],
        { cancelable: false }
      );
      setIsRunning(false);
      setIsPaused(true);
    } else {
      // Trạng thái đã paused (nếu ở đây thì chỉ resume)
      setIsRunning(true);
      setIsPaused(false);
      if (sound) await sound.playAsync();
    }
  };

  const handleNextSong = () => {
    // setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1));
  };

  const handlePreviousSong = () => {
    // setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
  };

  const handleFinish = () => {
    Alert.alert("Confirm Finish", "Are you sure to end time?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          setIsRunning(false);
          setHasStarted(false);
          setTimeRemaining(0);
          stopSound();
          router.push("/Me/Session/complete");
        },
      },
    ]);
  };

  const handleStrictMode = () => {
    Alert.alert("Strict Mode", "Strict mode is now active.");
  };

  const handleSettings = () => {
    setModalVisible(true);
  };

  const handleSave = (settings: {
    duration: number;
    focusTime: number;
    breakTime: number;
    musicLink: string;
  }) => {
    setDuration(settings.duration);
    setFocusTime(settings.focusTime);
    setBreakTime(settings.breakTime);
    setSoundLink(settings.musicLink);
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.timerContainer}>
          <ProgressCircle
            radius={100}
            strokeWidth={8}
            totalTime={state === "FOCUS" ? focusTime : breakTime}
            timeRemaining={timeRemaining}
            isRunning={isRunning}
            onTick={(remaining) => setTimeRemaining(remaining)}
            onComplete={() => {
              alert("Time is up!");
              setIsRunning(false);
              setHasStarted(false);
              setTimeRemaining(state === "FOCUS" ? focusTime : breakTime);
            }}
          />
          <Text style={styles.stageText}>
            STAGE {currentStage}
            {hasStarted && !isPaused && <Text> - FOCUS</Text>}
            {hasStarted && isPaused && <Text> - PAUSED</Text>}
          </Text>
        </View>

        <View style={styles.volumeControl}>
          <Ionicons name="volume-high" size={24} color="#7AB2D3" />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={volume / 100}
            onValueChange={(v) => setVolume(v * 100)} // chỉ cập nhật UI
            onSlidingComplete={async (v) => {
              if (sound) await sound.setVolumeAsync(v);
            }} // mới set volume thật
            minimumTrackTintColor="#7AB2D3"
            maximumTrackTintColor="#EAEAEA"
          />
        </View>

        <View style={styles.songControl}>
          <Pressable onPress={handlePreviousSong}>
            <Ionicons name="play-skip-back" size={24} color="#7AB2D3" />
          </Pressable>
          <Text style={styles.songText}>Space</Text>
          <Pressable onPress={handleNextSong}>
            <Ionicons name="play-skip-forward" size={24} color="#7AB2D3" />
          </Pressable>
        </View>

        <View style={styles.loopControl}>
          <Checkbox
            isChecked={isLooping}
            onToggle={(checked) => setIsLooping(checked)}
          />
          <Text style={styles.loopText}>On loop</Text>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            title={!hasStarted ? "Start" : isPaused ? "Continue" : "Pause"}
            onPress={handleStartPause}
          />
        </View>

        {/* Additional Buttons */}
        <View style={styles.additionalButtons}>
          {/* Strict Mode Button */}
          <Pressable style={styles.iconButton} onPress={handleStrictMode}>
            <Svg height={80} width={80}>
              <Defs>
                <LinearGradient id="strictGradient" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#4A628A" />
                  <Stop offset="100%" stopColor="#131A24" />
                </LinearGradient>
              </Defs>
              <Rect
                x="0"
                y="0"
                width="80"
                height="80"
                rx="15"
                fill="url(#strictGradient)"
              />
            </Svg>
            <Ionicons
              name="remove-circle"
              size={60}
              color="#FFFFFF"
              style={styles.icon}
            />
            <Text style={styles.iconButtonText}>Strict mode</Text>
          </Pressable>

          {/* Settings Button */}
          <Pressable style={styles.iconButton} onPress={handleSettings}>
            <Svg height={80} width={80}>
              <Defs>
                <LinearGradient
                  id="settingsGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <Stop offset="0%" stopColor="#628393" />
                  <Stop offset="100%" stopColor="#1E282D" />
                </LinearGradient>
              </Defs>
              <Rect
                x="0"
                y="0"
                width="80"
                height="80"
                rx="15"
                fill="url(#settingsGradient)"
              />
            </Svg>
            <Ionicons
              name="settings"
              size={60}
              color="#FFFFFF"
              style={styles.icon}
            />
            <Text style={styles.iconButtonText1}>Settings</Text>
          </Pressable>
        </View>
      </View>

      {/* Modal Setting */}
      <ModalSetting
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  stageText: {
    fontSize: 24,
    color: "#4A628A",
    marginTop: 10,
    fontWeight: "bold",
  },
  volumeControl: {
    flexDirection: "row",
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  slider: {
    flex: 1,
    marginLeft: 10,
  },
  songControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  songText: {
    fontSize: 20,
    color: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    textAlign: "center",
    fontWeight: "400",
  },
  loopControl: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 30,
  },
  loopText: {
    fontSize: 16,
    color: "#2B3A4A",
    marginLeft: 10,
  },
  finishButton: {
    backgroundColor: "#7AB2D3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#7AB2D3",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 30,
    marginBottom: 20,
  },
  finishText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  additionalButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  iconButton: {
    alignItems: "center",
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: 10,
    left: 11,
  },
  iconButtonText: {
    fontSize: 16,
    color: "#4A628A",
    marginTop: 5,
    fontWeight: "500",
  },
  iconButtonText1: {
    fontSize: 16,
    color: "#1E282D",
    marginTop: 5,
    fontWeight: "500",
  },
  bottom: {
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 30,
    marginBottom: 10,
  },
});
