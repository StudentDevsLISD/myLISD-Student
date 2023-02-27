import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { color } from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    backgroundColor:'white'
  },
  arrow: {
    width: 30,
    height: 30,
  },
  newStyle: {
    flex: 2,
    backgroundColor: 'red',
    marginTop: 130,
    maxHeight: 400,
  },
});

const Portal = () => {
  const [startDate, setStartDate] = useState(moment());
  const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked?: boolean; selected?: boolean } }>({});

  const handlePrevWeek = () => {
    setStartDate(startDate.clone().subtract(7, 'days'));
  };

  const handleNextWeek = () => {
    setStartDate(startDate.clone().add(7, 'days'));
  };

  const handleDayPress = (day: any) => {
    const selectedDate = day.dateString;
    const newMarkedDates: { [date: string]: { marked?: boolean; selected?: boolean } } = {};
    newMarkedDates[selectedDate] = { selected: true };
    setMarkedDates(newMarkedDates);
    setStartDate(moment(selectedDate));
  };

  const endDate = moment(startDate).add(6, 'days');
  for (let i = 0; i < 7; i++) {
    const currentDate = moment(startDate).add(i, 'days');
    markedDates[currentDate.format('MM-DD-YYYY')] = { marked: false };
  }
  markedDates[startDate.format('MM-DD-YYYY')] = { selected: true };


  return (
    <>
      <View style={styles.container}>
        <CalendarStrip
          calendarAnimation={{ type: 'sequence', duration: 30 }}
          daySelectionAnimation={{
            type: 'background',
            duration: 200,
            highlightColor: '#e3e3e3',
          }}
          style={{ height: 85, paddingTop: 15,}}
          calendarHeaderStyle={{ color: 'black' }}
          calendarColor={'white'}
          dateNumberStyle={{ color: 'black' }}
          dateNameStyle={{ color: 'black' }}
          highlightDateNumberStyle={{ color: '#7743CE' }}
          highlightDateNameStyle={{ color: '#7743CE' }}
          startingDate={startDate.toDate()}
          selectedDate={startDate.toDate()}
          onDateSelected={handleDayPress}
          scrollable={true}
          useIsoWeekday={true}
        />
      </View>

      <ScrollView style={styles.newStyle}></ScrollView>
    </>
  );
};

export default Portal;