import React, { useEffect, useState } from 'react';
import { Button, ScrollView, View, StyleSheet, Text } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip'; // import CalendarStrip
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const geturl = "http://192.168.86.26:18080/getUnscheduled";
const schedurl = "http://192.168.86.26:18080/schedule";
const styles = StyleSheet.create({
  container: {
    backgroundColor: "blue"
  },
  arrow: {
    width: 30,
    height: 30,
  },
  newStyle: {
    //alignItems: 'center',
    //justifyContent: 'center',
    flex: 2,
    backgroundColor: "#f0f1f2",
    marginVertical: 20,
    
  },
  // button: { 
  //   backgroundColor: 'white',
  //   borderColor: 'black', 
  //   borderWidth: 2,
  //   borderRadius: 1, 
  //   padding: 10 
  // },
  // buttonText: {
  //   color: 'black',
  //   textAlign: 'center',
  // },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "white",
    // borderColor: "black",
    // borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 7,
    marginVertical: 5,
    shadowColor: "dark-grey",
    //shadowOffset: ,
    shadowRadius: 0.2,
  },
  appButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    //textTransform: "lowercase"
  }

});

const Portal = () => {
    const [startDate, setStartDate] = useState(new Date());
    const datePortal = startDate.toDateString();
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked?: boolean, selected?: boolean } }>({});
    const [buttonTitles, setButtonTitles] = useState<string[]>([]);  // state variable to store button titles
    
  
    const handleDayPress = (day: any) => {
      const selectedDate = new Date(day).toDateString();
      const newMarkedDates: { [date: string]: {} } = {};
      newMarkedDates[selectedDate] = { selected: true };
      setMarkedDates(newMarkedDates);
      setStartDate(new Date(day));
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const username = await AsyncStorage.getItem('username');
          console.log(username);
          const password = await AsyncStorage.getItem('password');
          console.log(password);
          const data = { username: username, password: password, date: "'" + startDate.toDateString().substring(8,10) + " " + startDate.toDateString().substring(4,7) + " " + startDate.toDateString().substring(11,15) + "']" };
          console.log("'" + startDate.toDateString().substring(8,10) + " " + startDate.toDateString().substring(4,7) + " " + startDate.toDateString().substring(11,15) + "']");
          const response = await axios.post(geturl, data, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log(response.data)
          const buttonTitles = response.data.meetings;
          setButtonTitles(buttonTitles);  // update state variable with button titles
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchData();
    }, [startDate]);
  
    useEffect(() => {
      setButtonTitles([]); // reset buttonTitles state variable when startDate changes
    }, [startDate]);
  
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateString = currentDate.toDateString();
      const isMarked = dateString in markedDates;
      markedDates[dateString] = { marked: isMarked };
      }
      const handleSchedule = async (title: string) => {
        try {
          const username = await AsyncStorage.getItem('username');
          const password = await AsyncStorage.getItem('password');
          console.log(title);
          const data = { username: username, password: password, date: "'" + startDate.toDateString().substring(8,10) + " " + startDate.toDateString().substring(4,7) + " " + startDate.toDateString().substring(11,15) + "']", sched_class: title };
          const response = await axios.post(schedurl, data, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      
      return (
        <>
        <View style={styles.container}>
        <CalendarStrip
          calendarAnimation={{ type: 'sequence', duration: 30 }}
          daySelectionAnimation={{
            type: 'background',
            duration: 200,
            highlightColor: '#e3e3e3',
          }}
          style={{ height: 100, paddingTop: 15,}}
          calendarHeaderStyle={{ color: 'black' }}
          calendarColor={'white'}
          dateNumberStyle={{ color: 'black' }}
          dateNameStyle={{ color: 'black' }}
          highlightDateNumberStyle={{ color: '#7743CE' }}
          highlightDateNameStyle={{ color: '#7743CE' }}
          selectedDate={startDate}
          onDateSelected={handleDayPress}
          scrollable={true}
          useIsoWeekday={true}
        />
          </View>
            <ScrollView style={styles.newStyle}>
              {buttonTitles.map((title, index) => (
                //<Button  key={index} title={title}  onPress={() => handleSchedule(title)} />
                <TouchableOpacity key={index} onPress={() => handleSchedule(title)} style={styles.appButtonContainer}>
                  <Text style={styles.appButtonText}>{title}</Text>
                </TouchableOpacity> 
                
              ))}
            </ScrollView>
            </>
      );
    };

    export default Portal;