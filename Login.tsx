import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
const loginurl = "http://192.168.86.21:18080/login";
type RootStackParamList = {
    Home: undefined;
    Details: { id: number };
  };
  
  type Props = {
    navigation: NavigationProp<RootStackParamList, 'Home'>;
  };

const Login =  ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await AsyncStorage.setItem('username', username);
      //console.log(username);
      await AsyncStorage.setItem('password', password);
      //console.log(password);
      const data = { "username": username, "password": password };
      var status = "";
      //console.log(data)  
      await axios.post(loginurl, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        status = response.data.status;
        //console.log(data)
      })
      console.log("a");      
      //await AsyncStorage.getItem('username');
      //await AsyncStorage.getItem('password');
      if(status == "success"){
        navigation.navigate('Home');
      } 
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        Sign Up
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default Login;