import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './AppRunner';
import Login from './Login';

const Stack = createStackNavigator();

const Navigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkAuthentication = async () => {
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
  
      if (username && password) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
  
    checkAuthentication();
  }, []);
  return (
    <NavigationContainer>
      {isLoading ? (
        // You can show a loading indicator while checking AsyncStorage
        <Text>Loading...</Text>
      ) : isAuthenticated ? (
        // If the user is authenticated, navigate to the Home screen
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            children={() => <Home/>}
            options={{
            headerShown: false,
            }}
            />
        </Stack.Navigator>
      ) : (
        // If the user is not authenticated, show the Login screen
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
  
}

export default Navigation;