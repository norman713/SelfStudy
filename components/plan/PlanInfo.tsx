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
  const time = notifyBefore.split(":");
  const [remindBefore, setRemindBefore] = useState({
    hours: Number(time.at(0)),
    minutes: Number(time.at(1)),
    seconds: Number(time.at(2)),
  });
  const [startDateForm, setStartDateForm] = useState(
    new Date(startDate.replace(" ", "T"))
  );
  const [endDateForm, setEndDateForm] = useState(
    new Date(endDate.replace(" ", "T"))
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    const iso = formatDateToISOString(endDateForm);
    if (iso !== endDate) {
      handleChangeValue("endDate", iso);
    }
  }, [endDateForm]);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    field: string,
    setShowPicker: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setShowPicker(false);
    if (event.type === "set" && selectedDate) {
      if (field.startsWith("start")) setStartDateForm(selectedDate);
      else setEndDateForm(selectedDate);
    }
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime: Date | undefined,
    field: string,
    setShowPicker: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setShowPicker(false);
    if (event.type === "set" && selectedTime) {
      if (field.startsWith("start")) setStartDateForm(selectedTime);
      else setEndDateForm(selectedTime);
    }
  };

  const handleRemindBeforeChange = (
    field: "hours" | "minutes" | "seconds",
    value: string
  ) => {
    const numericValue = parseInt(value, 10) || 0;
    if (field === "hours") {
      setRemindBefore((prev) => ({
        ...prev,
        hours: Math.min(Math.max(numericValue, 0), 24),
      }));
    } else if (field === "minutes" || field === "seconds") {
      setRemindBefore((prev) => ({
        ...prev,
        [field]: Math.min(Math.max(numericValue, 0), 60),
      }));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.title}
        value={name} // với controlled component
        onChangeText={(text) => handleChangeValue("name", text)}
      />

      {status === "COMPLETE" ? (
        <Text style={styles.completeText}>
          <Text style={styles.highlightText}>COMPLETE AT: </Text>{" "}
          {formatDateTime(completeDate ? completeDate : "")}
        </Text>
      ) : (
        <Text
          style={[
            styles.incompleteText,
            status === "COMPLETED" && { color: "#2ecc71" }, // xanh lá
          ]}
        >
          {status}
        </Text>
      )}
      {/* Description Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          defaultValue={description}
          onChangeText={(text) => handleChangeValue("description", text)}
        />
      </View>

      {/* Start Date */}
      <View style={styles.fieldContainerRow}>
        <Text style={styles.label}>Start Date</Text>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.halfInput}
            onPress={() => setShowStartDatePicker(true)}
          >
            <TextInput
              style={styles.input}
              defaultValue={startDateForm.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
              editable={false}
            />
          </TouchableOpacity>

          {showStartDatePicker && (
            <DateTimePicker
              value={startDateForm}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) =>
                handleDateChange(
                  event,
                  date,
                  "startDate",
                  setShowStartDatePicker
                )
              }
            />
          )}

          {/* Start Time Picker */}
          <TouchableOpacity
            style={styles.halfInput}
            onPress={() => setShowStartTimePicker(true)}
          >
            <TextInput
              style={styles.input}
              value={startDateForm.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
              editable={false}
            />
          </TouchableOpacity>

          {showStartTimePicker && (
            <DateTimePicker
              value={startDateForm}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) =>
                handleTimeChange(
                  event,
                  date,
                  "startDate",
                  setShowStartTimePicker
                )
              }
            />
          )}
        </View>
      </View>

      {/* End Date */}

      <View style={styles.fieldContainerRow}>
        <Text style={styles.label}>End Date</Text>
        <View style={styles.rowContainer}>
          {/* End Date Picker */}
          <TouchableOpacity
            style={styles.halfInput}
            onPress={() => setShowEndDatePicker(true)}
          >
            <TextInput
              style={styles.input}
              value={endDateForm.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
              editable={false}
            />
          </TouchableOpacity>

          {showEndDatePicker && (
            <DateTimePicker
              value={endDateForm}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) =>
                handleDateChange(event, date, "endDate", setShowEndDatePicker)
              }
            />
          )}

          {/* End Time Picker */}
          <TouchableOpacity
            style={styles.halfInput}
            onPress={() => setShowEndTimePicker(true)}
          >
            <TextInput
              style={styles.input}
              value={endDateForm.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
              editable={false}
            />
          </TouchableOpacity>

          {showEndTimePicker && (
            <DateTimePicker
              value={endDateForm}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) =>
                handleTimeChange(event, date, "endDate", setShowEndTimePicker)
              }
            />
          )}
        </View>
      </View>

      {/* Remind Me Before Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Remind Me Before</Text>
        <View style={styles.remindContainer}>
          <TextInput
            style={styles.remindInput}
            placeholder="HH"
            keyboardType="numeric"
            value={remindBefore.hours.toString()}
            onChangeText={(value) => handleRemindBeforeChange("hours", value)}
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.remindInput}
            placeholder="MM"
            keyboardType="numeric"
            value={remindBefore.minutes.toString()}
            onChangeText={(value) => handleRemindBeforeChange("minutes", value)}
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.remindInput}
            placeholder="SS"
            keyboardType="numeric"
            value={remindBefore.seconds.toString()}
            onChangeText={(value) => handleRemindBeforeChange("seconds", value)}
          />
        </View>
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
    fontSize: 18,
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
