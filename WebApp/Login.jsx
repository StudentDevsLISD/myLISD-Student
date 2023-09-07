
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { GoogleLogin } from '@react-oauth/google';
import { storeData, retrieveData, removeItem } from './storage.js';


const Login = () => {
  return (
    <View>
      <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse.credential);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
    </View>
  );
};

export default Login;
