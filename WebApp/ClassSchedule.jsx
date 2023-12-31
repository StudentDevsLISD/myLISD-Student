import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, border} from 'react-native';
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
    try {
      const isLogged = await retrieveData('isLoggedIn')
      setIsLoggedIn(isLogged == "true" ? true : false)
      if (isLogged == "true" ? true : false) {
        setIsLoading(true);
        await fetchSchedule();
      } else {
      setIsLoading(false);
      await storeData('isLoggedIn', 'false')
      setIsLoggedIn(false)
      }
    } catch (error) {
      console.error('Error loading data', error);
      setIsLoading(false);
      await storeData('isLoggedIn', 'false')
      setIsLoggedIn(false)
    }
  };
  const fetchSchedule = async (username, password) => {
    let response ='';
    try {
      setIsLoading(true);
      response = await axios.get('https://' + IP_ADDRESS + ':8082/schedule', {
          withCredentials: true
        })
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsLoggedIn(false);
      await storeData('isLoggedIn', 'false')
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
        <View style={styles.HomeBox5}>
          <ListItem containerStyle={theme === 'light' ? {backgroundColor: "white"} : {backgroundColor: "#333", border}}>
            <Text  style={styles.HomeScreenIcon5}>{i.period}</Text>
            <ListItem.Content>
              <ListItem.Title style={styles.HomeTitleText5}>{i.description}</ListItem.Title>
              <ListItem.Subtitle style={styles.HomeDescriptionText5}>{i.teacher}</ListItem.Subtitle>
            </ListItem.Content>
            <Text  style={styles.HomeScreenIcon5}>{i.room}</Text>
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
