import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image, Linking, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import axios from 'axios';
import {IP_ADDRESS} from '@env';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
//     imageUrl: "https://images.squarespace-cdn.com/content/v1/5b56c01f9f877051fa238ca3/1573759915619-1LGAQ3NCIULHNEZ1OY87/Ray.jpg",
//   },
//   {
//     name: "Jane Smith",
//     class: "AP English Language and Composition",
//     email: "janesmith@example.com",
//     imageUrl: "https://media.istockphoto.com/id/1151796047/photo/laughing-mature-businesswoman-wearing-glasses-posing-on-grey-studio-background.jpg?s=612x612&w=0&k=20&c=Nkb3aDxmf2g_-zFqq0j97x8J_V9asEq5XUpPJU4wxLc=",
//   },
//   // Add more teachers here
// ];

interface ContactTeachersScreenProps {
  theme: 'light' | 'dark'; // Specify the theme type here based on your ThemeContext
}

const ItemView = ({ item, theme }: { item: Teacher; theme: 'light' | 'dark' }) => {
  const handleEmailPress = () => {
    Linking.openURL(`${item.email}`);
  };

  const styles = theme === 'light' ? lightStyles : darkStyles;

  return (
    <TouchableOpacity style={styles.ContactTeacherArticleContainer} onPress={handleEmailPress}>
      <Image source={{ uri: item.imageUrl }} style={styles.ContactTeacherImage} resizeMode="contain" />
      <View style={styles.ContactTeacherTextContainer}>
        <Text style={styles.ContactTeacherTitle}>{item.name}</Text>
        <Text style={styles.ContactTeacherSource}>{item.class}</Text>
      </View>
      <Icon name="chevron-right" size={30} color= "gray" />
    </TouchableOpacity>
  );
};

const ItemSeparatorView = ({ theme }: { theme: 'light' | 'dark' }) => {
  return (
    <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8' }} />
  );
};

const ContactTeachersScreen = ({ theme }: ContactTeachersScreenProps) => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState();

  useEffect(() => {
    loadCredentials();
  }, []);
  
  const loadCredentials = async () => {
    try {
      const loadedUsername = await AsyncStorage.getItem('hacusername');
      const loadedPassword = await AsyncStorage.getItem('hacpassword');

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
    let response ='';
    try {
      setIsLoading(true);
      response = await axios.get(`http://${IP_ADDRESS}:8080/teachers?username=${username}&password=${password}`);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsLoggedIn(false);
      Alert.alert("Error logging in")
    }      
    if(response.data){
      setTeachers(response.data.teachers);
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
