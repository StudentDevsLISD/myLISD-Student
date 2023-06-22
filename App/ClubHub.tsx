import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Input, Button, Divider } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { GoogleSignin, User } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import { Calendar } from 'react-native-calendars';
import { useAuth } from './AuthContext';

import axios from 'axios';

const ClubHub = () => {
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleFeedbackMessageChange = (value: React.SetStateAction<string>) => {
    setFeedbackMessage(value);
  };

  const handleSubmit = () => {
    console.log(feedbackMessage);

    // Send data to Google Forms API
    const formUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfaz1RhM1BQ7Blhltd_gRCAstPiWJoUfVyf1bwDAe7a4oIs2A/formResponse';
    const fieldId = '770734773';
    const formData = {
      'entry.770734773': feedbackMessage,
    };

    axios.post(formUrl, new URLSearchParams(formData).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    

    // Clear form fields
    setFeedbackMessage('');
  };

  return (
    <View>
      <Input
        label="Feedback Message"
        placeholder="Enter your feedback here"
        value={feedbackMessage}
        onChangeText={handleFeedbackMessageChange}
        multiline
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});

export default ClubHub;
