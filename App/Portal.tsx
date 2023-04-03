import React, { useEffect, useState} from 'react';
import { ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PortalButton from './PortalButton';
const mainurl = "https://api.leanderisd.org/portal";
const geturl = mainurl + "/getMeetings";
const schedurl = mainurl + "/portalClass";
const getsched = mainurl + "/getScheduledMeeting"
const getFavUrl = mainurl + "/getFavorites";

interface MeetingDictionary {
  [key: string]: number;
}

interface StringBoolDictionary {
  [key: string]: boolean;
}

const Portal = () => {
    const [startDate, setStartDate] = useState(new Date());
    const datePortal = startDate.toDateString();
    const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked?: boolean, selected?: boolean } }>({});
    const [buttonTitles, setButtonTitles] = useState<string[]>([]);  // state variable to store button titles
    const [buttonLikes, setButtonLikes] = useState<string[]>([]);
    const [scheduled, setScheduled] = useState<string>();
    const theDate = startDate ? new Date() : null;
    const [isMandatory, setIsMandatory] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [MeetingDict, setMeetingDict] = useState<MeetingDictionary>({});
    const [RestrictedDict, setRestrictedDict] = useState<StringBoolDictionary>({});
    const [FullDict, setFullDict] = useState<StringBoolDictionary>({});
    const [MandDict, setMandDict] = useState<StringBoolDictionary>({});
    const filteredButtonTitles = buttonTitles.filter((title) =>
    title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    //let likeIndex = 0;
    let buttonNames: any[] = [];
    const onLikeButtonPressed = (title: string, isLiked: any) => {
      if (isLiked) {
        setButtonLikes([...buttonLikes, title]);
      } else {
        setButtonLikes(buttonLikes.filter(title => title !== title));
      }
    };
    const handleDayPress = (day: any) => {
      const selectedDate = new Date(day).toDateString();
      const newMarkedDates: { [date: string]: {} } = {};
      newMarkedDates[selectedDate] = { selected: true };
      setMarkedDates(newMarkedDates);
      setStartDate(new Date(day));
    };
    const setUnscheduled = async () => {
      // console.log("trying")
      let likeIndex = 0;
      try {
        // await setFavorites();

        const idNum = await AsyncStorage.getItem('studentID');
        const data = { 
          campus: "003", 
          student: idNum, 
          date: startDate.toLocaleString("default", { year: "numeric" }) + "-" + 
          startDate.toLocaleString("default", { month: "2-digit" }) + "-"  +
          startDate.toLocaleString("default", { day: "2-digit" })
        };
        const response = await axios.post(geturl, data, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'clientAuthUN': 'usrVRHSApiDataAccess',
            'clientAuthPwd': '59kt61&Tm!F5',
          },
          params: {
            APIKey: '6cbc0628-6147-4670-8be7-a8bc91206e2b',
          }
        });
        var meetingLikes = [];
        var meetingNames = [];
        const meetingDict: MeetingDictionary = {};
        const meetingRestricted: StringBoolDictionary = {};
        const meetingFull: StringBoolDictionary = {};
        const meetingMand: StringBoolDictionary = {};
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
        const idNum = await AsyncStorage.getItem('studentID');
        const data = { 
          campus: "003", 
          student: idNum, 
          date: startDate.toLocaleString("default", { year: "numeric" }) + "-" + 
          startDate.toLocaleString("default", { month: "2-digit" }) + "-"  +
          startDate.toLocaleString("default", { day: "2-digit" })         };
        const response = await axios.post(getsched, data, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'clientAuthUN': 'usrVRHSApiDataAccess',
            'clientAuthPwd': '59kt61&Tm!F5',
          },
          params: {
            APIKey: '6cbc0628-6147-4670-8be7-a8bc91206e2b',
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
    useEffect(() => {
      setScheduledMeeting();
      setUnscheduled();
    }, [startDate]);
    
    useEffect(() => {
      setScheduledMeeting();
      setUnscheduled();
    }, [scheduled, /* buttonLikes */, onLikeButtonPressed]);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateString = currentDate.toDateString();
      const isMarked = dateString in markedDates;
      markedDates[dateString] = { marked: isMarked };
      }
      const handleSchedule = async (title: string) => {
        try {
          const idNum = await AsyncStorage.getItem('studentID');
          console.log(title);
          const data = { 
            student: idNum, 
            schedule_id: Number(MeetingDict?.[title])
          }
          const response = await axios.post(schedurl, data, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': '*/*',
              'clientAuthUN': 'usrVRHSApiDataAccess',
              'clientAuthPwd': '59kt61&Tm!F5',
            },
            params: {
              APIKey: '6cbc0628-6147-4670-8be7-a8bc91206e2b',
            }
          });
          setScheduled(title);
          //console.log(startDate instanceof Date)
          //console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      };

      return (
        <>
        <View style={styles.container}>
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
            <ScrollView style={styles.newStyle}>
              {filteredButtonTitles.map((title, index) => (
                <PortalButton onLikeButtonPressed={onLikeButtonPressed} schedule_id ={MeetingDict?.[title]} /*doOne = {setUnscheduled}*/ disabled = {isMandatory || RestrictedDict?.[title] || FullDict?.[title] || MandDict?.[title]} initiallyLiked = {buttonLikes.includes(title)} theDate = {startDate} key = {index} title = {title.toString()} onPress={() => handleSchedule(title)} styleCont ={styles.appButtonContainer} styleText = {styles.appButtonText}/> 
              ))}
            </ScrollView>
            </>
      );
    };
    const styles = StyleSheet.create({
      container: {
        backgroundColor: "#ebe8e8",
        // marginBottom: -200,
      },
      newStyle: {
        flex: 2,
        backgroundColor: "#ebe8e8",
        // marginTop: -200,
        //padding: "1.2%"
        
      },
      appButtonContainer: {
        elevation: 8,
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: "3.5%",
        //13
        paddingLeft: "3.23%",
        //12
        paddingRight: 0,
        marginHorizontal: "3.5%",
        //13,
        marginVertical: "1.88%",
        //7
        flexDirection: "row",
        justifyContent: "space-between",
      },
      appButtonContainer2: {
        elevation: 8,
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: "3.5%",
        paddingHorizontal: "3.23%",
        marginHorizontal: "3.23%",
        marginBottom: "1.88%",
        marginTop: 16/* "4.30%" */,
        //16
      },
      appButtonText: {
        fontSize: 18,
        color: "#2e2d2d",
        alignSelf: "center",
        width: "80%"
        //marginRight: "10%",
      },
      appButtonText2: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
        alignSelf: "center",
      },
    });
    
    export default Portal;