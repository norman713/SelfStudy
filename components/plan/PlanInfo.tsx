import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { formatDateTime, formatDateToISOString } from "@/util/format";

interface APlanProps {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  notifyBefore: string;
  status: string;
  completeDate: string | null;
  handleChangeValue: (field: string, value: string) => void;
}

export default function APlan({
  name,
  description,
  startDate,
  endDate,
  notifyBefore,
  status,
  completeDate,
  handleChangeValue,
}: APlanProps) {
  const [remindBefore, setRemindBefore] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [startDateForm, setStartDateForm] = useState(
    new Date(startDate.replace(" ", "T"))
  );
  const [endDateForm, setEndDateForm] = useState(
    new Date(endDate.replace(" ", "T"))
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showRemindTimePicker, setShowRemindTimePicker] = useState(false);
  const [remindTime, setRemindTime] = useState(new Date(0, 0, 0, 0, 30, 0));

  // Sync remindTime when remindBefore changes
  useEffect(() => {
    setRemindTime(
      new Date(
        0,
        0,
        0,
        remindBefore.hours,
        remindBefore.minutes,
        remindBefore.seconds
      )
    );
  }, [remindBefore]);

  // Initialize remindBefore from notifyBefore prop
  useEffect(() => {
    if (notifyBefore) {
      const parts = notifyBefore.split(":");
      setRemindBefore({
        hours: Number(parts[0]),
        minutes: Number(parts[1]),
        seconds: Number(parts[2]),
      });
    }
  }, [notifyBefore]);

  // Notify parent when remindBefore changes and differs from notifyBefore
  useEffect(() => {
    const time =
      String(remindBefore.hours).padStart(2, "0") +
      ":" +
      String(remindBefore.minutes).padStart(2, "0") +
      ":" +
      String(remindBefore.seconds).padStart(2, "0");

    if (time !== notifyBefore) {
      handleChangeValue("notifyBefore", time);
    }
  }, [remindBefore, notifyBefore, handleChangeValue]);

  // Notify parent when startDateForm changes and differs from startDate
  useEffect(() => {
    const newStart = formatDateToISOString(startDateForm);
    if (newStart !== startDate) {
      handleChangeValue("startDate", newStart);
    }
  }, [startDateForm, startDate, handleChangeValue]);

  // Notify parent when endDateForm changes and differs from endDate
  useEffect(() => {
    const newEnd = formatDateToISOString(endDateForm);
    if (newEnd !== endDate) {
      handleChangeValue("endDate", newEnd);
    }
  }, [endDateForm, endDate, handleChangeValue]);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selected: Date | undefined,
    field: "startDate" | "endDate"
  ) => {
    if (event.type === "set" && selected) {
      if (field === "startDate") setStartDateForm(selected);
      else setEndDateForm(selected);
    }
    // Hide all pickers
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
  };

  const handleRemindBeforeChange = (
    field: "hours" | "minutes" | "seconds",
    value: string
  ) => {
    const num = parseInt(value, 10) || 0;
    setRemindBefore((prev) => ({
      ...prev,
      [field]: Math.min(Math.max(num, 0), field === "hours" ? 24 : 60),
    }));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.title}
        value={name}
        onChangeText={(text) => handleChangeValue("name", text)}
      />

      {status === "COMPLETE" ? (
        <Text style={styles.completeText}>
          <Text style={styles.highlightText}>COMPLETE AT: </Text>
          <Text>{formatDateTime(completeDate || "")}</Text>
        </Text>
      ) : (
        <Text style={styles.incompleteText}>INCOMPLETE</Text>
      )}

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          defaultValue={description}
          onChangeText={(text) => handleChangeValue("description", text)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text>{startDateForm.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDateForm}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, d) => handleDateChange(e, d, "startDate")}
          />
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text>{endDateForm.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDateForm}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, d) => handleDateChange(e, d, "endDate")}
          />
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Remind Me Before</Text>
        <View style={styles.remindContainer}>
          <TextInput
            style={styles.remindInput}
            placeholder="HH"
            keyboardType="numeric"
            value={remindBefore.hours.toString()}
            onChangeText={(v) => handleRemindBeforeChange("hours", v)}
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.remindInput}
            placeholder="MM"
            keyboardType="numeric"
            value={remindBefore.minutes.toString()}
            onChangeText={(v) => handleRemindBeforeChange("minutes", v)}
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.remindInput}
            placeholder="SS"
            keyboardType="numeric"
            value={remindBefore.seconds.toString()}
            onChangeText={(v) => handleRemindBeforeChange("seconds", v)}
          />
        </View>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowRemindTimePicker(true)}
        >
          <Text>{remindTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showRemindTimePicker && (
          <DateTimePicker
            value={remindTime}
            mode="time"
            is24Hour
            display={Platform.OS === "ios" ? "spinner" : "default"}
            // onChange={handleRemindBeforeChange}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    color: "#7AB2D3",
    textAlign: "center",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldContainerRow: {
    marginBottom: 20,
    flexDirection: "column",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 11,
    color: "rgba(0, 0, 0, 0.5)",
    marginBottom: 5,
    fontFamily: "Roboto_400Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  halfInput: {
    width: "48%",
  },
  remindContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  remindInput: {
    width: "30%",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: "center",
  },
  colon: {
    fontSize: 20,
    alignSelf: "center",
  },
  incompleteText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.red,
    marginTop: 5,
    marginBottom: 20,
    width: "100%",
    textAlign: "center",
  },
  completeText: {
    fontSize: 14,
    width: "100%",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  highlightText: {
    color: Colors.green,
    fontWeight: "bold",
  },
});
