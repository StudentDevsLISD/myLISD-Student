import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ProgressBarAndroid} from 'react-native';
import * as Progress from 'react-native-progress';

const PeriodTimer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  interface Period {
    name: string;
    startTime: string;
    endTime: string;
  }
    
  const periods: Period[] = [
    { name: 'School Starting in', startTime: '00:00', endTime: '08:15' },
    { name: '1st Period ends in', startTime: '08:15', endTime: '09:45' },
    { name: 'Passing Period ends in', startTime: '09:45', endTime: '09:50' },
    { name: '2nd Period ends in', startTime: '09:50', endTime: '11:20' },
    { name: 'Ranger Time ends in', startTime: '11:20', endTime: '11:55' },
    { name: 'Passing Period ends in', startTime: '11:55', endTime: '12:00' },
    { name: '3rd Period ends in', startTime: '12:00', endTime: '14:00' },
    { name: 'Passing Period ends in', startTime: '14:00', endTime: '14:05' },
    { name: '4th Period ends in', startTime: '14:05', endTime: '15:35' },
    { name: 'Next Day in', startTime: '15:35', endTime: '23:59' },
  ];

  const getRemainingTime = (period: Period) => {
    const now = currentTime.getTime();
    const [hours, minutes] = period.endTime.split(':').map((time) => parseInt(time));
    const end = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), hours, minutes).getTime();
    const remaining = end - now;
    if (remaining < 0) return '00 hrs 00 mins';
    const remainingHours = Math.floor(remaining / 3600000);
    const remainingMinutes = Math.floor((remaining % 3600000) / 60000);
    return `${remainingHours} hrs ${remainingMinutes} mins`;
  };

  const getProgress = (period: Period) => {
    if (!currentPeriod) {
      return 0; // return default value of 0 when currentPeriod is undefined
    }
    const now = currentTime.getTime();
    const [startHours, startMinutes] = period.startTime.split(':').map((time) => parseInt(time));
    const [endHours, endMinutes] = period.endTime.split(':').map((time) => parseInt(time));
    const start = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), startHours, startMinutes).getTime();
    const end = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), endHours, endMinutes).getTime();
    const elapsed = now - start;
    const duration = end - start;
    return elapsed / duration;
  };

  const currentPeriod = periods.find((period) => {
    const [startHours, startMinutes] = period.startTime.split(':').map((time) => parseInt(time));
    const [endHours, endMinutes] = period.endTime.split(':').map((time) => parseInt(time));
    const start = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), startHours, startMinutes).getTime();
    const end = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), endHours, endMinutes).getTime();
    return currentTime.getTime() >= start && currentTime.getTime() < end;
  }) || { name: '', startTime: '', endTime: '' };

  const currentPeriodName = currentPeriod.name || 'No Period';
  const remainingTime = currentPeriodName === 'No Period' ? 'No School Right Now' : getRemainingTime(currentPeriod);
  return (
    <View style={styles.container}>
      <Text style={styles.period}>{currentPeriodName}</Text>
      <Text style={styles.timer}>{remainingTime}</Text>
      <View style={styles.progressBarContainer}>
        {/* <Progress.Bar
          // indeterminate={false}
          progress={getProgress(currentPeriod)}
          // color="#0066cc"
          //style={styles.progressBar}
        /> */}
        <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={getProgress(currentPeriod)} color="#0066cc" style={styles.progressBar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingRight: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    width: '94%',
    marginVertical: -60,
    borderWidth: 2,
    borderColor: '#ebe8e8',
  },
  period: {
    fontSize: 24,
    textAlign: 'center',
  },
  timer: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  progressBarContainer: {
    overflow: 'hidden',
    paddingHorizontal: 0,
  },
  progressBar: {
    width: '100%',
    height: 30,
    overflow: 'hidden',
    borderRadius: 11,
  },
});

export default PeriodTimer;
