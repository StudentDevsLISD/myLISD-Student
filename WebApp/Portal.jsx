import React, { useContext, useEffect, useState} from 'react';
import { ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PortalButton from './PortalButton';
const mainurl = "https://api.leanderisd.org/portal";
const geturl = mainurl + "/getMeetings";
const schedurl = mainurl + "/portalClass";
const getsched = mainurl + "/getScheduledMeeting"
const getFavUrl = mainurl + "/getFavorites";
import { LISD_CLIENT_AUTH_UN, LISD_CLIENT_AUTH_PWD, LISD_API_KEY } from '@env';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import { storeData, retrieveData, removeItem } from './storage.js';



const Portal = ({campus}) => {
    const [startDate, setStartDate] = useState(new Date());
    const datePortal = startDate.toDateString();
    const [markedDates, setMarkedDates] = useState({});
    const [buttonTitles, setButtonTitles] = useState([]);  // state variable to store button titles
    const [buttonLikes, setButtonLikes] = useState([]);
    const [scheduled, setScheduled] = useState();
    const theDate = startDate ? new Date() : null;
    const [isMandatory, setIsMandatory] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [MeetingDict, setMeetingDict] = useState({});
    const [RestrictedDict, setRestrictedDict] = useState({});
    const [FullDict, setFullDict] = useState({});
    const [MandDict, setMandDict] = useState({});

    const { theme } = useContext(ThemeContext);
    const styles = theme === 'light' ? lightStyles : darkStyles;

    const filteredButtonTitles = buttonTitles.filter((title) =>
    title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    //let likeIndex = 0;
    const handleDayPress = (day) => {
      const selectedDate = new Date(day).toDateString();
      const newMarkedDates = {};
      newMarkedDates[selectedDate] = { selected: true };
      setMarkedDates(newMarkedDates);
      setStartDate(new Date(day));
    };
    const setUnscheduled = async () => {
      // console.log("trying")
      let likeIndex = 0;
      try {
        // await setFavorites();

        const idNum = await retrieveData('studentID');
        const data = { 
          campus: campus?.toString(), 
          student: idNum, 
          date: startDate.toLocaleString("default", { year: "numeric" }) + "-" + 
          startDate.toLocaleString("default", { month: "2-digit" }) + "-"  +
          startDate.toLocaleString("default", { day: "2-digit" })
        };
        const response = await axios.post(geturl, data, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'clientAuthUN': LISD_CLIENT_AUTH_UN,
            'clientAuthPwd': LISD_CLIENT_AUTH_PWD,
          },
          params: {
            APIKey: LISD_API_KEY,
          }
        });
        var meetingLikes = [];
        var meetingNames = [];
        const meetingDict = {};
        const meetingRestricted = {};
        const meetingFull = {};
        const meetingMand = {};
        for(var i = 0; i<response.data.meetings.length; i++){
            if(response.data.meetings[i].restricted){
              meetingNames.push("RESTRICTED - " + response.data.meetings[i].name);
            } else if(response.data.meetings[i].full){
              meetingNames.push("FULL - " + response.data.meetings[i].name);
            } else {
              meetingNames.push(response.data.meetings[i].name);
            }
            if(response.data.meetings[i].favorite){
              meetingLikes.push(response.data.meetings[i].name)
            }
        }
        for (let i = 0; i < meetingNames.length; i++) {
          meetingDict[meetingNames[i]] = response.data.meetings[i].schedule_id;
        }
        for(let i = 0; i < meetingNames.length; i++){
          meetingRestricted[meetingNames[i]] = response.data.meetings[i].restricted;
        }
        for(let i = 0; i < meetingNames.length; i++){
          meetingFull[meetingNames[i]] = response.data.meetings[i].full;
        }
        for(let i = 0; i < meetingNames.length; i++){
          meetingMand[meetingNames[i]] = response.data.meetings[i].mandatory;
        }
        setMeetingDict(meetingDict);
        setRestrictedDict(meetingRestricted);
        setFullDict(meetingFull);
        setMandDict(meetingMand);
        setButtonLikes(meetingLikes);
        const sortedMeetings = Object.keys(meetingDict).sort(
          (a, b) => {
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
        const idNum = await retrieveData('studentID');
        const data = { 
          campus: campus?.toString(), 
          student: idNum, 
          date: startDate.toLocaleString("default", { year: "numeric" }) + "-" + 
          startDate.toLocaleString("default", { month: "2-digit" }) + "-"  +
          startDate.toLocaleString("default", { day: "2-digit" })         };
        const response = await axios.post(getsched, data, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'clientAuthUN': LISD_CLIENT_AUTH_UN,
            'clientAuthPwd': LISD_CLIENT_AUTH_PWD,
          },
          params: {
            APIKey: LISD_API_KEY,
          }
        });
        if(response.data.scheduled[0].mandatory){
          setScheduled("MANDATORY - " + response.data.scheduled[0].name);
          setIsMandatory(true);
        } else {
          setScheduled(response.data.scheduled[0].name);
          setIsMandatory(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    // useEffect(() => {
    //   setScheduledMeeting();
    //   setUnscheduled();
    // }, [startDate]);
    
    useEffect(() => {
      setScheduledMeeting();
      setUnscheduled();
    }, [startDate, scheduled]);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateString = currentDate.toDateString();
      const isMarked = dateString in markedDates;
      markedDates[dateString] = { marked: isMarked };
      }
      const handleSchedule = async (title) => {
        try {
          const idNum = await retrieveData('studentID');
          console.log(title);
          const data = { 
            student: idNum, 
            schedule_id: Number(MeetingDict?.[title])
          }
          const response = await axios.post(schedurl, data, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': '*/*',
              'clientAuthUN': LISD_CLIENT_AUTH_UN,
              'clientAuthPwd': LISD_CLIENT_AUTH_PWD,
            },
            params: {
              APIKey: LISD_API_KEY,
            }
          });
          setScheduled(title);
          //console.log(startDate instanceof Date)
          //console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      };

      const renderItem = ({ item, index }) => (
        <PortalButton /* onLikeButtonPressed={onLikeButtonPressed} */ schedule_id ={MeetingDict?.[item]} /*doOne = {setUnscheduled}*/ disabled = {isMandatory || RestrictedDict?.[item] || FullDict?.[item] || MandDict?.[item]} initiallyLiked = {buttonLikes.includes(item)} theDate = {startDate} key = {index} title = {item.toString()} onPress={() => handleSchedule(item)} styleCont ={styles.PortalAppButtonContainer} styleText = {styles.PortalAppButtonText}/> 
      );

      return (
        <>
        <View style={styles.PortalContainer}>
        <CalendarStrip
        //if there is an error on the daySelectionAnimation do npm install react-native-calendar-strip@latest
          daySelectionAnimation={{
            type: 'background',
            duration: 200,
            highlightColor: '#3495eb',
          }}
          calendarAnimation={{ type: 'sequence', duration: 30 }}
          style={{ height: 100, paddingTop: "4.04%", paddingHorizontal: 3,}}
          calendarHeaderStyle={{ color: 'black' }}
          calendarColor={'white'}
          dateNumberStyle={{ color: 'black' }}
          dateNameStyle={{ color: 'black' }}
          highlightDateNumberStyle={{ color: 'white' }}
          highlightDateNameStyle={{ color: 'white' }}
          selectedDate={startDate}
          onDateSelected={handleDayPress}
          useIsoWeekday={true}
          scrollable = {true}
        />
          </View>
          <View style={styles.PortalContainer}>
          <TouchableOpacity disabled = {true} style = {styles.PortalAppButtonContainer2}>
          <Text style={styles.PortalAppButtonText2}>{scheduled ? 'Scheduled: ' + scheduled : 'No class scheduled for ' + datePortal}</Text>
          </TouchableOpacity> 
          <TextInput
            placeholder="Search"
            onChangeText={setSearchQuery}
            returnKeyType="search"
            keyboardType="default"
            style={{
              color: 'black',
              backgroundColor: '#ebe8e8',
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginTop: 7,
              marginBottom: 0,
              height: 35,
              //35
              fontSize: 18,
              marginHorizontal: "3.5%",
              //13
              borderRadius: 0,
              shadowColor: '#ebe8e8',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              elevation: 5,
              borderBottomWidth: 3, // Add this line to create the border
              borderBottomColor: '#3495eb', // Customize the color of the border
            }}
            placeholderTextColor="#2e2d2d"
          />
           </View>
           <FlatList
            style={styles.PortalNewStyle}
            data={filteredButtonTitles}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            />
            </>
      );
    };
    
    export default Portal;