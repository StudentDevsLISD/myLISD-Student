import React, {useEffect, useState} from 'react';
import { StyleSheet, Text } from 'react-native';
import PeriodTimer from './PeriodTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const mainurl = "http://192.168.86.33:18080";
const ABurl = mainurl + "/getAB";
const Home = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  //const [currentDateString, setCurrentDateString] = useState(currentDate.toISOString);
  const [Lday, setLday] = useState("?");
  const dateArray = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]
  const getDate = async() => {
    try {
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
      const data = { 
        username: username, 
        password: password, 
        date: "'" + currentDate.toDateString().substring(8,10) + " " + currentDate.toDateString().substring(4,7) + " " + currentDate.toDateString().substring(11,15) + "']" 
      };
      const response = await axios.post(ABurl, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setLday(response.data.day)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getDate();
    setCurrentDate;
  }, [currentDate]);

  return (
    <>
    <Text style={styles.letter_day}>{Lday}
    </Text><Text style={styles.letter_day_2}>{'day'}
    </Text><Text style={styles.date}>{
      currentDate.toISOString().substring(5,7) + "/" + 
      currentDate.toISOString().substring(8,10)  
      }</Text>
    <Text style={styles.day}>{dateArray[currentDate.getDay()]}</Text>
    <PeriodTimer
        periodSchedule={[
            { start: new Date('2023-03-15T08:00:00'), duration: 60 },
            { start: new Date('2023-03-15T09:00:00'), duration: 90 },
            { start: new Date('2023-03-15T10:30:00'), duration: 45 },
            { start: new Date('2023-03-15T11:30:00'), duration: 60 },
        ]} />
    </>
  );
};

const styles = StyleSheet.create({
    letter_day:{
      backgroundColor: 'white',
      paddingVertical: 6,
      paddingHorizontal: 34,
      marginHorizontal: 20,
      marginBottom: 7,
      marginTop: 20,
      fontSize: 80,
      borderWidth: 2,
      borderColor: '#ebe8e8',
      borderRadius: 15,
      paddingBottom: 18,
      paddingTop: 0,
      overflow: 'hidden',
    },
    letter_day_2:{
      fontSize: 16,
      paddingVertical: 0,
      paddingHorizontal: 26,
      marginHorizontal: 39,
      marginBottom: 0,
      marginTop: -37,
      height: 100,
      width: 250,
    },
    date: {
      backgroundColor: "#fff",
      marginLeft: 158,
      marginTop: -186,
      fontSize: 66,
      borderWidth: 2,
      borderColor: '#ebe8e8',
      borderRadius: 15,
      paddingBottom: 34,
      paddingTop: 2,
      paddingHorizontal: 20,
      overflow: 'hidden',
  
    },
    day:{
      fontSize: 15,
      paddingVertical: 0,
      marginHorizontal: 225,
      marginBottom: 0,
      marginTop: -30,
      height: 100,
      width: 250,
    },  
  });

export default Home;