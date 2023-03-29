import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

const PeriodTimer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  const periods = [
    { name: '1st Period', startTime: '08:15', endTime: '09:45' },
    { name: 'Passing Period', startTime: '09:45', endTime: '09:50' },
    { name: '2nd Period', startTime: '09:50', endTime: '11:20' },
    { name: 'Ranger Time', startTime: '11:20', endTime: '11:55' },
    { name: 'Passing Period', startTime: '11:55', endTime: '12:00' },
    { name: '3rd Period', startTime: '12:00', endTime: '14:00' },
    { name: 'Passing Period', startTime: '14:00', endTime: '14:05' },
    { name: '4th Period', startTime: '14:05', endTime: '15:35' },
  ];

  const getRemainingTime = (period: { name?: string; startTime?: string; endTime: any; }) => {
    const now = currentTime.getTime();
    const [hours, minutes] = period.endTime.split(':').map((time: string) => parseInt(time));
    const end = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), hours, minutes).getTime();
    const remaining = end - now;
    if (remaining < 0) return '00:00';
    const remainingMinutes = Math.floor(remaining / 60000);
    const remainingSeconds = Math.floor((remaining % 60000) / 1000);
    return `${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentPeriod: {
    name?: string;
    startTime: string;
    endTime: string;
  } = periods.find((period) => {
    const [startHours, startMinutes] = period.startTime.split(':').map((time) => parseInt(time));
    const [endHours, endMinutes] = period.endTime.split(':').map((time) => parseInt(time));
    const start = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), startHours, startMinutes).getTime();
    const end = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), endHours, endMinutes).getTime();
    return currentTime.getTime() >= start && currentTime.getTime() < end;
  }) || { name: '', startTime: '', endTime: '' };
  
  

  const getProgress = (period: { startTime: string; endTime: string }) => {
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
  

  return (
    <View>
      <Text>Current Period: {currentPeriod?.name && (
        <View>
          <Text>Time Remaining: {getRemainingTime(currentPeriod)}</Text>
          {currentPeriod?.startTime && (
  <Progress.Bar 
  progress={getProgress(currentPeriod)}
  width={null}
  color="#6CC644"
  unfilledColor="#e6e6e6"
  borderRadius={0}
  height={20}
/>
)}
        </View>
      )}</Text>
    </View>
  );
};

export default PeriodTimer;






