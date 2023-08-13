import React, { useCallback, useContext, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, CommonActions } from '@react-navigation/native';
import axios from 'axios';
// import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { LISD_CLIENT_AUTH_UN, LISD_CLIENT_AUTH_PWD, LISD_API_KEY, GOOGLE_WEB_CLIENT_ID } from '@env';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import { storeData, retrieveData, removeItem } from './storage.js';


const loginurl = "https://api.leanderisd.org/portal/login";

// type Props = StackScreenProps<RootStackParamList, 'Home'>;
// GoogleSignin.configure({
//   iosClientId: '809923761821-5lio914f08csk2hgkufapgh19l0418n0.apps.googleusercontent.com',
//   webClientId: GOOGLE_WEB_CLIENT_ID,
//   offlineAccess: true,
//   scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
// });
const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSignedIn, setIsSignedIn] = useState(false);

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;

  // const signIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     await GoogleSignin.signIn();
  //     const tokens = await GoogleSignin.getTokens();
  //     await AsyncStorage.setItem('asyncAccessToken', tokens.accessToken);
  //     console.log(tokens.idToken);
  //     return tokens.accessToken;
  //   } catch (error) {
  //     console.error('Error signing in:', error);
  //   }
  // };
  // const handleSignIn = useCallback(async () => {
  //   const accessToken = await signIn();
  //   if (accessToken) {
  //     setIsSignedIn(true);
  //     const calendarId = 'primary';
  //     // setIsLoading(true); // Set isLoading to true before fetching events
  //     handleLogin();
  //   }
  // }, [currentDate]);

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
        await storeData('username', username);
        await storeData('password', password);
        await storeData('studentID', response.data.id)
        await storeData('firstName', response.data.first)
        await storeData('lastName', response.data.last)
        await storeData('grade', response.data.grade)
        await storeData('campus', response.data.campus);
        await storeData('subcampus', response.data.subcampus ? response.data.subcampus : "");
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
      <View style={styles.LoginContainer}>
        <Image
          style={styles.LoginLogo}
          source={require('../assets/lisd.png')}
        />
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.LoginInput}
          placeholder="ex: smith_959876"
          placeholderTextColor="gray"
          selectionColor="#005987" // Change the selection color
          underlineColorAndroid="transparent" // Hide the default underline
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.LoginInput}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="gray"
          selectionColor="#005987" // Change the selection color
          underlineColorAndroid="transparent" // Hide the default underline
        />
        {errorMessage ? <Text style={styles.LoginError}>{errorMessage}</Text> : null}
        <TouchableOpacity onPress={handleLogin} style={styles.LoginLoginButton}>
          <Text style={styles.LoginLoginButtonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.LoginOrText}>OR</Text>
        {/* <TouchableOpacity onPress={handleSignIn} style={styles.LoginGoogleButton}>
          <Image source={require('../assets/google.png')} style={styles.LoginGoogleIcon} />
          <Text style={styles.LoginGoogleButtonText}>Sign in with Google</Text>
        </TouchableOpacity> */}
      </View>
    );
    };
  export default Login;