import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface GradeType {
  color: string;
  letter: string;
}

const getGrade = (score: number): GradeType => {
  if (score >= 90) return { color: '#00DE64', letter: 'A' };
  if (score >= 80) return { color: '#3199FE', letter: 'B' };
  if (score >= 70) return { color: '#F99816', letter: 'C' };
  return { color: '#FB5B5B', letter: 'D' };
};

const Grades = () => {
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    const dummyData = {
      "AP Computer Science A": "44.25",
      "AP Physics C: Mechanics": "55.54",
      "Anatomy and Physiology": "78.99",
      "AP Human Geography": "88.75",
      "AP Environmental Science": "90.00",
      "AP Calculus BC": "100.0",
      "AP Language and Composition" : "88.46",
      "AP Spanish IV": "84.34",
    };

    setGrades(dummyData);
  }, []);
  
  const navigation = useNavigation();
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  
  return (
    <View>
            <ScrollView>

      <View style={styles.header}>
        <Text style={styles.dateText}>{currentDate}</Text>
        <Text style={styles.headerText}>Grades</Text>
      </View>
        {Object.entries(grades).map(([subject, grade], index) => {
          const { color, letter } = getGrade(Number(grade));
          return (
            <TouchableOpacity style={styles.gradeContainer} key={index}>
              <View style={styles.gradeItem}>
                <View style={styles.gradientTextContainer}>
                  <Text numberOfLines={1} style={styles.gradeText}>{subject}</Text>
                </View>
                <View style={styles.gradeBadge}>
                  <Text style={styles.gradeBadgeText2}>{letter}</Text>
                </View>
                <View style={[styles.gradeBadgeColor, { backgroundColor: color }]}>
                  <Text style={styles.gradeBadgeText}>{grade }</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  gradeContainer: {
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    padding: 12.5,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  gradeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: -3,
  },
  gradeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  gradeBadge: {
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginLeft: 10,
  },
  gradeBadgeColor: {
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  gradeBadgeText: {

    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gradeBadgeText2: {

    color: '#e8e8e8',
    fontSize: 0,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 5,
  },
  headerText: {
    fontSize: 40,
    marginLeft: -95,
    marginBottom: 10,
    marginTop: 10,
    color: "#005987",
    fontWeight: "600",
  },  gradientTextContainer: {
    flexDirection: 'row',
    maxWidth: '60%',
    position: 'relative',
  },

  gradientOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '30%',
    height: '100%',
  },

  dateText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 58,
    marginLeft: 14,
  },
});

export default Grades;
