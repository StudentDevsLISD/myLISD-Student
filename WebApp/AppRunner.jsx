// Importing necessary libraries and components
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsDropdown from './SettingsDropdown';
import NetInfo from '@react-native-community/netinfo';
import Home from './Home';
import Portal from './Portal';
import { ActivityIndicator } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen';
import SettingsScreen from './SettingsDropdown';
import Grades from './Grades';
import HAC from './HAC';
import GPA from './GPA';
import Attendance from './Attendance';
import ClassSchedule from './ClassSchedule';
import ContactTeachers from './ContactTeachers';
import MentalHealthScreen from './MentalHealth.jsx';
import Assignments from './AssignmentScreen';
import { ThemeContext, ThemeProvider } from './ThemeContext';
import NewsScreen from './NewsScreen.jsx';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import QuickLinks from './QuickLinks';
import { storeData, retrieveData, removeItem } from './storage.js';

// Creating bottom tab navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
// Logout function, removes user credentials from AsyncStorage and redirects to Login screen
const handleLogout = async (navigation) => {
  await removeItem('username');
  await removeItem('password');
  navigation.navigate('Login');
};
const screenHeight = Dimensions.get("window").height;

const handleHACLogout = async (navigation) => {
  await removeItem('hacusername');
  await removeItem('hacpassword');
  navigation.navigate('Grades', { justLoggedOut: true });
};


// Typing for the logout function
export const HandleLogout = (navigation) => {};

// First tab screen
// This screen checks for internet connection and display the Home component if connected
const Tab1Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;

  useEffect(() => {
    // Checking for internet connectivity
    NetInfo.fetch().then(state => {
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });
    // Subscribing to connectivity changes
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });
    // Unsubscribing to connectivity changes when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  // Displaying Home component if connected, else displaying offline message
  return (
    <>
      {isConnected ? (
        <Home />
      ) : (
        <View style={styles.AppRunnerOfflineContainer}>
          <Icon name="wifi" size={32} color="#888" />
          <Text style={styles.AppRunnerOfflineText}>No Internet Connection</Text>
        </View>
      )}
    </>
  );
};

// Second tab screen
// This screen allows the user to switch between main and sub campus and checks for internet connection to display the Portal component
const Tab2Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);
  const [campus, setCampus] = useState("");
  const [school, setSchool] = useState("");
  const [subCampus, setSubCampus] = useState("");
  const [isMainCampusSelected, setIsMainCampusSelected] = useState(true);

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;
  
  useEffect(() => {
    const setTheCampuses = async () => {
      // Retrieving campus and subcampus details from AsyncStorage
      var x = await retrieveData("campus");
      var y = await retrieveData("subcampus");
      setCampus(x ?? "");
      setSubCampus(y ?? x ?? "");

      // Setting initial value of school based on selected campus
      setSchool(isMainCampusSelected ? (x ?? "") : (y ?? x ?? ""));
    };
    setTheCampuses();
  }, []);

  // Switching between main and sub campus
  const switchCampus = () => {
    setIsMainCampusSelected(!isMainCampusSelected);
    setSchool(isMainCampusSelected ? subCampus : campus);
  };

  // Adding Switch Campus button to the header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={switchCampus}>
          <Text style={{ marginRight: 10 }}>
            {isMainCampusSelected ? " " : " "}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isMainCampusSelected]);

  // Checking for internet connectivity
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation, school]);

  // Displaying ActivityIndicator till campus and school values are retrieved
  if (campus === "" || school === "") {
    return (
      <View style={styles.AppRunnerOfflineContainer}>
        <ActivityIndicator animating={true} size="large" color="#005a87" />
      </View>
    );
  }
  // Displaying Portal component if connected, else displaying offline message
  return (
    <>
      {isConnected ? (
        <Portal campus={school} />
      ) : (
        <View style={styles.AppRunnerOfflineContainer}>
          <Icon name="wifi" size={32} color="#888" />
          <Text style={styles.AppRunnerOfflineText}>No Internet Connection</Text>
        </View>
      )}
    </>
  );
};

// Third tab screen
// This screen displays the IDs component
const Tab3Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;

  // Checking for internet connectivity
  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);
 
  return <Home />;
};

// Fourth tab screen
// This screen checks for internet connection and display the Grades component if connected
const Tab4Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;

  // Checking for internet connectivity
  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  // Displaying Grades component if connected, else displaying offline message
  return (
    <>
      {isConnected ? (
        <HAC/>
      ) : (
        <View style={styles.AppRunnerOfflineContainer}>
          <Icon name="wifi" size={32} color="#888" />
          <Text style={styles.AppRunnerOfflineText}>No Internet Connection</Text>
        </View>
      )}
    </>
  );
};

