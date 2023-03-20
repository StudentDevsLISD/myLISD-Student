import React, { useEffect, useState} from 'react';
import { Button, ScrollView, View, StyleSheet, Text, TextInput} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip'; // import CalendarStrip
import axios from 'axios';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PortalButton from './PortalButton';
const geturl = "http://192.168.1.250:18080/getUnscheduled";
const schedurl = "http://192.168.1.250:18080/schedule";
const getsched = "http://192.168.1.250:18080/getScheduled"
const getFavUrl = "http://192.168.1.250:18080/getFavorites";
const Portal = () => {
    const [startDate, setStartDate] = useState(new Date());
    const datePortal = startDate.toDateString();
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked?: boolean, selected?: boolean } }>({});
    const [buttonTitles, setButtonTitles] = useState<string[]>([]);  // state variable to store button titles
    const [buttonLikes, setButtonLikes] = useState<string[]>([]);
    const [scheduled, setScheduled] = useState<string>();
    const theDate = startDate ? new Date() : null;
    const [searchQuery, setSearchQuery] = useState('');
    const filteredButtonTitles = buttonTitles.filter((title) =>
    title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    //let likeIndex = 0;
    let buttonNames: any[] = [];
    const handleDayPress = (day: any) => {
      const selectedDate = new Date(day).toDateString();
      const newMarkedDates: { [date: string]: {} } = {};
      newMarkedDates[selectedDate] = { selected: true };
      setMarkedDates(newMarkedDates);
      setStartDate(new Date(day));
    };
    const setFavorites = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const data = { 
          username: username, 
          password: password, 
          //date: "'" + startDate.toDateString().substring(8,10) + " " + startDate.toDateString().substring(4,7) + " " + startDate.toDateString().substring(11,15) + "']" 
        };
        const response = await axios.post(getFavUrl, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setButtonLikes(response.data.favorites);
        setUnscheduled(response.data.favorites);
      } catch (error) {
        console.log(error);
      }
    }
    const setUnscheduled = async (buttonLikes: string[]) => {
      let likeIndex = 0;
      try {
        await setFavorites();

        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const data = { 
          username: username, 
          password: password, 
          date: "'" + startDate.toDateString().substring(8,10) + " " + startDate.toDateString().substring(4,7) + " " + startDate.toDateString().substring(11,15) + "']" 
        };
        const response = await axios.post(geturl, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const sortedMeetings = response.data.meetings.sort(
          (a: string, b: string) => {
            const aIsLiked = buttonLikes.includes(a);
            const bIsLiked = buttonLikes.includes(b);
        
            return (aIsLiked === bIsLiked) ? 0 : aIsLiked ? -1 : 1;
          }
        );
        setButtonTitles(sortedMeetings);
      } catch (error) {
        console.log(error);
      }
    };
    const setScheduledMeeting = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const data = { 
          username: username, 
          password: password, 
          date: "'" + startDate.toDateString().substring(8,10) + " " + startDate.toDateString().substring(4,7) + " " + startDate.toDateString().substring(11,15) + "']" 
        };
        const response = await axios.post(getsched, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setScheduled(response.data.scheduled);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      setScheduledMeeting();
      setFavorites();
    }, [startDate]);
    
    useEffect(() => {
      setScheduledMeeting();
      setFavorites();
    }, [scheduled]);

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
          setScheduled(title);
          console.log(startDate instanceof Date)
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
          style={{ height: 100, paddingTop: 15,}}
          calendarHeaderStyle={{ color: 'black' }}
          calendarColor={'white'}
          dateNumberStyle={{ color: 'black' }}
          dateNameStyle={{ color: 'black' }}
          highlightDateNumberStyle={{ color: '#7743CE' }}
          highlightDateNameStyle={{ color: '#7743CE' }}
          selectedDate={startDate}
          onDateSelected={handleDayPress}
          useIsoWeekday={true}
        />
          </View>
          <View style={styles.container}>
          <TouchableOpacity disabled = {true} style = {styles.appButtonContainer2}>
          <Text style={styles.appButtonText2}>{scheduled ? 'Scheduled: ' + scheduled : 'No class scheduled for ' + datePortal}</Text>
          </TouchableOpacity> 
          <TextInput
            placeholder="Search"
            onChangeText={setSearchQuery}
            returnKeyType="search"
            keyboardType="default"
            style={{
              color: '#2e2d2d',
              backgroundColor: '#ebe8e8',
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginTop: 7,
              marginHorizontal: 13,
              borderRadius: 10,
              shadowColor: '#ebe8e8',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              elevation: 5,
            }}
            placeholderTextColor="#2e2d2d"
          />
           </View>
            <ScrollView style={styles.newStyle}>
              {filteredButtonTitles.map((title, index) => (
                <PortalButton doOne = {setFavorites} disabled = {title.includes('[RESTRICTED]')} initiallyLiked = {buttonLikes.includes(title)} theDate = {startDate} key = {index} title = {title.toString()} onPress={() => handleSchedule(title)} styleCont ={styles.appButtonContainer} styleText = {styles.appButtonText}/> 
              ))}
            </ScrollView>
            </>
      );
    };
    const styles = StyleSheet.create({
      container: {
        backgroundColor: "#ebe8e8"
      },
      arrow: {
        width: 30,
        height: 30,
      },
      newStyle: {
        //alignItems: 'center',
        //justifyContent: 'center',
        flex: 2,
        backgroundColor: "#ebe8e8",
        marginVertical: 10,
        
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
        paddingVertical: 13,
        paddingLeft: 12,
        marginHorizontal: 13,
        marginVertical: 7,
        //textAlign: 'flex-start',
        flexDirection: "row",
        justifyContent: "space-between",
        //shadowColor: "black",
        //shadowOffset: ,
        //shadowRadius: 1,
      },
      appButtonContainer2: {
        elevation: 8,
        backgroundColor: "white",
        // borderColor: "black",
        // borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 13,
        paddingHorizontal: 12,
        marginHorizontal: 12,
        marginBottom: 7,
        marginTop: 16
        //shadowColor: "dark-grey",
        //shadowOffset: ,
        //shadowRadius: 0.1,
      },
      appButtonText: {
        fontSize: 18,
        color: "#2e2d2d",
        //fontWeight: "bold",
        alignSelf: "flex-start",
        //textTransform: "lowercase"
      },
      appButtonText2: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
        alignSelf: "center",
        //textTransform: "lowercase"
      },
      textbox: {
        borderColor: "black",
        borderWidth: 2,
        alignSelf: 'center',
        paddingHorizontal: 165,
        paddingVertical: 5,
        backgroundColor: "white"
      },
    
    });
    
    export default Portal;