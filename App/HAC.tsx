import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Text, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp, CommonActions } from '@react-navigation/native';

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
  Details: { id: number };
  WebViewScreen: { url: string };
};

type Props = {
  navigation: NavigationProp<RootStackParamList, 'HAC'>;
}
const HAC = () => {
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{currentDate}</Text>
        <Text style={styles.headerText}>HAC</Text>
      </View>
      <TouchableOpacity disabled={true} style={styles.appButtonContainer2}>
        <Text style={styles.appButtonText2}>
          {'No New Grades Have Been Added'}
        </Text>
      </TouchableOpacity>
      {options.map((option) => (
        <TouchableOpacity key={option.id} onPress={() => handleOptionPress(option)}>
          <View style={styles.box}>
            <ListItem>
              <Icon name={option.iconName} size={20} color="#005987" />
              <ListItem.Content>
                <ListItem.Title>{option.title}</ListItem.Title>
                <ListItem.Subtitle style={styles.descriptionText}>{option.description}</ListItem.Subtitle>
              </ListItem.Content>
              <Icon name="chevron-right" size={20} color="gray" style={styles.chevronIcon} />
            </ListItem>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 5,
  },
  headerText: {
    fontSize: 40,
    marginLeft: -90,
    marginBottom:10,
    marginTop: -13,
    color: "#005987",
    fontWeight: "600",
    
  },
  dateText: {
    fontSize: 14,
    color: 'gray',
    marginTop:40,
    marginLeft: 5,
  },
  box: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    marginVertical: 5,
    overflow: 'hidden', // Needed to apply border radius to ListItem
  },
  descriptionText: {
    color: 'gray',
  },
  chevronIcon: {
    marginLeft: 'auto',
    paddingLeft: 10,
  },
  appButtonContainer2: {
    elevation: 8,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 13,
    marginHorizontal: 2.05,
    marginBottom: 7,
    marginTop: -1,
    width: '99%',
    borderWidth: 2,
    borderColor: '#ebe8e8',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    
    },
    appButtonText2: {
    fontSize: 18,
    color: 'black',
    alignSelf: 'center',
    fontWeight: 'normal',
    
    },
});

export default HAC;
