// import React from 'react';
// import { View, Text, StyleSheet, Image } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const Tab = createBottomTabNavigator();

// const Tab1Screen = () => (
//   <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={[styles.headerText, styles.headerLeft]}>Left Text</Text>
//         <Text style={[styles.headerText, styles.headerRight]}>Right Text</Text>
//       </View>
//       <View style={styles.body}>
//         <Text style={styles.bodyText}>Text 1</Text>
//         <Text style={styles.bodyText}>Text 2</Text>
//         <Text style={styles.bodyText}>Text 3</Text>
//         {/* Add more text components as needed */}
//       </View>
//     </View>
// );

// const Tab2Screen = () => (
//   <View>
//     <Text>Portal</Text>
//   </View>
// );

// const Tab3Screen = () => (
//   <View>
//     <Image
//       style={styles.IDCard} 
//       source={require('./assets/VRHS_ID_Rounded.png')}
//       />

//   </View>
// );

// const Tab4Screen = () => (
//   <View>
//     <Text>Club Hub</Text>
//   </View>
// );

// const Tab5Screen = () => (
//   <View>
//     <Text>Community</Text>
//   </View>
// );

// const LISDHub = () => (
//   <NavigationContainer>
//     <Tab.Navigator>
//       <Tab.Screen
//         name="Home"
//         component={Tab1Screen}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="home" color={color} size={size} />
//           )}}
//       />
//       <Tab.Screen
//         name="Portal"
//         component={Tab2Screen}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="map-marker" color={color} size={size} />
//           )}}
//       />
//       <Tab.Screen
//         name="IDs"
//         component={Tab3Screen}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="credit-card" color={color} size={size} />
//           )}}
//       />
//       <Tab.Screen
//         name="Club Hub"
//         component={Tab4Screen}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="group" color={color} size={size} />
//           )}}
//       />
//       <Tab.Screen
//         name="Community"
//         component={Tab5Screen}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="bullhorn" color={color} size={size} />
//           )}}
//       />
//     </Tab.Navigator>
//   </NavigationContainer>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   header: {
//     width: "100%",
//     height: 50,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//   },
//   headerText: {
//     fontSize: 20,
//   },
//   headerLeft: {
//     textAlign: "left",
//   },
//   headerRight: {
//     textAlign: "right",
//   },
//   body: {
//     width: "100%",
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "flex-start",
//     paddingHorizontal: 20,
//   },
//   bodyText: {
//     fontSize: 16,
//     marginVertical: 10,
//   },
//   IDCard: {
//     height: 650,
//     width: 550,
//     resizeMode: 'contain',
//     transform: [{rotate: '90deg'}],
//     alignSelf: 'center',
//   }
// });

// export default LISDHub;
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Home from './Home';
import { Text } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
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

export default App;