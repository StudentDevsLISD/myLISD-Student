import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Platform, ProgressBar} from 'react-native';
import * as Progress from 'react-native-progress';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';

const PeriodTimer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000); 
    return () => clearInterval(intervalId);
  }, []);

    
  const periods = [
    { name: 'No school right now', startTime: '00:00', endTime: '08:15' },
    { name: '1st Period ends in', startTime: '08:15', endTime: '09:45' },
    { name: 'Passing Period ends in', startTime: '09:45', endTime: '09:50' },
    { name: '2nd Period ends in', startTime: '09:50', endTime: '11:20' },
    { name: 'Ranger Time ends in', startTime: '11:20', endTime: '11:55' },
    { name: 'Passing Period ends in', startTime: '11:55', endTime: '12:00' },
    { name: '3rd Period ends in', startTime: '12:00', endTime: '14:00' },
    { name: 'Passing Period ends in', startTime: '14:00', endTime: '14:05' },
    { name: '4th Period ends in', startTime: '14:05', endTime: '15:35' },
    { name: 'No school right now', startTime: '15:35', endTime: '23:59' },
  ];

  const getRemainingTime = (period) => {
    if (period.name === 'No school right now') {
      return '_ _ _ _ _ _ _ _';
    }
  
    const now = currentTime.getTime();
    const [endHours, endMinutes] = period.endTime.split(':').map((time) => parseInt(time));
    const end = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), endHours, endMinutes).getTime();
    const remainingMs = end - now;
  
    if (remainingMs <= 0) return '00:00'; // Default value when no time is left
  
    const totalHours = Math.floor(remainingMs / 1000 / 3600);
    const totalMinutes = Math.floor((remainingMs / 1000 / 60) % 60);
    const totalSeconds = Math.floor((remainingMs / 1000) % 60);
  
    const hoursStr = totalHours > 0 ? totalHours.toString().padStart(2, '0') : '';
    const minutesStr = totalMinutes.toString().padStart(2, '0');
    const secondsStr = totalSeconds.toString().padStart(2, '0');
  
    // Construct the time format based on whether hours are greater than 0
    if (totalHours > 0) {
      return `${hoursStr}:${minutesStr}:${secondsStr}`;
    } else {
      return `${minutesStr}:${secondsStr}`;
    }
  };
  
  

  const getProgress = (period) => {
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
    <View style={styles.PeriodTimerContainer}>
      <Text style={styles.PeriodTimerPeriod}>{currentPeriodName}</Text>
      {remainingTime != '_ _ _ _ _ _ _ _' ? (
        <>
          <Text style={styles.PeriodTimerTimer}>{remainingTime}</Text>
          <View style={styles.PeriodTimerProgressBarContainer}>
              <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={getProgress(currentPeriod)} color={theme === 'light' ? '#0066cc' : '#ede1d1'} style={styles.PeriodTimerProgressBar} />
          </View>
        </>
      ) : <View></View>}
    </View>
  );
};

export default PeriodTimer;
