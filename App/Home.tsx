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
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LISD_CLIENT_AUTH_UN, LISD_CLIENT_AUTH_PWD, LISD_API_KEY } from '@env';

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
  const [Lday, setLday] = useState('-');
  const [events, setEvents] = useState<{ id: string, summary: string ,start: string, end: string}[]>([]);
  const { isSignedIn, setIsSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [noWork, setNoWork] = useState(false); // State to track if there is no work
    
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
      setIsLoading(true);
      const fetchedEvents = await fetchEvents(calendarId, currentDate, accessToken);
      const uniqueEvents = removeDuplicateEvents(fetchedEvents);
      setEvents(uniqueEvents);
  
      // Check if there are no events and update noWork state accordingly
      setNoWork(uniqueEvents.length === 0);
  
      await AsyncStorage.setItem('accessToken', accessToken);
      setIsLoading(false);
    }
  }, [currentDate]);
  
  

  const getDate = async () => {
    try {
      const campus = await AsyncStorage.getItem('campus');
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
          clientAuthUN: LISD_CLIENT_AUTH_UN,
          clientAuthPwd: LISD_CLIENT_AUTH_PWD,
        },
        params: {
          APIKey: LISD_API_KEY,
        },
      });
      setLday(response.data.day || '-'); // Set "-" if response.data.day is falsy
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
          clientAuthUN: LISD_CLIENT_AUTH_UN,
          clientAuthPwd: LISD_CLIENT_AUTH_PWD,
        },
        params: {
          APIKey: LISD_API_KEY,
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
      <Text style={styles.work}>
        Today's Work
      </Text>
      <>
        {isSignedIn ? ( // Check if the user is signed in
          <ScrollView style={styles.newStyle}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : events.length === 0 ? (
              <Text style={styles.noWorkText}>No More Work</Text>
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
        ) : (
          <TouchableOpacity onPress={handleSignIn} style={styles.googlebox}>
            <Image source={require('../assets/google.png')} style={{ width: 60, height: 60, marginLeft: 20 }} />
            <Text style={styles.google1}>Sign in with Google</Text>
          </TouchableOpacity>
        )}
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
paddingVertical: 0,
paddingHorizontal: 44,
marginHorizontal: 20,
marginBottom: 7,
marginTop: 16,
fontSize: RFPercentage(10),
borderWidth: 2,
borderColor: '#ebe8e8',
borderRadius: 15,
paddingBottom: 14,
paddingTop: -20,
overflow: 'hidden',
fontWeight: 'normal',

},
letter_day_2: {
fontSize: 16,
paddingVertical: 0,
paddingRight: 35,

paddingHorizontal: 25,
marginHorizontal: 45,
marginBottom: 0,
marginTop: -37,
height: 100,
width: 250,
fontWeight: 'normal',

},
date: {
  backgroundColor: '#fff',
  marginLeft: 158,
  marginTop: -182,
  fontSize: RFPercentage(8), // Adjust the value (5) to your preference
  borderWidth: 2,
  borderColor: '#ebe8e8',
  borderRadius: 15,
  paddingBottom: 34,
  paddingTop: 2,
  paddingHorizontal: 28,
  overflow: 'hidden',
  fontWeight: 'normal',
},
day: {
  fontSize: 15, // Adjust the value (2) to your preference
  paddingVertical: 0,
  marginHorizontal: 237,
  marginBottom: 0,
  marginTop: -30,
  height: 100,
  width: 250,
  fontWeight: "normal",
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
  fontWeight: 'normal',

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
  fontWeight: 'normal',

},
noWorkText: {
  fontSize: 18,
  fontWeight: 'normal',
  alignSelf: 'center',
  marginVertical: 8,
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
fontWeight: 'bold',

},
appButtonText2: {
fontSize: 18,
color: 'black',
alignSelf: 'center',
fontWeight: 'normal',

},
});

export default Home;