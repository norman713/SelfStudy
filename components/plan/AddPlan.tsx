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
import { formatDateToISOString } from "@/util/format";

interface AddPlanProps {
  setPlanInfo?: React.Dispatch<React.SetStateAction<any>>;
}

export default function AddPlan({ setPlanInfo }: AddPlanProps) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [remindBefore, setRemindBefore] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

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

  const handleChange = (field: string, value: string) => {
    if (setPlanInfo)
      setPlanInfo((prev: any) => ({
        ...prev,
        [field]: value,
      }));
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    field: string,
    setShowPicker: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setShowPicker(false);
    if (event.type === "set" && selectedDate) {
      if (field.startsWith("start")) setStartDate(selectedDate);
      else setEndDate(selectedDate);
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
      if (field.startsWith("start")) setStartDate(selectedTime);
      else setEndDate(selectedTime);
    }
  };

  useEffect(() => {
    const updateNotify = () => {
      const time =
        String(remindBefore.hours).padStart(2, "0") +
        ":" +
        String(remindBefore.minutes).padStart(2, "0") +
        ":" +
        String(remindBefore.seconds).padStart(2, "0");
      handleChange("notifyBefore", time);
    };
    updateNotify();
  }, [remindBefore]);

  useEffect(() => {
    const updateStartDate = () => {
      handleChange("startDate", formatDateToISOString(startDate));
    };
    updateStartDate();
  }, [startDate]);

  useEffect(() => {
    const updateEndDate = () => {
      handleChange("endDate", formatDateToISOString(endDate));
    };
    updateEndDate();
  }, [endDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add new plan</Text>

      {/* Name Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter plan name"
          onChangeText={(text) => handleChange("name", text)}
        />
      </View>

      {/* Description Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter plan description"
          onChangeText={(text) => handleChange("description", text)}
        />
      </View>

      {/* Start Date */}
      <View style={styles.fieldContainerRow}>
        <Text style={styles.label}>Start Date</Text>
        <View style={styles.rowContainer}>
          {/* Start Date Picker */}
          <TouchableOpacity
            style={styles.halfInput}
            onPress={() => setShowStartDatePicker(true)}
          >
            <TextInput
              style={styles.input}
              value={startDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
              editable={false}
            />
          </TouchableOpacity>

          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
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
              value={startDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
              editable={false}
            />
          </TouchableOpacity>

          {showStartTimePicker && (
            <DateTimePicker
              value={startDate}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) =>
                handleTimeChange(
                  event,
                  date,
                  "startTime",
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
              value={endDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
              editable={false}
            />
          </TouchableOpacity>

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
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
              value={endDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
              editable={false}
            />
          </TouchableOpacity>

          {showEndTimePicker && (
            <DateTimePicker
              value={endDate}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) =>
                handleTimeChange(event, date, "endTime", setShowEndTimePicker)
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
    marginBottom: 20,
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
    borderRadius: 8,
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
});
