import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, TouchableOpacity} from 'react-native';
import PeriodTimer from './PeriodTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NavigationProp, useFocusEffect, useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';

const periodSchedule = [
  { start: new Date(Date.UTC(0, 0, 0, 3, 45)), duration: 90 }, // 1st period
  { start: new Date(Date.UTC(0, 0, 0, 5, 20)), duration: 90 }, // 2nd period
  { start: new Date(Date.UTC(0, 0, 0, 6, 50)), duration: 35 }, // Ranger time
  { start: new Date(Date.UTC(0, 0, 0, 7, 30)), duration: 120 }, // 3rd + lunch
  { start: new Date(Date.UTC(0, 0, 0, 9, 35)), duration: 90 }, // 4th period
];

const mainurl = "http://192.168.86.33:18080";
const ABurl = mainurl + "/getAB";
const getsched = mainurl + "/getScheduled";
const Home = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduled, setScheduled] = useState<string>();;
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
  const getScheduled = async() => {
    try {
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
      const data = { 
        username: username, 
        password: password, 
        date: "'" + currentDate.toDateString().substring(8,10) + " " + currentDate.toDateString().substring(4,7) + " " + currentDate.toDateString().substring(11,15) + "']" 
      };
      const response = await axios.post(getsched, data, {
        headers: {
          'Content-Type': 'application/json'
        }
        });
        setScheduled(response.data.scheduled)
        } catch (error) {
          console.log(error);
        }
      }   
      useEffect(() => {
        getDate();
        setCurrentDate;
        getScheduled();
      }, []);
    
      useFocusEffect(
        React.useCallback(() => {
          getDate();
          setCurrentDate(new Date()); // this will update the state and trigger a re-render
          getScheduled();
        }, [])
      );
  
  // const handleHomePress = () => {
  //   setShouldRender(!shouldRender); // toggle state variable to trigger re-render
  //   navigation.navigate('Home');
  // };

  return (
    <View style = {styles.container}>
    <Text style={styles.letter_day}>{Lday}
    </Text><Text style={styles.letter_day_2}>{'day'}
    </Text><Text style={styles.date}>{
      currentDate.toISOString().substring(5,7) + "/" + 
      currentDate.toISOString().substring(8,10)  
      }</Text>
    <Text style={styles.day}>{dateArray[currentDate.getDay()]}</Text>
    <PeriodTimer
         />
    <TouchableOpacity disabled = {true} style = {styles.appButtonContainer2}>
          <Text style={styles.appButtonText2}>{scheduled ? 'Scheduled: ' + scheduled : 'No class scheduled for ' + currentDate.toDateString()}</Text>
    </TouchableOpacity>     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "ebe8e8"
  },  
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
    paddingTop: -10,
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
    appButtonContainer2: {
      elevation: 8,
      backgroundColor: "white",
      borderRadius: 10,
      paddingVertical: 13,
      paddingHorizontal: 12,
      marginHorizontal: 12,
      marginBottom: 7,
      marginTop: 16,
      width: '93%'
    },
    appButtonText2: {
      fontSize: 18,
      color: "black",
      alignSelf: "center",
    },  
  });

export default Home;