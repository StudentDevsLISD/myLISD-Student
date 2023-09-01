import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Touchable, Linking } from 'react-native';
import PeriodTimer from './PeriodTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import CalendarEvent from './CalendarEvent';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LISD_CLIENT_AUTH_UN, LISD_CLIENT_AUTH_PWD, LISD_API_KEY } from '@env';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import { storeData, retrieveData, removeItem } from './storage.js';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationProp, CommonActions } from '@react-navigation/native';

const mainurl = 'https://api.leanderisd.org/portal';
const ABurl = mainurl + '/getAB';
const getsched = mainurl + '/getScheduledMeeting';


const options = [
  { id: '1', title: 'News', description: 'Popular Stories', iconName: 'newspaper-o', route: 'NewsScreen' },
  { id: '2', title: 'Quick Links', description: 'Important shortcuts', iconName: 'link', route: 'QuickLinksScreen.tsx' },
  { id: '3', title: 'Bus Tracking', description: 'Track your journey', iconName: 'bus', route: 'News'},
  { id: '4', title: 'Contact Teachers', description: 'Keep in touch', iconName: 'users', route: 'ContactTeachers' },
  { id: '5', title: 'LISD Homepage', description: 'Leander ISD Homepage', iconName: 'laptop', route: 'VirtualAssistant' },
  { id: '6', title: 'Mental Health', description: 'Mental Health Resources', iconName: 'heart', route: 'MentalHealth' },
  { id: '7', title: 'LISD Support Page', description: 'Leander ISD Support', iconName: 'comments', route: 'SupportPage' },
  { id: '8', title: 'Contact Us', description: 'We are here to help', iconName: 'phone', route: 'News'},
  { id: '9', title: 'Feedback', description: 'We value your opinion', iconName: 'thumbs-up', route: 'GoogleFeedback'},
];


// GoogleSignin.configure({
//   iosClientId: '809923761821-5lio914f08csk2hgkufapgh19l0418n0.apps.googleusercontent.com',
//   webClientId: GOOGLE_WEB_CLIENT_ID,
//   offlineAccess: true,
//   scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
// });

