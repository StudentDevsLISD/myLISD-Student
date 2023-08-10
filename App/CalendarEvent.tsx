import React, { useContext } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';

interface Props {
  id: React.Key,
  summary: string,
  start: string,
  end: string,
}

const CalendarEvent = ({ id, summary, start, end }: Props) => {
    
  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;
  
  return (
      <View key={id} style={styles.CalendarEventContainer}>
        <View style={styles.CalendarEventBlueStripWrapper}>
          <View style={styles.CalendarEventBlueStrip} />
        </View>
        <View style={styles.CalendarEventContent}>
          <Text style={styles.CalendarEventTitle}>{summary}</Text>
          <Text style={styles.CalendarEventTime}>
            {new Date(start).toLocaleTimeString()} -{' '}
            {new Date(end).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };


export default CalendarEvent;
