import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

import BreathingTimer from "./BreathingTimer"; // Import the BreathingTimer component

const App = () => {
  const [feeling, setFeeling] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleTextChange = (newText) => {
    setText(newText);
    // Calculate the height based on the content
    setInputHeight(Math.max(40, newText.split('\n').length * 20)); // Adjust the multiplier as needed
  };

  const handleFormSubmit = useCallback(() => {
    setSubmitted(true);
    console.log(feeling);
    setFeeling(""); // Clear the text input
  }, [feeling]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text
        style={{
          fontSize: 35,
          fontWeight: "600",
          color: "#000",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Breathing Timer
      </Text>
      <BreathingTimer /> {/* Use the BreathingTimer component here */}
      <Text style={styles.feelingText}>How are you feeling today?</Text>

      <TextInput
  multiline
  value={feeling}
  onChangeText={(text) => {
    setFeeling(text);
    handleTextChange(text); // Call your custom function here if needed
  }}
  placeholder="Enter your feelings here"
  style={styles.input}
/>


      <TouchableOpacity
        style={[
          styles.submitButton,
          submitted && styles.submittedButton,
        ]}
        onPress={handleFormSubmit}
        disabled={submitted}
      >
        <Text style={styles.submitButtonText}>
          {submitted ? "Submitted" : "Submit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  feelingText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#000",
    marginVertical: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    marginHorizontal: 20,
  },
  submitButton: {
    width: '50%',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  submittedButton: {
    backgroundColor: '#ccc',
    marginBottom: 20,

  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;
