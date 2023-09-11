import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback, useContext, useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import Navigation from './Navigation';
import LightStyles from "./LightStyles";
import DarkStyles from "./DarkStyles";
import { ThemeContext } from './ThemeContext';

import { useNavigation, CommonActions, NavigationProp } from '@react-navigation/native';
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
  const navigation = useNavigation();  
  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? LightStyles : DarkStyles;

  const [feeling, setFeeling] = useState("");
  const [submitted, setSubmitted] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


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
    <ScrollView contentContainerStyle={styles.MentalHealthContainer
    }>
      <Text
        style={{
          fontSize: 35,
          fontWeight: "600",
          color: theme === 'light' ? "#000" : "#fff",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Breathing Timer
      </Text>
      <BreathingTimer /> {/* Use the BreathingTimer component here */}
      {/* <Text style={styles.feelingText}>How are you feeling today?</Text>

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
      </TouchableOpacity> */}
    </ScrollView>
  );
};

export default App;
