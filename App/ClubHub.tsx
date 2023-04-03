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

const ClubHub = () => {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);


  const handleFeedbackMessageChange = (value: React.SetStateAction<string>) => {
    setFeedbackMessage(value);
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log( feedbackMessage);

    // Clear form fields
    setFeedbackMessage('');
  };


  return (
    <View style={styles.container}>
      <Input
        label="Feedback Message"
        placeholder="Enter your feedback here"
        value={feedbackMessage}
        // inputStyle = {width = {100}}
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
