import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
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
    if (remaining < 0) return '00 hrs 00 mins';
    const remainingHours = Math.floor(remaining / 3600000);
    const remainingMinutes = Math.floor((remaining % 3600000) / 60000);
    return `${remainingHours} hrs ${remainingMinutes} mins`;
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
    <View style = {styles.container}>
      <Text style={styles.period}> {getRemainingTime(currentPeriod)  + " Left in " + currentPeriod?.name ? currentPeriod.name : "No Period" }</Text>
      {/* <Text>Current Period: {currentPeriod?.name ? currentPeriod.name : "No Period" }{currentPeriod?.name && ( */}
      <Text style={styles.timer}>{getRemainingTime(currentPeriod)}</Text>
      <View style={styles.progressBarContainer}>
        <Progress.Bar /*styleAttr="Horizontal"*/ indeterminate={false} progress={getProgress(currentPeriod)} color="#0066cc" style={styles.progressBar} />
      </View>
      </View>  
//         <View>
//           <Text>Time Remaining: {getRemainingTime(currentPeriod)}</Text>
//           {currentPeriod?.startTime && (
//   <Progress.Bar 
//   progress={getProgress(currentPeriod)}
//   width={null}
//   color="#6CC644"
//   unfilledColor="#e6e6e6"
//   borderRadius={0}
//   height={20}
// />
/* <View style={styles.container}>
      <Text style={styles.period}>{`${periodSchedule.length === 0 ? '' : 'Left in '}${currentPeriod}th period`}</Text>
      <Text style={styles.timer}>{timeLeft}</Text>
      <View style={styles.progressBarContainer}>
        <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={progress} color="#0066cc" style={styles.progressBar} />
      </View>
    </View>
)}
        </View>
      )}</Text> */
    //</View>
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






