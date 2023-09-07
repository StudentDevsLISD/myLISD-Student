
import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, StyleSheet, View, Image } from 'react-native';
import { GoogleLogin, MyCustomButton } from '@react-oauth/google';
import { storeData, retrieveData, removeItem } from './storage.js';
import { CommonActions, useNavigation } from '@react-navigation/native';
import DarkStyles from './DarkStyles.js';
import LightStyles from './LightStyles.js';
import { ThemeContext, ThemeProvider } from './ThemeContext';


const Login = () => {
  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? LightStyles : DarkStyles;
  const navigation = useNavigation();
  return (
    <View style={styles.LoginContainer}>
      <View style={{ }}>
      <Image source={require('../assets/lisd_white_2.jpg')} style={{ width: Dimensions.get("window").width*0.6, height: Dimensions.get("window").width * 0.14, resizeMode: 'contain', marginBottom: Dimensions.get('window').width*0.05,}} />
    </View>
    <View>
      <GoogleLogin
      size="large"
          onSuccess={credentialResponse => {
            console.log(credentialResponse.credential);
            navigation.dispatch(
              CommonActions.reset({
                routes: [{ name: 'Home' }],
              })
            );
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
    </View>
    </View>
  );
};

export default Login;
