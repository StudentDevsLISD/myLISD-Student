import React, { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC = ({ children }) => {
  const colorScheme = useColorScheme();

  const [theme, setTheme] = useState<ThemeType>('light');

  // Function to set the user's theme preference in AsyncStorage
  const saveThemePreference = async (value: ThemeType) => {
    try {
      await AsyncStorage.setItem('@theme_preference', value);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Function to check if it's the first time the app is opened
  const isFirstTimeOpen = async () => {
    try {
      const value = await AsyncStorage.getItem('@first_time_open');
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
        AsyncStorage.setItem('@first_time_open', 'false').catch((error) => {
          console.error('Error setting first time open:', error);
        });
      } else {
        // Retrieve the user's dark mode preference from AsyncStorage
        AsyncStorage.getItem('@theme_preference').then((value) => {
          if (value === 'dark' || value === 'light') {
            setTheme(value);
          }
        }).catch((error) => {
          console.error('Error retrieving theme preference:', error);
        });
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
