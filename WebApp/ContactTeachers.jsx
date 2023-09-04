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
import alert from './alert.js'
import { storeData, retrieveData, removeItem } from './storage.js';
// import https from 'https';


// const instance = axios.create({
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false // Only use this during development!
//   })
// });

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
    // try {
    //   const loadedUsername = await retrieveData('hacusername');
    //   const loadedPassword = await retrieveData('hacpassword');

    //   if (loadedUsername !== null && loadedPassword !== null) {
    setIsLoggedIn(true);
    //     console.log("x")
    //     fetchTeachers(loadedUsername, loadedPassword)
    //   } else {
    //     setIsLoggedIn(false);
    //     console.log("y")
    //     navigation.navigate("Grades")
    //   }
    // } catch (error) {
    //   console.log("bad")
    // }
    fetchTeachers()
  };
  const fetchTeachers = async (username, password) => {
    let response = '';
    try {
      setIsLoading(true);

        response = await axios.get('http://' + IP_ADDRESS + ':8082/teachers', {
          withCredentials: true
        })
      // You can now access the response data using response.data
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