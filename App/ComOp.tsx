import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { GoogleSignin, User } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import { Calendar } from 'react-native-calendars';

type GoogleSigninUser = {
  idToken: string;
  accessToken?: string | null | undefined;
  refreshToken?: string | null | undefined;
  serverAuthCode?: string | null | undefined;
  scopes?: string[] | null | undefined;
  user: {
    id: string;
    email: string | null;
    emailVerified?: boolean;
    photoURL?: string;
    displayName?: string;
  } | null;
};
type Event = {
  id: string;
  summary: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  location: string;
  description: string;
};
interface GoogleSigninUserWithAccessToken extends GoogleSigninUser {
  accessToken: string;
}


GoogleSignin.configure({
  iosClientId: '809923761821-5lio914f08csk2hgkufapgh19l0418n0.apps.googleusercontent.com',
  webClientId: GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});

const ComOp = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [events, setEvents] = useState<Event[]>([]);
  const [uniqueEvents, setUniqueEvents] = useState<Event[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | undefined>();

  const fetchEvents = async (calendarId: string, date: string, accessToken: any) => {
    setIsLoading(true);
    const timeMin = new Date(date);
    timeMin.setDate(timeMin.getDate())
    timeMin.setHours(0, 0, 0, 0);

    const timeMax = new Date(date);
    timeMax.setDate(timeMax.getDate()+1);
    timeMax.setHours(23, 59, 59, 999);

    const response = await axios.get(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          minAccessRole: 'freeBusyReader',
        },
      },
    );

    const calendarList = response.data.items;
    const events = [];

    for (let i = 0; i < calendarList.length; i++) {
      const calendar = calendarList[i];
      if (calendar.id === 'primary') {
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
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      setAccessToken(tokens.accessToken);
      //return tokens.accessToken;
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };
  const handleSignIn = useCallback(async () => {
    try {
      await signIn();
      setIsSignedIn(true);
      const fetchedEvents = await fetchEvents('primary', currentDate, accessToken);
      setUniqueEvents(removeDuplicateEvents(fetchedEvents));
      setEvents(uniqueEvents);
      } catch (error) {
      console.error('Error signing in:', error);
      }
      }, [currentDate]);
      
      const removeDuplicateEvents = (eventsArray: any[]) => {
      const uniqueEvents = eventsArray.reduce((accumulator: any[], event: any) => {
      if (!accumulator.find((e: any) => e.id === event.id)) {
      accumulator.push(event);
      }
      return accumulator;
      }, []);
      return uniqueEvents;
      };
      
      useEffect(() => {
      const interval = setInterval(() => {
      setCurrentDate(new Date().toISOString().slice(0, 10));
      }, 60000);
      return () => clearInterval(interval);
      }, []);
      
      useEffect(() => {
      const fetchAndSetEvents = async () => {
      if (isSignedIn) {
      // const accessToken = await signIn();
      const fetchedEvents = await fetchEvents('primary', selectedDate, accessToken);
      const uniqueEvents = removeDuplicateEvents(fetchedEvents);
      setEvents(uniqueEvents);
      setIsLoading(false);
      }
      };
      fetchAndSetEvents();
      }, [selectedDate, isSignedIn]);
      
      const handleDayPress = (day: any) => {
      setSelectedDate(day.dateString);
      };
      
      return (
      <View style={styles.container}>
      {!isSignedIn && (
      <TouchableOpacity onPress={handleSignIn} style={styles.googlebox}>
      <Image source={require('../assets/google.png')} style={styles.googleImage} />
      <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>
      )}
      {isSignedIn && (
      <>
        <Calendar /* paddingTop = {80} */ onDayPress={handleDayPress} markedDates={{ [selectedDate]: { selected: true } }} />
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView>
            {/* //...events list or "No events found" message */}
            {events.map((event: { id: React.Key | null | undefined; summary: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
            <Text key={event.id}>{event.summary}</Text>
            ))}
          </ScrollView>
        )}
      </>
    )}
      </View>
      );
      };
      
      const styles = StyleSheet.create({
      container: {
      flex: 1,
      paddingTop: 20,
      },
      eventContainer: {
      backgroundColor: '#F2F2F2',
      margin: 10,
      padding: 10,
      borderRadius: 5,
      },
      eventText: {
      fontSize: 16,
      },
      googlebox: {
      backgroundColor: '#ffffff',
      borderRadius: 15,
      paddingHorizontal: 20,
      paddingRight: 20,
      marginHorizontal: 10,
      paddingBottom: 15,
      width: '95%',
      borderWidth: 2,
      borderColor: '#ebe8e8',
      flexDirection: 'row',
      alignItems: 'center',
      },
      googleImage: {
      width: 60,
      height: 60,
      marginLeft: 20,
      },
      googleText: {
      marginLeft: 20,
      fontSize: 25,
      marginRight: 29,
      },
      noEventsText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 18,
      },
      });
      
      export default ComOp;