import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { LISD_CLIENT_AUTH_UN, LISD_CLIENT_AUTH_PWD, LISD_API_KEY, GOOGLE_WEB_CLIENT_ID } from '@env';


const loginurl = "https://api.leanderisd.org/portal/login";

type RootStackParamList = {
  Home: undefined;
  Details: { id: number };
};

type Props = {
  navigation: NavigationProp<RootStackParamList, 'Home'>;
};
// type Props = StackScreenProps<RootStackParamList, 'Home'>;
GoogleSignin.configure({
  iosClientId: '809923761821-5lio914f08csk2hgkufapgh19l0418n0.apps.googleusercontent.com',
  webClientId: GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});
const Login = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSignedIn, setIsSignedIn] = useState(false);
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      await AsyncStorage.setItem('asyncAccessToken', tokens.accessToken);
      console.log(tokens.idToken);
      return tokens.accessToken;
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };
  const handleSignIn = useCallback(async () => {
    const accessToken = await signIn();
    if (accessToken) {
      setIsSignedIn(true);
      const calendarId = 'primary';
      // setIsLoading(true); // Set isLoading to true before fetching events
      handleLogin();
    }
  }, [currentDate]);

  const handleLogin = async () => {
    try {
      const data = { "username": username, "password": password };
      const response = await axios.post(loginurl, data, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'clientAuthUN': LISD_CLIENT_AUTH_UN,
            'clientAuthPwd': LISD_CLIENT_AUTH_PWD,
        },
        params: {
          APIKey: LISD_API_KEY,
        }
  
      });
      if (response.data.status === "success") {
        console.log(response.data);
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
        await AsyncStorage.setItem('studentID', response.data.id)
        await AsyncStorage.setItem('firstName', response.data.first)
        await AsyncStorage.setItem('lastName', response.data.last)
        await AsyncStorage.setItem('grade', response.data.grade)
        await AsyncStorage.setItem('campus', response.data.campus);
        await AsyncStorage.setItem('subcampus', response.data.subcampus ? response.data.subcampus : "");
        console.log("done")
        // Reset the navigation stack and navigate to the Home screen
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        );
        
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
          source={require('../assets/lisd.png')}
        />  
      <Text style ={styles.work}>
        Please use your LISD username and password
        </Text>   
      <TextInput
        label="Username"
        value={ username}
        onChangeText={setUsername}
        style={styles.input} 
        secureTextEntry={false}
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
      <TouchableOpacity onPress={handleSignIn} style={styles.googlebox}>
          <Image source={require('../assets/google.png')} style={{ width: 60, height: 60,marginLeft: 20,}} />
          <Text style = {styles.google1}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 60,
    alignItems: 'center',
    padding: 16,
  },
  input: {
    marginBottom: 16,
    minWidth: 200,
    backgroundColor: '#bfe1ff'
  },
  button: {
    marginTop: 16,
    backgroundColor:'#3495eb',
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
    marginBottom: 30,
  },
  work: {
  fontSize: 18,
  alignSelf: "center",
  textAlign: "center",
  marginTop: -16,
  marginBottom: 18,
  },
  google1:{
    marginLeft:85,
    marginTop: -45,
    fontSize: 25,
    marginRight: 29,
  },
  googlebox:{
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingRight: 20,
    marginHorizontal: 10,
    paddingBottom: 15,
    width: '95%',
    borderWidth: 2,
    borderColor: '#ebe8e8',
  },
});

export default Login;