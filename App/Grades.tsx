import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

// If grades are simply numbers, use this type:
type GradesType = Record<string, number>;

// If grades are complex objects, use a type like this (adjust fields accordingly):
// type GradeType = { score: number, teacher: string, ... };
// type GradesType = Record<string, GradeType>;

const Grades = () => {
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
    const [grades, setGrades] = useState<Record<string, string>>({});
  
    useEffect(() => {
      const fetchGrades = async () => {
        try {
          const response = await axios.get('http://10.191.80.73:18080/getGrades');
          setGrades(response.data);
        } catch (error) {
          console.error('Error fetching grades:', error);
        }
      };
  
      fetchGrades();
    }, []);
  
    return (
      <View>
        {Object.entries(grades).map(([subject, grade], index) => (
          <TouchableOpacity style={styles.gradeContainer} key={index}>
            <View style={styles.gradeItem}>
              <Text style={styles.gradeText}>{subject}</Text>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeBadgeText}>{grade + "%"}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

const styles = StyleSheet.create({
  gradeContainer: {
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  gradeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gradeBadge: {
    backgroundColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  gradeBadgeText: {
    color: 'black',
    fontSize: 20,
    fontWeight: "bold"
  },
});

export default Grades;