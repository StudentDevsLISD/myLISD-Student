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
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder="ex: smith_959876"
          placeholderTextColor="gray"
          selectionColor="#005987" // Change the selection color
          underlineColorAndroid="transparent" // Hide the default underline
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="gray"
          selectionColor="#005987" // Change the selection color
          underlineColorAndroid="transparent" // Hide the default underline
        />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>OR</Text>
        <TouchableOpacity onPress={handleSignIn} style={styles.googleButton}>
          <Image source={require('../assets/google.png')} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f0f0f0',
    },
    logo: {
      width: 320, // Increase the width for a bigger logo
      height: 105, // Increase the height for a bigger logo
      marginBottom: 30,
    },
    input: {
      width: '100%',
      height: 50, // Decreased the height back to 50
      backgroundColor: 'white',
      paddingHorizontal: 15,
      marginBottom: 10,
      borderRadius: 5,
      color: 'darkgray', // Set the text color within the input box
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
    loginButton: {
      width: '100%',
      height: 50,
      backgroundColor: '#3495eb',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginTop: 10,
    },
    loginButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    orText: {
      fontSize: 18,
      marginVertical: 20,
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      width: '100%',
      height: 50,
    },
    googleIcon: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    googleButtonText: {
      fontSize: 18,
    },
  });
  
  export default Login;