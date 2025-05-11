import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { Autocomplete } from "@mui/material";
import { useState } from "react";
import { TextField } from "@material-ui/core";
export default function CustomerSearch({
  customersOptions,
  onSelect,
  setSelected,
}) {
  //   console.log(customersOptions);

  const [city, setCity] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  const cities = customersOptions
    ? [...new Set(customersOptions.map((i) => i.city))]
    : [];
  return (
    <View style={styles.root}>
      <Text style={{ fontSize: 16 }}>חיפוש לקוח:</Text>
      <View style={styles.inputsContainer}>
        <View style={[styles.input]}>
          <Autocomplete
            options={cities}
            renderInput={(params) => (
              <TextField variant="outlined" {...params} label="עיר" />
            )}
            freeSolo
            onChange={(event, value) => setCity(value)}
          />
        </View>
        <View style={styles.input}>
          <TextField
            label="מס' לקוח"
            variant="outlined"
            onChange={(event) => setCustomerId(event.target.value)}
          />
        </View>
      </View>
      <SelectList
        setSelected={(item) => {
          setSelected(item);
        }}
        onSelect={onSelect}
        save="value"
        data={customersOptions}
        placeholder="בחר/י לקוח"
        searchPlaceholder="חיפוש שם"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderRadius: 4,
    color: "#ccccc6",
    padding: 8,
  },
  inputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    width: "45%",
    margin: 8,
  },
});
