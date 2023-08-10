import React, { useContext } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';

const SplashScreen = () => {
  
  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;
  
  return (
    <View style={styles.SplashScreenContainer}>
      <Image
        source={require('../assets/SplashScreen.webp')}
        style={styles.SplashScreenLogo}
      />
    </View>
  );
};

export default SplashScreen;