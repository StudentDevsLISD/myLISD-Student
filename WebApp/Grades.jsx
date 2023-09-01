import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CommonActions, NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import { IP_ADDRESS } from '@env';
import alert from './alert.js'
import { storeData, retrieveData, removeItem } from './storage.js';



const getGrade = (gradeValue) => {
  if (gradeValue >= "100.00") return { color: '#00DE64' };
  if (gradeValue >= "90.00") return { color: '#00DE64' }; 
  if (gradeValue >= "80.00") return { color: '#3199FE' };
  if (gradeValue >= "70.00") return { color: '#F99816' };
  return { color: '#FB5B5B', letter: 'D' }; 
};

const Grades = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState('');
  const [classes, setClasses] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [grades, setGrades] = useState({});
  const [showNoNewGrades, setShowNoNewGrades] = useState(false);
  const [newAssignments, setNewAssignments] = useState([]);
  const route = useRoute();
  const headerTitle = isLoggedIn ? "Grades" : "HAC";

  const formatGradeValue = (gradeValue) => {
    if (gradeValue >= 90.0 && gradeValue <= 99.99) {
      return gradeValue.toFixed(2);
    } else if (gradeValue === 100.0) {
      return '100.0';
    } else {
      return gradeValue.toString();
    }
  };

  const fetchGrades = async (cookieDict) => {
    try {
      const response = await axios.get(`http://${IP_ADDRESS}:8082/grades`, {
        withCredentials: true
      });

      const currentClasses = response.data.currentClasses;
      console.log("currentClasses", currentClasses)
      if (currentClasses.length === 0) {
        alert('Error', 'Error logging in. Please try again.');
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }
      setClasses(currentClasses);

      setIsLoading(true);

      const grades = {};
      for (let classObj of currentClasses) {
        if (classObj.grade != '') {
          // console.log(classObj.grade)
          // let gradeValue = parseFloat(classObj.grade.split(' ')[2]);
          // console.log(gradeValue)
          // grades[classObj.name] = formatGradeValue(gradeValue);
          grades[classObj.name] = classObj.grade;
        } else {
          grades[classObj.name] = '0.00';
        }
      }

      const storedGradesJson = await retrieveData('grades');
      const storedGrades = JSON.parse(storedGradesJson);
      const isGradesEqual = JSON.stringify(grades) === JSON.stringify(storedGrades);

      if (isGradesEqual) {
        console.log('No new grades found');
        setShowNoNewGrades(true);
      } else {
        await storeData('grades', JSON.stringify(grades));
        console.log('Changes found');
        setShowNoNewGrades(false);
      }

      setGrades(grades);

      const newAssignments = [];
      for (let classObj of currentClasses) {
        const className = classObj.name;
        const classGrade = grades[className];

        if (!storedGrades || !storedGrades.hasOwnProperty(className) || storedGrades[className] !== classGrade) {
          const newAssignmentsInClass = classObj.assignments.filter(assignment => {
            const storedAssignments = storedGrades?.[className]?.assignments;
            if (!storedAssignments) return true;
            return !storedAssignments.some(a => a.name === assignment.name && a.score === assignment.score);
          });
          newAssignments.push(...newAssignmentsInClass);
        }
      }

      // Update the state with new assignments
      setNewAssignments(newAssignments);

    } catch (error) {
      console.error('Error fetching grades:', error);
      if (error.response) {
        console.error('Response:', error.response.data);
      }
      alert('Error', 'An error occurred while fetching grades.');
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  };

  const saveCredentials = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://' + IP_ADDRESS + ':8082/login?username=' + username+ '&password=' + password, {
        withCredentials: true
      })
      setIsLoggedIn(true);
        
      fetchGrades(response.data.cookies)
      
      
      
    } catch (error) {
      setIsLoading(false)
      setIsLoggedIn(false);
      console.error('Error saving data', error);
    }
  };

  const loadCredentials = async () => {
    try {
      const loadedUsername = await retrieveData('hacusername');
      const loadedPassword = await retrieveData('hacpassword');

      if (loadedUsername !== null && loadedPassword !== null) {
        setUsername(loadedUsername);
        setPassword(loadedPassword);
        setIsLoggedIn(true);
        await fetchGrades({"cookies": "test"});
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (route.params && route.params.justLoggedOut) {
      setIsLoggedIn(false);
      setUsername('');
      setPassword('');
      setClasses([]);
      setGrades({});
      setNewAssignments([]);
      removeItem('hacusername');
      removeItem('hacpassword');
      navigation.setParams({ justLoggedOut: undefined });
    }
  }, [route.params]);

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formattedDate);
    loadCredentials();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;
  const FadedText = ({ text }) => {
    const { theme } = useContext(ThemeContext);
    const styles = theme === 'light' ? lightStyles : darkStyles;
    const fadeStart = 26; // Adjusted fadeStart to start fading effect earlier
    const fadeEndWhite = 26;
    const fadeEndBlack = 29;
    let fade = theme === 'light' ? fadeEndWhite : fadeEndBlack;
    return (
      <Text style={styles.GradesGradeText}>
        {text.split('').map((char, i) => {
          let color = theme === 'light' ? '#000' : '#FFF';
          if (i >= fadeStart && i < fade) {
            const fadeProgress = (i - fadeStart + 1) / (fade - fadeStart);
            if (theme === 'light') {
              const colorValue = Math.round(fadeProgress * 232); // 232 is (0xe8 - 0x00)
              color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
            } else {
              const colorValue = Math.round((1 - fadeProgress) * 187); // 187 is (0xe8 - 0x44)
              color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
            }
          } else if (i >= fade) {
            color = theme === 'light' ? '#e8e8e8' : '#444';
          }
          return (
            <Text key={i} style={{ color }}>
              {char}
            </Text>
          );
        })}
      </Text>
    );
  };

  const applyFadingLogic = (text, theme) => {
    const fadeStart = 12; // Starting index for fading effect
    const fadeEnd = 14;   // Ending index for fading effect
    const colorValue = theme === 'light' ? 232 : 187; // Adjust as needed
  
    return text.split('').map((char, i) => {
      let color = theme === 'light' ? '#000' : '#FFF';
  
      if (i >= fadeStart && i <= fadeEnd) {
        const fadeProgress = (i - fadeStart + 1) / (fadeEnd - fadeStart + 1);
        const modifiedColorValue = Math.round(fadeProgress * colorValue);
        color = `rgb(${modifiedColorValue}, ${modifiedColorValue}, ${modifiedColorValue})`;
      } else if (i > fadeEnd) {
        color = theme === 'light' ? '#e8e8e8' : '#444';
      }
  
      return (
        <Text key={i} style={{ color }}>
          {char}
        </Text>
      );
    });
  };
  
  

  const renderSubjectText = (subject, theme) => {
    const maxLength = 38;
    const truncatedSubject = subject.slice(0, maxLength);

    return <FadedText text={truncatedSubject} theme={theme} />;
  };

  return (
    <View style={styles.GradesContainer}>
      {isLoading ? (
        <ActivityIndicator
          animating={true}
          size={'large'}
          color={theme === 'light' ? '#005a87' : '#ede1d1'}
        />
      ) : (
        <>
          <View style={styles.GradesHeader}>
            <Text style={styles.GradesDateText}>{currentDate}</Text>
            <Text style={styles.GradesHeaderText}>{headerTitle}</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={true}>
            {!isLoggedIn && (
              <View style={styles.GradesInputContainer}>
                <TextInput
                  style={styles.GradesInput}
                  placeholder="Username"
                  onChangeText={setUsername}
                  value={username}
                  placeholderTextColor={"gray"}
                  color={theme === 'light' ? 'black' : 'white'}
                />
                <TextInput
                  style={styles.GradesInput}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={setPassword}
                  value={password}
                  placeholderTextColor="gray"
                  color={theme === 'light' ? 'black' : 'white'}
                />
                <TouchableOpacity style={styles.GradesLoginButton} onPress={saveCredentials}>
                  <Text style={styles.GradesLoginButtonText}>Login</Text>
                </TouchableOpacity>
              </View>
            )}
            {newAssignments.length > 0 && (
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.GradesNewAssignmentsScrollView}>
{newAssignments.map((assignment, index) => (
  <TouchableOpacity
    key={index}
    style={styles.GradesNewAssignmentTouchable}
    onPress={() => {
      // Handle assignment press if needed
    }}
  >
    <Text style={styles.GradesNewAssignmentText1}>
      {assignment.name.length > 14 ? (
        <>
          {assignment.name.substring(0, 12)}
          {applyFadingLogic(assignment.name.substring(12, 14), theme)}
        </>
      ) : (
        assignment.name
      )}
      :
    </Text>
    <Text style={styles.GradesNewAssignmentText2}>
      {assignment.score}
    </Text>
  </TouchableOpacity>
))}


              </ScrollView>
            )}
            {showNoNewGrades && (
              <TouchableOpacity disabled={true} style={styles.GradesAppButtonContainer2}>
                <Text style={styles.GradesAppButtonText2}>No New Grades Have Been Added</Text>
              </TouchableOpacity>
            )}
            {classes.map((classObj, index) => {
              const { name, grade, assignments, categories } = classObj;
              let gradeValue = classObj.grade;
              const { color, letter } = getGrade(classObj.grade);
              const badgeColor = assignments.length === 0 ? 'gray' : color;
  
              return (
                <TouchableOpacity
                  style={styles.GradesGradeContainer}
                  key={index}
                  onPress={() => {
                    navigation.dispatch(
                      CommonActions.navigate({
                        name: 'AssignmentScreen',
                        params: {
                          data: {
                            course: name,
                            grade: grades[name],
                            assignments: assignments,
                            categories: categories
                          },
                        },
                      })
                    );
                  }}
                  disabled={assignments.length === 0}
                >
                  <View style={styles.GradesGradeItem}>
                    <View style={styles.GradesCourseNameAndNum}>
                      {renderSubjectText(name.substring(12, 38))}
                      <Text numberOfLines={1} style={styles.GradesGradeTextCourse}>{name.substring(0, 9)}</Text>
                    </View>
                    <View style={[styles.GradesGradeBadgeColor, { backgroundColor: badgeColor }]}>
                      <Text style={styles.GradesGradeBadgeText}>{grades[name].length>=6 ? grades[name].substring(0, 5) : grades[name]}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}
    </View>
  );
  
};

export default Grades;