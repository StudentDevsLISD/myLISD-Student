import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class MentalHealthScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Mental Health</Text>
        </View>

        {/* Animated Breathing Timer */}
        <View style={styles.breathingTimer}>
          {/* Insert your animated breathing timer component here */}
          {/* You may need a separate component/library for this */}
        </View>

        {/* Mental Health Resources */}
        <View style={styles.resources}>
          {/* Add your mental health resources here */}
          <TouchableOpacity style={styles.resourceItem}>
            <Text>Resource 1</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Text>Resource 2</Text>
          </TouchableOpacity>

          {/* Add more resource items as needed */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Background color of the screen
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF', // Header background color
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: 'white', // Header text color
  },
  breathingTimer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resources: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  resourceItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default MentalHealthScreen;
