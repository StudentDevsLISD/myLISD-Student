import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import { ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import {IP_ADDRESS} from '@env';
import alert from './alert.js'
import { storeData, retrieveData, removeItem } from './storage.js';
import Icon from 'react-native-vector-icons/FontAwesome';
const ClassSchedule = () => {
  const navigation = useNavigation();

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    loadCredentials();
  }, []);
  
  const loadCredentials = async () => {
    setIsLoggedIn(true);
    fetchSchedule()
  };
  const fetchSchedule = async (username, password) => {
    let response ='';
    try {
      setIsLoading(true);
      response = await axios.get('http://' + IP_ADDRESS + ':8082/schedule', {
          withCredentials: true
        })
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsLoggedIn(false);
      alert("Error logging in")
    }      
    if(response.data){
      console.log(response.data)
      setSchedule(response.data.schedule);
    }
  };
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
  if (isLoading) {
    return (
      <View style={styles.AttendanceLoadingContainer}>
        <ActivityIndicator
          animating={true}
          size={'large'}
          color={theme === 'light' ? '#005a87' : '#ede1d1'}
        />
      </View>
    );
  }
  return (
    <View style={styles.ContactTeacherContainer}>
    {!isLoggedIn ? (
      <TouchableOpacity 
        style={styles.GradesLoginButton} 
        onPress={() => loadCredentials()}
      >
        <Text style={styles.GradesLoginButtonText}>Login with HAC</Text>
      </TouchableOpacity>
    ):(
    <ScrollView>
    <Text style={styles.ContactTeacherSectionTitle}>Schedule</Text>

    {schedule.map((i) => (
      <TouchableOpacity key={i.period} onPress={() => {}}>
        <View style={styles.HACBox}>
          <ListItem>
            <Text>{i.period}</Text>
            <ListItem.Content>
              <ListItem.Title>{i.description}</ListItem.Title>
              <ListItem.Subtitle style={styles.HACDescriptionText}>{i.teacher}</ListItem.Subtitle>
            </ListItem.Content>
            <Text>{i.room}</Text>
          </ListItem>
        </View>
      </TouchableOpacity>
    ))}
    </ScrollView>
    )}
    </View>
  );
};


export default ClassSchedule;
