import React, { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeData, retrieveData, removeItem } from './storage.js';


export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();

  const [theme, setTheme] = useState('light');

  // Function to set the user's theme preference in AsyncStorage
  const saveThemePreference = async (value) => {
    try {
      await storeData('@theme_preference', value);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Function to check if it's the first time the app is opened
  const isFirstTimeOpen = async () => {
    try {
      const value = await retrieveData('@first_time_open');
      return value === null;
    } catch (error) {
      console.error('Error checking first time open:', error);
      return false;
    }
  };

  useEffect(() => {
    // Check if it's the first time the app is opened
    isFirstTimeOpen().then((firstTime) => {
      if (firstTime) {
        // Set the default mode based on user's system preference
        setTheme(colorScheme === 'dark' ? 'dark' : 'light');
        // Save the user's dark mode preference in AsyncStorage
        saveThemePreference(colorScheme === 'dark' ? 'dark' : 'light');
        // Mark that the app has been opened for the first time
        try {
          storeData('@first_time_open', 'false')
        } catch (error) {
          console.error('Error setting first time open:', error);
        }
        
      } else {
        // Retrieve the user's dark mode preference from AsyncStorage
        themePref = retrieveData('@theme_preference')
        try {
          if (themePref === 'dark' || themePref === 'light') {
            setTheme(themePref);
          }
        } catch (error) {
          console.error('Error retrieving theme preference:', error);
        };
      }
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveThemePreference(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
