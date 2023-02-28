import React, { useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios';

const loginurl = "http://192.168.1.163:18080/login";

type RootStackParamList = {
  Home: undefined;
  Details: { id: number };
};

type Props = {
  navigation: NavigationProp<RootStackParamList, 'Home'>;
};
// type Props = StackScreenProps<RootStackParamList, 'Home'>;
const Login = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const data = { "username": username, "password": password };
      const response = await axios.post(loginurl, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.status === "success") {
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
        navigation.navigate('Home');
      } else {
        setErrorMessage('Incorrect username or password');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('An error occurred while logging in');
    }
  };

  return (
    <View style={styles.container}>
      <Image
          style={styles.logo}
          source={require('./assets/lisd.png')}
        />   
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
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
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
    minWidth: 200,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  logo: {
    height: 100,
    width: 250,
    marginTop: 5,
    alignSelf: "center",
  },
});

export default Login;