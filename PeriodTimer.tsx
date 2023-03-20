import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ProgressBarAndroid } from 'react-native';

interface Period {
  start: Date;
  duration: number;
}

const PeriodTimer = () => {
  const [timeLeft, setTimeLeft] = useState('00:00');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [currentHrs, setCurrentHrs] = useState(new Date().getUTCHours());
  console.log(currentHrs)
  const [currentMins, setCurrentMins] = useState(new Date().getUTCMinutes());
  console.log(currentMins)
  const [progress, setProgress] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState(1);
  const periodSchedule = [
    { start: new Date()/*.setHours(8, 15)*/, duration: 90 }, // 1st period
    { start: new Date()/*.setHours(9, 50)*/, duration: 130 }, // 2nd period
    //{ start: new Date()/*.setHours(11, 20)*/, duration: 40 }, // Ranger time
    { start: new Date()/*.setHours(12, 0)*/, duration: 150 }, // 3rd + lunch
    { start: new Date()/*.setHours(14, 30)*/, duration: 90 }, // 4th period
    { start: new Date()/*.setHours(16, 0)*/, duration: 0 }, // 4th period
  ];
  
  useEffect(()=>{
    periodSchedule[0].start.setHours(8,15)
    periodSchedule[1].start.setHours(9,50)
    //periodSchedule[2].start.setHours(11,20)
    periodSchedule[2].start.setHours(12,0)
    periodSchedule[3].start.setHours(14,30)
    periodSchedule[4].start.setHours(16,0)
  }, []
  )

  useEffect(() => {
    const interval = setInterval(() => {
      // const now = new Date();
      if (periodSchedule.length === 0) {
        setTimeLeft('No school right now');
        setProgress(1);
        return;
      }

      // Find the current period
      for (var i = 0; i < periodSchedule.length - 1; i++) {
        if (currentTime > periodSchedule[i].start.getTime() && currentTime < periodSchedule[i + 1].start.getTime()) {
          setCurrentPeriod(i + 1);
        } else {
          setCurrentPeriod(0);
        }
      }
      const TotalMinsLeft = 
      //periodSchedule[currentPeriod].duration - 
      (
        ((currentHrs * 60) + currentMins) - 
        ((periodSchedule[currentPeriod].start.getHours() * 60) +
        periodSchedule[currentPeriod].start.getMinutes())
        );
      setTimeLeft(Math.floor(TotalMinsLeft / 60).toString() + " hr " + (TotalMinsLeft % 60).toString() + ' min');
      setProgress(
        TotalMinsLeft / periodSchedule[3].duration
        );
      // if (period) {
      //   setCurrentPeriod(periodSchedule.indexOf(period) + 1);
      //   const hoursLeft = Math.floor((period.start + (period.duration * 60000) - now.getHours()) / (1000 * 60 * 60));
      //   const minutesLeft = Math.floor((period.start + (period.duration * 60000) - now.getHours()) / (1000 * 60)) % 60;
      //   const formattedTime = `${hoursLeft.toString()} hr ${minutesLeft.toString().padStart(2, '0')} min`;
      //   setTimeLeft(formattedTime);
      //   const elapsed = now.getHours() - period.start
      //   const progressValue = elapsed / (period.duration * 60000);
      //   setProgress(progressValue);
      // } else {
      //   setTimeLeft('00:00');
      //   setProgress(1);
      // }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTime]);

  return (
    <View style={styles.container}>
      <Text style={styles.period}>{`${periodSchedule.length === 0 ? '' : 'Left in '}${currentPeriod}th period`}</Text>
      <Text style={styles.timer}>{timeLeft}</Text>
      <View style={styles.progressBarContainer}>
        <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={progress} color="#0066cc" style={styles.progressBar} />
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
    paddingHorizontal: 2,
  },
  progressBar: {
    width: '100%',
    height: 30,
    overflow: 'hidden',
    borderRadius: 11,
    color: '#3495eb',
  },
});

export default PeriodTimer
