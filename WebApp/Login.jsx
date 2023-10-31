import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions } from 'react-native'; // Import Dimensions here
import { GoogleLogin } from '@react-oauth/google'; // Assuming GoogleLogin is your custom button
import { CommonActions, useNavigation } from '@react-navigation/native';
import LightStyles from './LightStyles.js';
import { ThemeContext } from './ThemeContext';

const Login = () => {
  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? LightStyles : LightStyles;
  const navigation = useNavigation();

  // Define a function to navigate to the home screen
  const navigateToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: 'Home' }],
      }));
  };

  return (
    <View style={styles.LoginContainer}>
      <View>
        <Image
          source={require('/Users/adithc/myLISD-Student/assets/lisd_white_2.jpg')}
          style={{
            width: Dimensions.get('window').width * 0.6,
            height: Dimensions.get('window').width * 0.14,
            resizeMode: 'contain',
            marginBottom: Dimensions.get('window').width * 0.05,
          }}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={navigateToHome}
          style={{
            backgroundColor: 'white', // White background
            borderRadius: 10, // Border radius
            padding: 10, // Padding for content inside the button
            flexDirection: 'row', // Align content horizontally
            alignItems: 'center', // Center content vertically
            borderWidth: 1, // Border width
            borderColor: 'gray', // Border color
          }}
        >
          <Image
            source={require('/Users/adithc/myLISD-Student/assets/google.png')}
            style={{ width: 30, height: 30, marginRight: 10 }} // Adjust dimensions as needed
          />
          <Text>Sign In With Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Login;