const Home = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduled, setScheduled] = useState();
  const [Lday, setLday] = useState('-');
  const [events, setEvents] = useState([]);
  // const { isSignedIn, setIsSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [noWork, setNoWork] = useState(false); // State to track if there is no work

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;
    
  const dateArray = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // const signIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     await GoogleSignin.signIn();
  //     const tokens = await GoogleSignin.getTokens();
  //     await AsyncStorage.setItem('asyncAccessToken', tokens.accessToken);
  //     return tokens.accessToken;
  //   } catch (error) {
  //     console.error('Error signing in:', error);
  //   }
  // };

  // const removeDuplicateEvents = (eventsArray) => {
  //   const uniqueEvents = eventsArray.reduce((accumulator, event) => {
  //     if (!accumulator.find((e) => e.id === event.id)) {
  //       accumulator.push(event);
  //     }
  //     return accumulator;
  //   }, []);
  //   return uniqueEvents;
  // };


  // const fetchEvents = async (date, accessToken) => {
  //   setIsLoading(true);
  //   const timeMin = new Date(date);
  //   timeMin.setHours(0, 0, 0, 0);
  
  //   const timeMax = new Date(timeMin);
  //   timeMax.setDate(timeMax.getDate());
  //   timeMax.setHours(23, 59, 59, 999);
    
  //   const response = await axios.get(
  //     'https://www.googleapis.com/calendar/v3/users/me/calendarList',
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       params: {
  //         minAccessRole: 'freeBusyReader', // fetch all calendars the user can see free/busy information for
  //       },
  //     },
  //   );
  
  //   const calendarList = response.data.items;
  //   const events = [];
  
  //   for (let i = 0; i < calendarList.length; i++) {
  //     const calendar = calendarList[i];
  //     if (calendar.id === 'primary') {
  //       // skip the primary calendar since we are already fetching events from it
  //       continue;
  //     }
  
  //     const calendarEvents = await axios.get(
  //       `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //         params: {
  //           timeMin: timeMin.toISOString(),
  //           timeMax: timeMax.toISOString(),
  //           singleEvents: true,
  //           orderBy: 'startTime',
  //         },
  //       },
  //     );
  
  //     events.push(...calendarEvents.data.items);
  //   }
  
  //   // fetch events from the primary calendar
  //   const primaryEvents = await axios.get(
  //     `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent('primary')}/events`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       params: {
  //         timeMin: timeMin.toISOString(),
  //         timeMax: timeMax.toISOString(),
  //         singleEvents: true,
  //         orderBy: 'startTime',
  //       },
  //     },
  //   );
  
  //   events.push(...primaryEvents.data.items);
  
  //   const formattedEvents = events.map((event) => ({
  //     id: event.id,
  //     summary: event.summary,
  //     start: event.start.dateTime || event.start.date,
  //     end: event.end.dateTime || event.end.date,
  //   }));
  
  //   const sortedEvents = formattedEvents.sort((a, b) => {
  //     const aStart = new Date(a.start);
  //     const bStart = new Date(b.start);
  //     return aStart.getTime() - bStart.getTime();
  //   });
  //   setIsLoading(false);
  //   return sortedEvents;
    
  // };
  
  

  // const handleSignIn = useCallback(async () => {
  //   const accessToken = await signIn();
  //   if (accessToken) {
  //     setIsSignedIn(true);
  //     const calendarId = 'primary';
  //     setIsLoading(true);
  //     const fetchedEvents = await fetchEvents(calendarId, currentDate, accessToken);
  //     const uniqueEvents = removeDuplicateEvents(fetchedEvents);
  //     setEvents(uniqueEvents);
  
  //     // Check if there are no events and update noWork state accordingly
  //     setNoWork(uniqueEvents.length === 0);
  
  //     await AsyncStorage.setItem('accessToken', accessToken);
  //     setIsLoading(false);
  //   }
  // }, [currentDate]);
  
  

  const getDate = async () => {
    try {
      const campus = await retrieveData('campus');
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
  
  const navigation = useNavigation();

  const handleOptionPress = (option) => {
    if (option.webLink) {
      Linking.openURL(option.webLink);
    } else if(option.title == "News"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "NewsScreen",
        }
        )
        
      );
      
    } 
    else if(option.title == "Quick Links"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "QuickLinks",
        }
        )
        
      );
      
    } 
    else if(option.title == "Contact Teachers"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "ContactTeachers",
        }
        )
        
      );
      
    } 
    else if(option.title == "Bus Tracking"){
      Linking.openURL("https://parent.smart-tag.net/%40leanderisd");
      
    } 
    else if(option.title == "Virtual Assistant"){
      Linking.openURL("https://www.leanderisd.org")
      
    } 
    else if(option.title == "LISD Support Page"){
      Linking.openURL("https://www.leanderisd.org/support/")
      
    } 
    else if(option.title == "LISD Homepage"){
      Linking.openURL("https://www.leanderisd.org")

    }
    else if(option.title == "Feedback"){
      Linking.openURL("https://forms.gle/5sm5X6vhA9zLLFFC6")
      
    } 
    else if(option.title == "Contact Us"){
      Linking.openURL("https://www.k12insight.com/Lets-Talk/LetsTalkTabCustom.aspx?k=WKXY9FLT&rnd=1686678916022")
      
    } 
  };

  const getScheduled = async () => {
    try {
      const idNum = await retrieveData('studentID');
      const campus = await retrieveData("campus");
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
    <ScrollView>
    <View style={styles.HomeContainer}>
      <View style={{flexDirection: 'row',justifyContent: 'center',}}>
      <TouchableOpacity style={styles.HomeLetterContainer} disabled={true}>
        <View style={styles.HomeLetterView}>
          <Text style={styles.HomeLetter_day}>{'B'/*{Lday}*/}</Text>
          <Text style={styles.HomeLetter_day_2}>{'day'}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.HomeLetterContainer}disabled={true}>
        <View style={styles.HomeLetterView}>
        <Text style={styles.HomeLetter_day}>
        {currentDate.toISOString().substring(5, 7) +
          '/' +
          currentDate.toISOString().substring(8, 10)}
      </Text>
      <Text style={styles.HomeLetter_day_2}>{dateArray[currentDate.getDay()]}</Text>
      </View>
      </TouchableOpacity>
      </View>
      {/* <Text style={styles.HomeLetter_day}>{Lday}</Text>
      <Text style={styles.HomeLetter_day_2}>{'day'}</Text> */}
      {/* <Text style={styles.HomeDate}>
        {currentDate.toISOString().substring(5, 7) +
          '/' +
          currentDate.toISOString().substring(8, 10)}
      </Text>
      <Text style={styles.HomeDay}>{dateArray[currentDate.getDay()]}</Text> */}
      <PeriodTimer/>
      <View style={styles.HomeParentView5}>
        {options.map((option) => (
        <TouchableOpacity style={styles.HomeOptions5} key={option.id} onPress={() => handleOptionPress(option)}>
          <View style={styles.HomeBox5}>
            <ListItem containerStyle={theme === 'light' ? {backgroundColor: "white"} : {backgroundColor: "#333"}}>
              <Icon name={option.iconName} style={styles.HomeScreenIcon5} />
              <ListItem.Content>
                <ListItem.Title style={styles.HomeTitleText5}>{option.title} </ListItem.Title>
                <ListItem.Subtitle style={styles.HomeDescriptionText5}>{option.description}</ListItem.Subtitle>
              </ListItem.Content>
              <Icon name="chevron-right" size={20} style={styles.HomeChevronIcon} />
            </ListItem>
          </View>
        </TouchableOpacity>
      ))}</View>
    </View>
    </ScrollView>
  );
  
  
};

export default Home;