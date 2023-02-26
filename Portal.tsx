import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 100,
  },
  arrow: {
    width: 30,
    height: 30,
  },
  newStyle: {
    //alignItems: 'center',
    //justifyContent: 'center',
    flex: 2,
    backgroundColor: "red",
    marginTop: 130,
    maxHeight: 400,
    
  },

});

const Portal = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked?: boolean, selected?: boolean } }>({});

  const handlePrevWeek = () => {
    setStartDate(new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const handleNextWeek = () => {
    setStartDate(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const handleDayPress = (day: any) => {
    const selectedDate = day.dateString;
    const newMarkedDates: { [date: string]: {} } = {};
    newMarkedDates[selectedDate] = { selected: true };
    setMarkedDates(newMarkedDates);
    setStartDate(new Date(selectedDate));
  };

  const endDate = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    markedDates[currentDate.toISOString().slice(0, 10)] = { marked: false };
  }
  markedDates[startDate.toISOString().slice(0, 10)] = { selected: true };
  endDate.setDate(endDate.getDate() + 6);

  return (
    <>
      <View style={styles.container}>
        <FontAwesome style={styles.arrow} name="chevron-left" size={30} onPress={handlePrevWeek} />
        <Calendar
          minDate={startDate.toISOString().slice(0, 10)}
          maxDate={endDate.toISOString().slice(0, 10)}
          markedDates={markedDates}
          initialDate={startDate.toISOString().slice(0, 10)}
          onDayPress={handleDayPress}
        />
        <FontAwesome style={styles.arrow} name="chevron-right" size={30} onPress={handleNextWeek} />
      </View>
      
      <ScrollView style = {styles.newStyle}>
         
      </ScrollView>
      
    </>
  );
};

export default Portal;
