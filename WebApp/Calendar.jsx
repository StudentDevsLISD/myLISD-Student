import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, } from 'react-native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import { GoogleSignin, User } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import { Calendar } from 'react-native-calendars';
import CalendarEvent from './CalendarEvent';
import { ActivityIndicator } from 'react-native-paper';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import Icon from 'react-native-vector-icons/FontAwesome';




// GoogleSignin.configure({
//   iosClientId: '809923761821-5lio914f08csk2hgkufapgh19l0418n0.apps.googleusercontent.com',
//   webClientId: GOOGLE_WEB_CLIENT_ID,
//   offlineAccess: true,
//   scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
// });

const ComOp = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [events, setEvents] = useState([]);
  const [uniqueEvents, setUniqueEvents] = useState([]);
  
  const calendarId = 'leanderisd.org_3grot6ac0ug4prua1smkvfsmu8@group.calendar.google.com';
  const apiKey = 'AIzaSyCOo9kMxZpioPalyxTzZ6aVkxDgyzBf-XE';  // replace with your public API key
  const [calendarKey, setCalendarKey] = useState(Date.now().toString()); // Add this state for the key prop

  const removeDuplicateEvents = (eventsArray) => {
    const uniqueEvents = eventsArray.reduce((accumulator, event) => {
      if (!accumulator.find((e) => e.id === event.id)) {
        accumulator.push(event);
      }
      return accumulator;
    }, []);
    return uniqueEvents;
  };


  const fetchEvents = async (calendarId, date) => {
    setIsLoading(true);
    const timeMin = new Date(date);
    timeMin.setDate(timeMin.getDate())
    timeMin.setHours(0, 0, 0, 0);

    const timeMax = new Date(date);
    timeMax.setDate(timeMax.getDate() + 1);
    timeMax.setHours(23, 59, 59, 999);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}`,
        {
          params: {
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
          },
        },
      );

      const events = response.data.items;
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAndSetEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents(calendarId, selectedDate);
        const uniqueEvents = removeDuplicateEvents(fetchedEvents);
        setEvents(uniqueEvents);
        console.log(uniqueEvents)
      } catch (error) {
        console.error('Error fetching and setting events:', error);
      }
    };
    fetchAndSetEvents();
  }, [selectedDate]);


  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };


  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    // Update the key whenever the theme changes
    setCalendarKey(Date.now().toString());
  }, [theme]);
  const styles = theme == 'light' ? lightStyles : darkStyles;
  const lightTheme = {
    backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#000000',
            selectedDayBackgroundColor: '#e8e8e8',
            selectedDayTextColor: '#000000',
            todayTextColor: '#000000',
            dayTextColor: '#000000',
            textDisabledColor: '#cccccc',
            dotColor: 'transparent',
            selectedDotColor: 'rgba(0, 0, 0, 0)',
            arrowColor: 'black',
            monthTextColor: '#000000',
            indicatorColor: '#000000',
            textDayFontFamily: 'Avenir',
            textMonthFontFamily: 'Avenir',
            textDayHeaderFontFamily: 'Avenir',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 13,
            textDayFontWeight: 'bold',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: 'bold',
  }
  const darkTheme = {
    backgroundColor: '#222',
    calendarBackground: '#222',
    textSectionTitleColor: '#ffffff',
    selectedDayBackgroundColor: '#e8e8e8',
    selectedDayTextColor: '#000000',
    todayTextColor: '#1da4f2',
    dayTextColor: '#fff',
    textDisabledColor: '#444',
    dotColor: '#0089d9',
    selectedDotColor: '#0089d9',
    arrowColor: 'white',
    monthTextColor: '#ffffff',
    indicatorColor: '#ffffff',
    textDayFontFamily: 'Avenir',
    textMonthFontFamily: 'Avenir',
    textDayHeaderFontFamily: 'Avenir',
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 13,
    textDayFontWeight: 'bold',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: 'bold',
  };
  return (
    <View style={styles.AttendanceContainer}>
      <View style={styles.CalendarCalendarContainer}>
        <Calendar
          key={calendarKey}
          markingType='custom'
          onDayPress={handleDayPress}
          markedDates={{ [selectedDate]: { selected: true }}}
          theme={theme == 'light' ? lightTheme : darkTheme}
          renderDay={handleDayPress}
          enableSwipeMonths={true}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator marginTop={50} animating={true} size={'large'} color={theme == 'light' ? '#005a87' : '#ede1d1'} />
      ) : (
        <ScrollView>
          {events.length > 0 ? (
            events.map((event) => (
              <CalendarEvent key={event.id} id={event.id} summary={event.summary} start={event.start} end={event.end} />
            ))
          ) : (
            <Text style={styles.CalendarNoEventsText2}>No Events Today</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

export default ComOp;