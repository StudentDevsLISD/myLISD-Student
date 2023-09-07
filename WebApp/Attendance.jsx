import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import axios from 'axios';
import {IP_ADDRESS} from '@env';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import alert from './alert.js'
import { storeData, retrieveData, removeItem } from './storage.js';
import Icon from 'react-native-vector-icons/FontAwesome';

LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};
LocaleConfig.defaultLocale = 'en';

const Attendance = () => {
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Mock data
  // const attendanceData: MarkedDates = {
  //   '2023-06-10': { customStyles: { container: { backgroundColor: 'green', borderRadius: 12 }, text: { color: '#ffffff' } } },
  //   '2023-06-12': { customStyles: { container: { backgroundColor: 'red', borderRadius: 12 }, text: { color: '#ffffff' } } },
  //   '2023-06-14': { customStyles: { container: { backgroundColor: 'orange', borderRadius: 12 }, text: { color: '#ffffff' } } },
  //   '2023-06-16': { customStyles: { container: { backgroundColor: 'blue', borderRadius: 12 }, text: { color: '#ffffff' } } },
  //   // Add more dates here with their respective custom styles
  // };

  const [attendanceData, setAttendanceData] = useState({});
  const [attendanceCodes, setAttendanceCodes] = useState({
    "Absence-Excused": {
      label: "Absence-Excused",
      color: "#ff0000"
    },
    "Absent from Sub-Campus": {
      label: "Absent from Sub-Campus",
      color: "#ff0000"
    },
    "Absent w/Doctor Notice": {
      label: "Absent w/Doctor Notice",
      color: "#ff0000"
    },
    "Co-Curricular School Rel Absence (Non UIL)": {
      label: "Co-Curricular School Rel Absence (Non UIL)",
      color: "#0033ff"
    },
    "College Visit (11th or 12th Grade)": {
      label: "College Visit (11th or 12th Grade)",
      color: "#00cc00"
    },
    "District Approved Absence": {
      label: "District Approved Absence",
      color: "#000000"
    },
    "Driver’s License/Permit": {
      label: "Driver’s License/Permit",
      color: "#00cc00"
    },
    "Extra-Curricular School Related Absence": {
      label: "Extra-Curricular School Related Absence",
      color: "#0033ff"
    },
    "Funeral/Memorial": {
      label: "Funeral/Memorial",
      color: "#ff0000"
    },
    "Homebound": {
      label: "Homebound",
      color: "#0033ff"
    },
    "Homebound Non-Serviced Day": {
      label: "Homebound Non-Serviced Day",
      color: "#ff0000"
    },
    "Homebound w/CEHI": {
      label: "Homebound w/CEHI",
      color: "#0033ff"
    },
    "Homebound?CEHI": {
      label: "Homebound?CEHI",
      color: "#0033ff"
    },
    "ISS Placement": {
      label: "ISS Placement",
      color: "#0033ff"
    },
    "Late Excused Absence": {
      label: "Late Excused Absence",
      color: "#ff0000"
    },
    "Late to Class but Present": {
      label: "Late to Class but Present",
      color: "#00cc00"
    },
    "Late Unexcused Absence": {
      label: "Late Unexcused Absence",
      color: "#ff0000"
    },
    "Leave Early": {
      label: "Leave Early",
      color: "#FFCC99"
    },
    "LEO": {
      label: "LEO",
      color: "#000000"
    },
    "Life Threatening Illness/Treatment": {
      label: "Life Threatening Illness/Treatment",
      color: "#00cc00"
    },
    "Medical Appointment-Doctor Note": {
      label: "Medical Appointment-Doctor Note",
      color: "#00cc00"
    },
    "Military Deployment": {
      label: "Military Deployment",
      color: "#00cc00"
    },
    "Military Recruitment Visit": {
      label: "Military Recruitment Visit",
      color: "#00cc00"
    },
    "Nurse Sent Home": {
      label: "Nurse Sent Home",
      color: "#ff0000"
    },
    "Other Instruction On/Off Campus": {
      label: "Other Instruction On/Off Campus",
      color: "#0033ff"
    },
    "Present": {
      label: "Present",
      color: "#00cc00"
    },
    "Prevention Measures": {
      label: "Prevention Measures",
      color: "#6600cc"
    },
    "State Approved Non Absence": {
      label: "State Approved Non Absence",
      color: "#00cc00"
    },
    "Suspended": {
      label: "Suspended",
      color: "#ff0000"
    },
    "Technical Connectivity Issue": {
      label: "Technical Connectivity Issue",
      color: "#ff0000"
    },
    "Testing": {
      label: "Testing",
      color: "#0033ff"
    },
    "Unexcused": {
      label: "Unexcused",
      color: "#ff0000"
    },
    "Unverified-Unexcused": {
      label: "Unverified-Unexcused",
      color: "#ff0000"
    },
    "Virtual Schedule Present": {
      label: "Virtual Schedule Present",
      color: "#00cc00"
    },
    "Voting Clerk/Election": {
      label: "Voting Clerk/Election",
      color: "#00cc00"
    },
    "Multiple Attendance Codes": {
      label: "Multiple Attendance Codes",
      color: "#FFCC99"
    },
  }); // initialize as empty object
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarKey, setCalendarKey] = useState(Date.now().toString()); // Add this state for the key prop
  const [currentMonth, setCurrentMonth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prevMonth, setPrevMonth] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFetchedDataUpdating, setIsFetchedDataUpdating] = useState(false);

  
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    alert(attendanceData[day.dateString]?.title || 'No information for this date');
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const isLogged = await retrieveData('isLoggedIn')
      setIsLoggedIn(isLogged == "true" ? true : false)
      if (isLogged == "true" ? true : false) {
        setIsLoading(true);
        await fetchDates("current");
      } else {
      setIsLoading(false);
      await storeData('isLoggedIn', 'false')
      setIsLoggedIn(false)
      }
    } catch (error) {
      console.error('Error loading data', error);
      setIsLoading(false);
      await storeData('isLoggedIn', 'false')
      setIsLoggedIn(false)
    }
  };

    const fetchDates = async (month) => {
      let response ='';
      try {
      setIsLoading(true);
      console.log("x")
      response = await axios.get('http://' + IP_ADDRESS + ':8082/attendance?month=' + month, {
          withCredentials: true
        })
      console.log(response)
      setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsLoggedIn(false);
        alert("Error logging in")
      }      
      if (response.data) {
        const currentMonthData = formatData(response.data.data, response.data.monthNow);
        setAttendanceData(currentMonthData);
        const currentMonthString = formatMonth(response.data.monthNow);
        if (currentMonthString !== currentMonth) {
          setIsFetchedDataUpdating(true);  // Set the flag
          setCurrentMonth(currentMonthString);
        }
            
        setMinDate(currentMonthString);
        setMaxDate(currentMonthString.substring(0, currentMonthString.lastIndexOf("-")+1) + "31");
      }
    };

  
  

  const formatData = (data, monthNow) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthNumber = monthNames.indexOf(monthNow.split(" ")[0]) + 1;
    const monthString = monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
    const year = monthNow.split(" ")[1];
    const newData = {};
    data.forEach(item => {
      const dateString = `${year}-${monthString}-${item.day.length == 1 ? "0" + item.day : item.day}`;
      const attendance = item.attendance;
      const BGcolor = item.color;
      let realBGcolor;
      if(BGcolor.indexOf("#")!=-1){
        realBGcolor = BGcolor.substring(BGcolor.indexOf("#"), BGcolor.indexOf("#") + 7);
      } else {
        realBGcolor = "";
      }
      if(attendance !== ""){
        newData[dateString] = {
          title: attendance,
          customStyles: {
            container: {
              backgroundColor:  realBGcolor != "#CCCCCC" ? realBGcolor : "transparent",
              borderRadius: 12
            },
            text: {
              color: theme == "dark" ? "#ffffff" : realBGcolor != "#ffffff" ? "#ffffff" : "#000000"
            }
          }
        };
      }
    });
    return newData;
  };
  
  
  const formatMonth = (monthNow) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthNumber = monthNames.indexOf(monthNow.split(" ")[0]) + 1;
    const monthString = monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
    const year = monthNow.split(" ")[1];
    return `${year}-${monthString}-01`;
  }

  const renderDay = (day, item) => {
    if (item && item.customStyles) {
      const { backgroundColor, color } = item.customStyles.container;
      return (
        <View style={styles.AttendanceDayContainer}>
          <View style={[styles.AttendanceEmptyBox, { backgroundColor }]} />
          <Text style={[styles.AttendanceDayText, { color }]}>{day.day}</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.AttendanceDayContainer}>
        <Text style={styles.AttendanceDayText}>{day.day}</Text>
      </View>
    );
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
            arrowColor: '#000',
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
  if (isLoading) {
    return (
      <View style={styles.AttendanceLoadingContainer}>
        <ActivityIndicator
          animating={true}
          size={'large'}
          color={theme === 'light' ? '#005a87' : '#ede1d1'}
        />
      </View>
    );
  }
  const handleMonthChange = (month) => {
    if (isFetchedDataUpdating) {
      setIsFetchedDataUpdating(false);  // Reset the flag
      return;  // Return early to avoid further processing
    }
    const dateParts = month.dateString.split('-');
    const monthNumber = parseInt(dateParts[1]);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[monthNumber - 1].toLowerCase();
  
    fetchDates(monthName);
  
    //setCurrentMonth(month.dateString);
  };
  return (
    <View style={styles.AttendanceContainer}>
      {!isLoggedIn ? (
        <TouchableOpacity 
          style={styles.GradesLoginButton} 
          onPress={() => loadCredentials()}
        >
          <Text style={styles.GradesLoginButtonText}>Login with HAC</Text>
        </TouchableOpacity>
      ):(
      
      <ScrollView>
      <View style={styles.AttendanceCalendarContainer}>
        <Calendar
          key={calendarKey}
          markingType='custom'
          onDayPress={onDayPress}
          onMonthChange={handleMonthChange}
          markedDates={attendanceData}
          theme={theme == 'light' ? lightTheme : darkTheme}
          renderDay={renderDay}
          enableSwipeMonths={true}
          initialDate = {currentMonth}
          minDate={minDate}
          maxDate = {maxDate}
        />
      </View>
      <View style={styles.AttendanceLegendContainer}>
        <View style={styles.AttendanceLegendBox}>
          <Text style={styles.AttendanceLegendTitle}>Color Legend</Text>
          {Object.entries(attendanceCodes).map(([code, data]) => (
            <View key={code} style={styles.AttendanceLegendItem}>
              <View style={[styles.AttendanceLegendColorBox, { backgroundColor: data.color }]} />
              <Text style={styles.AttendanceLegendText}>{data.label}</Text>
            </View>
          ))}
        </View>
      </View>
      </ScrollView>
      )}
    </View>
  );
};
export default Attendance;
