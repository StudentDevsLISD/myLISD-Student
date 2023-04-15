import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import PeriodTimer from './PeriodTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuth } from './AuthContext';
import CalendarEvent from './CalendarEvent';

const mainurl = 'https://api.leanderisd.org/portal';
const ABurl = mainurl + '/getAB';
const getsched = mainurl + '/getScheduledMeeting';

GoogleSignin.configure({
  iosClientId: '809923761821-5lio914f08csk2hgkufapgh19l0418n0.apps.googleusercontent.com',
  webClientId: GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});

const Home = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduled, setScheduled] = useState<string>();
  const [Lday, setLday] = useState('?');
  const [events, setEvents] = useState<{ id: string, summary: string ,start: string, end: string}[]>([]);
  const { isSignedIn, setIsSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const dateArray = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      await AsyncStorage.setItem('asyncAccessToken', tokens.accessToken);
      return tokens.accessToken;
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const removeDuplicateEvents = (eventsArray: any[]) => {
    const uniqueEvents = eventsArray.reduce((accumulator: any[], event: any) => {
      if (!accumulator.find((e: any) => e.id === event.id)) {
        accumulator.push(event);
      }
      return accumulator;
    }, []);
    return uniqueEvents;
  };


  const fetchEvents = async (calendarId: string | number | boolean, date: string | number | Date, accessToken: any) => {
    setIsLoading(true);
    const timeMin = new Date(date);
    timeMin.setHours(0, 0, 0, 0);
  
    const timeMax = new Date(timeMin);
    timeMax.setDate(timeMax.getDate());
    timeMax.setHours(23, 59, 59, 999);
    
    const response = await axios.get(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          minAccessRole: 'freeBusyReader', // fetch all calendars the user can see free/busy information for
        },
      },
    );
  
    const calendarList = response.data.items;
    const events = [];
  
    for (let i = 0; i < calendarList.length; i++) {
      const calendar = calendarList[i];
      if (calendar.id === 'primary') {
        // skip the primary calendar since we are already fetching events from it
        continue;
      }
  
      const calendarEvents = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
          },
        },
      );
  
      events.push(...calendarEvents.data.items);
    }
  
    // fetch events from the primary calendar
    const primaryEvents = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent('primary')}/events`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        },
      },
    );
  
    events.push(...primaryEvents.data.items);
  
    const formattedEvents = events.map((event: any) => ({
      id: event.id,
      summary: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
    }));
  
    const sortedEvents = formattedEvents.sort((a, b) => {
      const aStart = new Date(a.start);
      const bStart = new Date(b.start);
      return aStart.getTime() - bStart.getTime();
    });
    setIsLoading(false);
    return sortedEvents;
    
  };
  
  

  const handleSignIn = useCallback(async () => {
    const accessToken = await signIn();
    if (accessToken) {
      setIsSignedIn(true);
      const calendarId = 'primary';
      setIsLoading(true); // Set isLoading to true before fetching events
      const fetchedEvents = await fetchEvents(calendarId, currentDate, accessToken);
      const uniqueEvents = removeDuplicateEvents(fetchedEvents);
      setEvents(uniqueEvents);
      await AsyncStorage.setItem('accessToken', accessToken);
      setIsLoading(false); // Set isLoading to false after fetching events
    }
  }, [currentDate]);
  

  const getDate = async () => {
    try {
      const campus = await AsyncStorage.getItem("campus");
      const data = {
        campus: campus?.toString(),
        date:
          currentDate.toLocaleString('default', { year: 'numeric' }) +
          '-' +
          currentDate.toLocaleString('default', { month: '2-digit' }) +
          '-' +
          currentDate.toLocaleString('default', { day: '2-digit' }),
      };
      const response = await axios.post(ABurl, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          clientAuthUN: 'usrVRHSApiDataAccess',
          clientAuthPwd: '59kt61&Tm!F5',
        },
        params: {
          APIKey: '6cbc0628-6147-4670-8be7-a8bc91206e2b',
        },
      });
      setLday(response.data.day);
    } catch (error) {
      console.log(error);
    }
  };

  const getScheduled = async () => {
    try {
      const idNum = await AsyncStorage.getItem('studentID');
      const campus = await AsyncStorage.getItem("campus");
      const data = {
        campus: campus?.toString,
        student: idNum,
        date:
          currentDate.toLocaleString('default', { year: 'numeric' }) +
          '-' +
          currentDate.toLocaleString('default', { month: '2-digit' }) +
          '-' +
          currentDate.toLocaleString('default', { day: '2-digit' }),
      };
      const response = await axios.post(getsched, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          clientAuthUN: 'usrVRHSApiDataAccess',
          clientAuthPwd: '59kt61&Tm!F5',
        },
        params: {
          APIKey: '6cbc0628-6147-4670-8be7-a8bc91206e2b',
        },
      });
      setScheduled(response.data.scheduled[0].name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getDate();
    getScheduled();
  }, [currentDate]);

  useFocusEffect(
    React.useCallback(() => {
      getDate();
      setCurrentDate(new Date());
      getScheduled();
    }, [])
  );

  return (
    <View style={styles.container}>
     <Text style={styles.letter_day}>{Lday}</Text>
  <Text style={styles.letter_day_2}>{'day'}</Text>
  <Text style={styles.date}>
    {currentDate.toISOString().substring(5, 7) +
      '/' +
      currentDate.toISOString().substring(8, 10)}
  </Text>
  <Text style={styles.day}>{dateArray[currentDate.getDay()]}</Text>
  <PeriodTimer />
  <TouchableOpacity disabled={true} style={styles.appButtonContainer2}>
    <Text style={styles.appButtonText2}>
      {scheduled
        ? 'Scheduled: ' + scheduled
        : 'No class scheduled for ' + currentDate.toDateString()}
    </Text>
  </TouchableOpacity>
  <Text style = {styles.work}>
    Today's Work
  </Text>
  <>
  
  {!isSignedIn && (
        <TouchableOpacity onPress={handleSignIn} style={styles.googlebox}>
          <Image source={require('../assets/google.png')} style={{ width: 60, height: 60,marginLeft: 20,}} />
          <Text style = {styles.google1}>Sign in with Google</Text>
        </TouchableOpacity>
      )}
  <ScrollView style={styles.newStyle}>
  {isLoading ? (
    <ActivityIndicator size="large" color="#007AFF" />
  ) : (
    events.map((event) => (
      <CalendarEvent
        id={event.id}
        summary={event.summary}
        start={event.start}
        end={event.end}
      />
    ))
  )}
</ScrollView>

</>
</View>
);
};

const styles = StyleSheet.create({
work:{
  fontSize: 24,
  alignSelf: "center",
  marginVertical: 8,
  marginBottom: 12,
},
container: {
flex: 1,
alignItems: 'flex-start',
justifyContent: 'flex-start',
backgroundColor: 'ebe8e8',
},
letter_day: {
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
letter_day_2: {
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
backgroundColor: '#fff',
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
day: {
fontSize: 15,
paddingVertical: 0,
marginHorizontal: 225,
marginBottom: 0,
marginTop: -30,
height: 100,
width: 250,
},
newStyle: {
  flex: 2,
  width: "100%"
  // marginTop: -200,
  //padding: "1.2%"
  
},
google1:{
  marginLeft:85,
  marginTop: -45,
  fontSize: 25,
  marginRight: 29,
},
googlebox:{
  backgroundColor: '#ffffff',
  borderRadius: 15,
  paddingHorizontal: 20,
  paddingRight: 20,
  marginHorizontal: 10,
  paddingBottom: 15,
  width: '95%',
  borderWidth: 2,
  borderColor: '#ebe8e8',
},
appButtonContainer2: {
elevation: 8,
backgroundColor: 'white',
borderRadius: 15,
paddingVertical: 13,
paddingHorizontal: 12,
marginHorizontal: 12,
marginBottom: 7,
marginTop: -1,
width: '93%',
borderWidth: 2,
borderColor: '#ebe8e8',
},
appButtonText2: {
fontSize: 18,
color: 'black',
alignSelf: 'center',
},
});

export default Home;