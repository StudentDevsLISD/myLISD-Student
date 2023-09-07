
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { GoogleLogin } from '@react-oauth/google';
import { storeData, retrieveData, removeItem } from './storage.js';
import { CommonActions, useNavigation } from '@react-navigation/native';


const Login = () => {
  const navigation = useNavigation();
  return (
    <View>
      <GoogleLogin
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
  );
};

export default Login;
