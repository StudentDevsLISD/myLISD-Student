import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';

interface Props {
  id: React.Key,
  summary: string,
  start: string,
  end: string,
}

const CalendarEvent = ({ id, summary, start, end }: Props) => {
    return (
      <View key={id} style={styles.container}>
        <View style={styles.blueStripWrapper}>
          <View style={styles.blueStrip} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{summary}</Text>
          <Text style={styles.time}>
            {new Date(start).toLocaleTimeString()} -{' '}
            {new Date(end).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  blueStripWrapper: {
    width: 4,
    backgroundColor: '#007AFF',
    borderRadius: 4,
    overflow: 'hidden',
    paddingRight: 6,
  },
  blueStrip: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10, // add some left margin
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#999',
  },
});

export default CalendarEvent;
