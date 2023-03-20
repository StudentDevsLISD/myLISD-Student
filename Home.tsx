import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PeriodTimer from './PeriodTimer';

const Home = () => {
  return (
    <>
    <Text style={styles.letter_day}>{'A'}
    </Text><Text style={styles.letter_day_2}>{'day'}
    </Text><Text style={styles.date}>{'03/15'}</Text>
    <Text style={styles.day}>{'Wednesday'}</Text>
    <PeriodTimer
        periodSchedule={[
            { start: new Date('2023-03-15T08:00:00'), duration: 60 },
            { start: new Date('2023-03-15T09:00:00'), duration: 90 },
            { start: new Date('2023-03-15T10:30:00'), duration: 45 },
            { start: new Date('2023-03-15T11:30:00'), duration: 60 },
        ]} />
    </>
  );
};

const styles = StyleSheet.create({
    letter_day:{
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
      paddingTop: 0,
      overflow: 'hidden',
    },
    letter_day_2:{
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
      backgroundColor: "#fff",
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
    day:{
      fontSize: 15,
      paddingVertical: 0,
      marginHorizontal: 225,
      marginBottom: 0,
      marginTop: -30,
      height: 100,
      width: 250,
    },  
  });

export default Home;