// Fifth tab screen
// This screen checks for internet connection and display the Settings component if connected
const Tab5Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;

  // Checking for internet connectivity
  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  // Displaying SettingsScreen component if connected, else displaying offline message
  return (
    <>
      {isConnected ? (
        <SettingsScreen handleLogout={handleLogout} handleHACLogout={handleHACLogout}/>
      ) : (
        <View style={styles.AppRunnerOfflineContainer}>
          <Icon name="wifi" size={32} color="#888" />
          <Text style={styles.AppRunnerOfflineText}>No Internet Connection</Text>
        </View>
      )}
    </>
  );
};

// Styling options for the tab bar
const stackOptions = {
  headerTitle: () => (
    <View style={{ alignItems: 'center',       headerTitleAlign: 'center', marginLeft: 25, marginBottom: -22,  }}>
      <Image source={require('../assets/lisd_white_2.jpg')} style={{ width: 258, height: 68, marginBottom: 12,}} />
    </View>
  ),
  headerStyle: {
    backgroundColor: '#005a87',
    height: screenHeight*0.16,
  },
};

const Tabs = () => {

  const { theme } = useContext(ThemeContext);

  const tabBarOptions = {
    headerTitle: () => (
      <View style={{ alignItems: 'center' }}>
        <Image source={require('../assets/lisd_white_2.jpg')} style={{ width: 258, height: 68, marginBottom: 11, alignSelf: 'center' }} />
      </View>
    ),
    headerStyle: {
      backgroundColor: '#005a87',
      height: screenHeight * 0.16,
    },
    tabBarStyle: {
      backgroundColor: theme === 'light' ? 'white' : '#111', // Set the background color of the tab bar to black
      paddingTop: 10,
      height: screenHeight * 0.1
    },
    tabBarActiveTintColor: theme === 'dark' ? '#ede1d1' : '#007AFF',
    tabBarInactiveTintColor: theme === 'dark' ? '#666666' : '#8E8E93'
    // ... other options ...
  };

  return(
  <Tab.Navigator screenOptions={tabBarOptions}>
        <Tab.Screen
          name="Home"
          component={Tab1Screen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
            headerShown: false
          }}
        />
        <Tab.Screen
          name="Portal"
          component={Tab2Screen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="map-marker" color={color} size={size} />,
            headerShown: false
          }}
        />
        <Tab.Screen
          name="IDs"
          component={Tab3Screen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="credit-card" color={color} size={size} />,
            headerShown: false
          }}
        />
        <Tab.Screen
          name="HAC"
          component={Tab4Screen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="pencil" color={color} size={size} />,
            headerShown: false
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Tab5Screen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="gear" color={color} size={size} />,
            headerShown: false
          }}
        />
      </Tab.Navigator>
  )
}

// Main component to run the app
const AppRunner = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  // Simulate loading screen for 1500 milliseconds
  useEffect(() => {
    setTimeout(() => {
      setIsAppReady(true);
    }, 1500);
  }, []);

  // Display splash screen till the app is ready
  if (!isAppReady) {
    return <SplashScreen />;
  }

  // Set the main Navigator with 5 different tabs
  return (
    <ThemeProvider>
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name ="HomeScreen" component={Tabs} options={{ headerShown: true}}/>
      <Stack.Screen name ="HAC" component={HAC} options={{ headerShown: true}}/>
      <Stack.Screen name ="Grades" component={Grades} options={{ headerShown: true}}/>
      <Stack.Screen name ="GPA" component={GPA} options={{ headerShown: true}}/>
      <Stack.Screen name ="Attendance" component={Attendance} options={{ headerShown: true}}/>
      <Stack.Screen name ="ClassSchedule" component={ClassSchedule} options={{ headerShown: true}}/>
      <Stack.Screen name ="ContactTeachers" component={ContactTeachers} options={{ headerShown: true}}/>
      <Stack.Screen name ="AssignmentScreen" component={Assignments} options={{ headerShown: true}}/>
      <Stack.Screen name ="MentalHealthScreen" component={MentalHealthScreen} options={{ headerShown: true}}/>
      <Stack.Screen name ="NewsScreen" component={NewsScreen} options={{ headerShown: true}}/>
      <Stack.Screen name ="QuickLinks" component={QuickLinks} options={{ headerShown: true}}/>
    </Stack.Navigator>
    </ThemeProvider>
  );
};

export default AppRunner;
