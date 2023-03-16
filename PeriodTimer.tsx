import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ProgressBarAndroid } from 'react-native';

const periodSchedule = [
  { start: new Date(0, 0, 0, 8, 15), duration: 90 }, // 1st period
  { start: new Date(0, 0, 0, 9, 50), duration: 90 }, // 2nd period
  { start: new Date(0, 0, 0, 11, 20), duration: 35 }, // Ranger time
  { start: new Date(0, 0, 0, 12, 0), duration: 120 }, // 3rd + lunch
  { start: new Date(0, 0, 0, 14, 5), duration: 90 }, // 4th period
];


interface Period {
  start: Date;
  duration: number;
}

interface Props {
  periodSchedule: Period[];
}

const PeriodTimer = ({ periodSchedule }: Props) => {
  const [timeLeft, setTimeLeft] = useState('00:00');
  const [progress, setProgress] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
     
      if (periodSchedule.length === 0) {
        setTimeLeft('No school right now');
        setProgress(1);
        return;
      }

      // Find the current period
      const period = periodSchedule.find((p, i) => {
        const nextPeriod = periodSchedule[i + 1];
        if (nextPeriod && now >= p.start && now < nextPeriod.start) {
          return true;
        }
        if (!nextPeriod && now >= p.start) {
          return true;
        }
        return false;
      });

      if (period) {
        setCurrentPeriod(periodSchedule.indexOf(period) + 1);

        const hoursLeft = Math.floor((period.start.getTime() + (period.duration * 60000) - now.getTime()) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((period.start.getTime() + (period.duration * 60000) - now.getTime()) / (1000 * 60)) % 60;
        const formattedTime = `${hoursLeft.toString()} hr ${minutesLeft.toString().padStart(2, '0')} min`;
        setTimeLeft(formattedTime);

        const elapsed = now.getTime() - period.start.getTime();
        const progressValue = elapsed / (period.duration * 60000);
        setProgress(progressValue);
      } else {
        setTimeLeft('00:00');
        setProgress(1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
  },
});

export default PeriodTimer
