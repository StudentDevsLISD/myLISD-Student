import React, { useEffect, useState } from 'react';
import { Button, ScrollView, View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const geturl = "http://192.168.86.26:18080/getUnscheduled";
const schedurl = "http://192.168.86.26:18080/schedule";
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 100,
  },
  arrow: {
    width: 30,
    height: 30,
  },
  newStyle: {
    //alignItems: 'center',
    //justifyContent: 'center',
    flex: 2,
    backgroundColor: "red",
    marginTop: 130,
    maxHeight: 400,
    
  },

});

const Portal = () => {
    const [startDate, setStartDate] = useState(new Date());
    const datePortal = startDate.toDateString();
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked?: boolean, selected?: boolean } }>({});
    const [buttonTitles, setButtonTitles] = useState<string[]>([]);  // state variable to store button titles
    
    const handlePrevWeek = () => {
      setStartDate(new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    };
  
    const handleNextWeek = () => {
      setStartDate(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    };
  
    const handleDayPress = (day: any) => {
      const selectedDate = day.dateString;
      const newMarkedDates: { [date: string]: {} } = {};
      newMarkedDates[selectedDate] = { selected: true };
      setMarkedDates(newMarkedDates);
      setStartDate(new Date(selectedDate));
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
  
    const endDate = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      markedDates[currentDate.toISOString().slice(0, 10)] = { marked: false };
    }
    markedDates[startDate.toISOString().slice(0, 10)] = { selected: true };
    endDate.setDate(endDate.getDate() + 6);

    const schedule = async (title2: String) => {
        try {
            const username = await AsyncStorage.getItem('username');
            console.log(username);
            const password = await AsyncStorage.getItem('password');
            console.log(password);
            const data = { username: username, password: password, date: "'" + startDate.toDateString().substring(8,10) + " " + startDate.toDateString().substring(4,7) + " " + startDate.toDateString().substring(11,15) + "']", sched_class: title2 };
            //console.log("'" + startDate.toDateString().substring(8,10) + " " + startDate.toDateString().substring(4,7) + " " + startDate.toDateString().substring(11,15) + "']");
            const response = await axios.post(schedurl, data, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            console.log(response.data.status)
            //const buttonTitles = response.data.meetings;
            //setButtonTitles(buttonTitles);  // update state variable with button titles
          } catch (error) {
            console.log(error);
          }
    }
    const renderButtons = () => {
      return buttonTitles.map((title: string, index: number) => (
        
        <Button
          key={index}
          title={title}
          onPress={async () => await schedule(title)}
        />
      ));
    };
    
    return (
      <>
        <View style={styles.container}>
          <FontAwesome style={styles.arrow} name="chevron-left" size={30} onPress={handlePrevWeek} />
          <Calendar
            minDate={startDate.toISOString().slice(0, 10)}
            maxDate={endDate.toISOString().slice(0, 10)}
            markedDates={markedDates}
            initialDate={startDate.toISOString().slice(0, 10)}
            onDayPress={handleDayPress}
          />
          <FontAwesome style={styles.arrow} name="chevron-right" size={30} onPress={handleNextWeek} />
        </View>
        
       
  
      
      <ScrollView style = {styles.newStyle}>
        {renderButtons()}
      </ScrollView>
      
    </>
  );
};

export default Portal;
