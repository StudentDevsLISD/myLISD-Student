import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Text, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp, CommonActions } from '@react-navigation/native';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';

const options = [
  { id: '1', title: 'Grades', description: 'Check your grades', iconName: 'chart-line', route: 'NewsScreen' },
  { id: '2', title: 'GPA', description: 'Calculate your GPA', iconName: 'calculator', route: 'QuickLinksScreen.tsx' },
  { id: '3', title: 'Attendance', description: 'Check your attendance', iconName: 'clipboard-check', route: 'News'},
  { id: '4', title: 'Class Schedule', description: 'Look at your class schedule', iconName: 'calendar-alt', route: 'ContactTeachers' },
  { id: '5', title: 'Contact Teachers', description: 'Keep in touch', iconName: 'user-friends', route: 'ContactTeachers' },
];

type RootStackParamList = {
  HAC: undefined;
  Grades: undefined;
  GPA: undefined;
  Attendance: undefined;
  ClassSchedule: undefined;
  ContactTeachers: undefined;
};

type Props = {
  navigation: NavigationProp<RootStackParamList, 'HAC'>;
}
const HAC = () => {
  
  const [currentDate, setCurrentDate] = useState('');

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formattedDate);
  }, []);

  const navigation = useNavigation();

  const handleOptionPress = (option: { id: string; title: string; description: string; iconName: string; route?: string; webLink?: string;}) => {
    if (option.webLink) {
      Linking.openURL(option.webLink);
    } else if(option.title == "GPA"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "GPA",
        }
        )
        
      );
      
    } 
    else if(option.title == "Attendance"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "Attendance",
        }
        )
        
      );
      
    } 
    else if(option.title == "Class Schedule"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "ClassSchedule",
        }
        )      
      );     
    } 
    else if(option.title == "Contact Teachers"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "ContactTeachers",
        }
        )       
      );     
    } 
    else if(option.title == "Grades"){
      navigation.dispatch(
        CommonActions.navigate({
          name: "Grades",
        }
        )       
      );     
    } 
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.HACContainer}>
      <View style={styles.HACHeader}>
        <Text style={styles.HACDateText}>{currentDate}</Text>
        <Text style={styles.HACHeaderText}>HAC</Text>
      </View>
      {options.map((option) => (
        <TouchableOpacity key={option.id} onPress={() => handleOptionPress(option)}>
          <View style={styles.HACBox}>
            <ListItem>
              <Icon name={option.iconName} size={20} color="#005987" />
              <ListItem.Content>
                <ListItem.Title>{option.title}</ListItem.Title>
                <ListItem.Subtitle style={styles.HACDescriptionText}>{option.description}</ListItem.Subtitle>
              </ListItem.Content>
              <Icon name="chevron-right" size={20} color="gray" style={styles.HACChevronIcon} />
            </ListItem>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default HAC;
