import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { Colors } from "@/constants/Colors";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { formatTime } from "@/util/format";
import Error from "@/components/Message/Error";

interface ModalSettingProps {
  visible: boolean;
  onClose: () => void;
  onSave: (settings: {
    duration: number;
    focusTime: number;
    breakTime: number;
    musicLink: string;
  }) => void;
}

export default function ModalSetting({
  visible,
  onClose,
  onSave,
}: ModalSettingProps) {
  const [duration, setDuration] = useState(new Date("2025-01-16T01:00:00"));
  const [focusTime, setFocusTime] = useState(new Date("2025-01-16T20:00:00"));
  const [breakTime, setBreakTime] = useState(new Date("2025-01-16T10:00:00"));
  const [musicLink, setMusicLink] = useState(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  );
  const [showPicker, setShowPicker] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSave = () => {
    const formattedDuration = formatTime(duration);
    const durationParts = formattedDuration.split(":");
    const durationSeconds =
      Number(durationParts.at(0)) * 3600 +
      Number(durationParts.at(1)) * 60 +
      Number(durationParts.at(2));

    const formattedBreakTime = formatTime(breakTime);
    const breakTimeParts = formattedBreakTime.split(":");
    const breakTimeSeconds =
      Number(breakTimeParts.at(0)) * 60 + Number(breakTimeParts.at(1));

    const formattedFocusTime = formatTime(focusTime);
    const focusTimeParts = formattedFocusTime.split(":");
    const focusTimeSeconds =
      Number(focusTimeParts.at(0)) * 60 + Number(focusTimeParts.at(1));

    const settings = {
      duration: durationSeconds,
      focusTime: focusTimeSeconds,
      breakTime: breakTimeSeconds,
      musicLink,
    };
    onSave(settings);
    onClose();
  };

  const onTimeChange = (
    field: string,
    event: DateTimePickerEvent,
    selectedTime?: Date
  ) => {
    setShowPicker(false);
    if (selectedTime) {
      switch (field) {
        case "duration":
          setDuration(selectedTime);
          break;
        case "breakTime":
          setBreakTime(selectedTime);
          break;
        case "focusTime":
          setFocusTime(selectedTime);
          break;
      }
    }
  };

  useEffect(() => {
    const formattedBreakTime = formatTime(breakTime);
    const breakTimeParts = formattedBreakTime.split(":");

    const formattedFocusTime = formatTime(focusTime);
    const focusTimeParts = formattedFocusTime.split(":");

    let stageDuration = new Date();
    stageDuration.setHours(0);
    stageDuration.setMinutes(
      Number(focusTimeParts.at(0)) + Number(breakTimeParts.at(0))
    );
    stageDuration.setSeconds(
      Number(focusTimeParts.at(1)) + Number(breakTimeParts.at(1))
    );

    if (stageDuration > duration) {
      console.log(stageDuration);
      console.log(duration);
      // setShowError(true);
    }
  }, [focusTime, breakTime]);

  const handlePress = (field: string) => {
    setShowPicker(true);
    setCurrentField(field);
  };

  const calculateStage = () => {
    const formattedBreakTime = formatTime(breakTime);
    const breakTimeParts = formattedBreakTime.split(":");

    const formattedFocusTime = formatTime(focusTime);
    const focusTimeParts = formattedFocusTime.split(":");

    const minutes = Number(focusTimeParts.at(0)) + Number(breakTimeParts.at(0));
    const seconds = Number(focusTimeParts.at(1)) + Number(breakTimeParts.at(1));

    const formattedDuration = formatTime(duration);
    const durationParts = formattedDuration.split(":");
    const divider =
      Number(durationParts.at(0)) * 3600 +
      Number(durationParts.at(1)) * 60 +
      Number(durationParts.at(2));

    return Math.ceil(divider / (minutes * 60 + seconds));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="black" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Settings</Text>

          {/* Duration */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Duration</Text>
            <Pressable onPress={() => handlePress("duration")}>
              <TextInput
                style={styles.input}
                value={duration.toLocaleTimeString("en-US", { hour12: false })}
                keyboardType="numeric"
                editable={false}
              />
            </Pressable>
          </View>

          {/* Focus and Break Time */}
          <View style={styles.timeContainer}>
            <View style={styles.timeBox}>
              <Text style={styles.label}>Focus</Text>
              <Pressable
                style={styles.timeInputContainer}
                onPress={() => handlePress("focusTime")}
              >
                <TextInput
                  style={styles.timeInput}
                  value={focusTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                  keyboardType="numeric"
                  editable={false}
                />
              </Pressable>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.label}>Break</Text>
              <Pressable
                style={styles.timeInputContainer}
                onPress={() => handlePress("breakTime")}
              >
                <TextInput
                  style={styles.timeInput}
                  value={breakTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                  keyboardType="numeric"
                  editable={false}
                />
              </Pressable>
            </View>
          </View>

          {/* Connecting Lines */}
          <View style={styles.lineContainer}>
            <View style={styles.horizontalLine} />
            <View style={styles.stagesBox}>
              <Text style={styles.stagesText}>{calculateStage()} stages</Text>
            </View>
            <View style={styles.horizontalLine} />
          </View>

          {/* Music Link */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Music</Text>
            <View style={styles.musicInputContainer}>
              <TextInput
                style={styles.input}
                value={musicLink}
                onChangeText={setMusicLink}
                placeholder="Enter your music link..."
              />
              <Ionicons name="link" size={20} color="#4A628A" />
            </View>
          </View>

          {/* Save Button */}
          <CustomButton title="Save" onPress={handleSave} color="primary" />
        </View>
      </View>

      {showPicker && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedTime) =>
            onTimeChange(currentField, event, selectedTime)
          }
          style={{ zIndex: 10 }}
        />
      )}
      {showError && (
        <Error
          title="Error"
          description="The stage duration cannot exceed the session duration."
          visible={showError}
          onClose={() => setShowError(false)}
          onOkPress={() => setShowError(false)}
        ></Error>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginVertical: 20,
  },
  inputContainer: {
    width: "100%",
    marginTop: 10,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#EDEDED",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  timeBox: {
    alignItems: "center",
    width: "45%",
  },
  timeInputContainer: {
    padding: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.primary,
  },
  timeInput: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  horizontalLine: {
    height: 2,
    backgroundColor: "#B0D7EB",
    flex: 1,
  },
  stagesBox: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  stagesText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  musicInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#EDEDED",
    width: "90%",
    gap: 20,
  },
});
