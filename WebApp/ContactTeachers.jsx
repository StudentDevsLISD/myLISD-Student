import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image, Linking, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import axios from 'axios';
import {IP_ADDRESS} from '@env';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import alert from './alert.js'
import { storeData, retrieveData, removeItem } from './storage.js';


// interface Teacher {
//   name: string;
//   class: string;
//   email: string;
//   imageUrl: string;
// }

// const teachers: Teacher[] = [
//   {
//     name: "John Doe",
//     class: "AP Calculus BC",
//     email: "adith.chandraiah@gmail.com",
//     imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
//   },
//   {
//     name: "Jane Smith",
//     class: "AP English Language and Composition",
//     email: "janesmith@example.com",
//     imageUrl: "https://media.istockphoto.com/id/1151796047/photo/laughing-mature-businesswoman-wearing-glasses-posing-on-grey-studio-background.jpg?s=612x612&w=0&k=20&c=Nkb3aDxmf2g_-zFqq0j97x8J_V9asEq5XUpPJU4wxLc=",
//   },
//   // Add more teachers here
// ];



const ItemView = ({ item, theme }) => {
  const handleEmailPress = () => {
    Linking.openURL(`${item.email}`);
  };

  const styles = theme === 'light' ? lightStyles : darkStyles;

  return (
    <TouchableOpacity style={styles.ContactTeacherArticleContainer} onPress={handleEmailPress}>
      <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png' }} style={styles.ContactTeacherImage} resizeMode="contain" />
      <View style={styles.ContactTeacherTextContainer}>
        <Text style={styles.ContactTeacherTitle}>{item.name}</Text>
        <Text style={styles.ContactTeacherSource}>{item.class}</Text>
      </View>
      <Icon name="chevron-right" size={30} color= "gray" />
    </TouchableOpacity>
  );
};

const ItemSeparatorView = ({ theme }) => {
  return (
    <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8' }} />
  );
};

const ContactTeachersScreen = ({ theme }) => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState();

  useEffect(() => {
    loadCredentials();
  }, []);
  
  const loadCredentials = async () => {
    try {
      const loadedUsername = await retrieveData('hacusername');
      const loadedPassword = await retrieveData('hacpassword');

      if (loadedUsername !== null && loadedPassword !== null) {
        setIsLoggedIn(true);
        console.log("x")
        fetchTeachers(loadedUsername, loadedPassword)
      } else {
        setIsLoggedIn(false);
        console.log("y")
        navigation.navigate("Grades")
      }
    } catch (error) {
      console.log("bad")
    }
  };
  const fetchTeachers = async (username, password) => {
    let response = '';
    try {
      setIsLoading(true);
      const encryptedPassword = encryptAES(password);
        const encryptedUsername = encryptAES(username)
      response = await axios.post(`http://${IP_ADDRESS}:8082/teachers`, {
        username: encryptedUsername.ciphertext,
        uiv: encryptedUsername.iv,
        password: encryptedPassword.ciphertext,
        piv: encryptedPassword.iv,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsLoggedIn(false);
      alert("Error logging in");
    }
  
    if (response.data) {
      // Process and remove duplicates
      const uniqueTeachers = [];
      response.data.teachers.forEach((teacher) => {
        const existingTeacher = uniqueTeachers.find((t) => t.name === teacher.name);
        if (existingTeacher) {
          existingTeacher.class += `, ${teacher.class}`;
        } else {
          uniqueTeachers.push(teacher);
        }
      });
  
      setTeachers(uniqueTeachers);
    }
  };
  
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

  const styles = theme === 'light' ? lightStyles : darkStyles;
  if (isLoading) {
    return (
      <View style={styles.AttendanceLoadingContainer}>
        <ActivityIndicator
          animating={true}
          size={'large'}
          color={theme === 'light' ? '#005a87' : '#ede1d1'}
        />
      </View>
    );
  }
  return (
    <View style={styles.ContactTeacherContainer}>
      {!isLoggedIn ? (
        <TouchableOpacity 
          style={styles.GradesLoginButton} 
          onPress={() => loadCredentials()}
        >
          <Text style={styles.GradesLoginButtonText}>Login with HAC</Text>
        </TouchableOpacity>
      ):(
        <ScrollView>
      <Text style={styles.ContactTeacherSectionTitle}>Contact Teachers</Text>
      <FlatList
        data={teachers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <ItemView item={item} theme={theme} />}
        ItemSeparatorComponent={() => <ItemSeparatorView theme={theme} />}
      />
      </ScrollView>
      )}
    </View>
    
  );
};

const ContactTeachersScreenWrapper = () => {
  const { theme } = useContext(ThemeContext);
  return <ContactTeachersScreen theme={theme}/>;
};

export default ContactTeachersScreenWrapper;
