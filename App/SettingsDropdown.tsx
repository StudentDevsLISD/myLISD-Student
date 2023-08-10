import React, { useContext, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { HandleLogout } from './AppRunner';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';

type Props = {
  handleLogout: HandleLogout;
  handleHACLogout: any;
};

const SettingsScreen: React.FC<Props> = ({ handleLogout, handleHACLogout }) => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;

  const handleLogoutPress = async () => {
    await handleLogout(navigation);
  };

  const handleHACLogoutPress = async () => {
    await handleHACLogout(navigation);
  };

  return (
    <View style={[styles.SettingsContainer]}>
      <View style={styles.SettingsSettingRow}>
        <Text style={[styles.SettingsSettingText]}>Dark Mode</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#767577' }}
          thumbColor={theme === 'dark' ? '#fff' : '#fff'}
          onValueChange={toggleTheme}
          value={theme === 'dark'}
        />
      </View>
      <TouchableOpacity
        style={styles.SettingsHACLogoutButton}
        onPress={handleHACLogoutPress}
      >
        <Icon name="sign-out" size={24} color="#fff" />
        <Text style={styles.SettingsLogoutButtonText}>Log Out of HAC</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.SettingsLogoutButton} onPress={handleLogoutPress}>
        <Icon name="sign-out" size={24} color="#fff" />
        <Text style={styles.SettingsLogoutButtonText}>Log Out of App</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
