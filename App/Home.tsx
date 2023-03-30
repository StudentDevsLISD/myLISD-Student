import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PeriodTimer from './PeriodTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

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
  const [events, setEvents] = useState<{ id: string, summary: string }[]>([]);
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
      return tokens.accessToken;
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };


const fetchEvents = async (calendarId: string | number | boolean, date: string | number | Date, accessToken: any) => {
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

  return events;
};

  const handleSignIn = useCallback(async () => {
    const accessToken = await signIn();
    const calendarId = 'primary';
    const fetchedEvents = await fetchEvents(calendarId, currentDate, accessToken);
    setEvents(fetchedEvents);
  }, [currentDate]);

  const getDate = async () => {
    try {
      const data = {
        campus: '003',
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
      const data = {
        campus: '003',
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
  <TouchableOpacity onPress={handleSignIn}>
        <Text>Sign in with Google</Text>
      </TouchableOpacity>
      {events.map((event: { id: React.Key | null | undefined; summary: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
        <Text key={event.id}>{event.summary}</Text>
      ))}
</View>
);
};

const styles = StyleSheet.create({
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
appButtonContainer2: {
elevation: 8,
backgroundColor: 'white',
borderRadius: 10,
paddingVertical: 13,
paddingHorizontal: 12,
marginHorizontal: 12,
marginBottom: 7,
marginTop: 16,
width: '93%',
},
appButtonText2: {
fontSize: 18,
color: 'black',
alignSelf: 'center',
},
});

export default Home;