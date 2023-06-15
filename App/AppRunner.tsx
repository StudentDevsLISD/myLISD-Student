// Importing necessary libraries and components
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsDropdown from './SettingsDropdown';
import NetInfo from '@react-native-community/netinfo';
import Home from './Home';
import Portal from './Portal';
import IDs from './ID';
import ClubHub from './ClubHub';
import Community from './ComOp';
import SplashScreen from './SplashScreen';
import { AuthProvider } from './AuthContext';
import SettingsScreen from './SettingsDropdown';
import Grades from './Grades';
import HAC from './HAC';

// Creating bottom tab navigator
const Tab = createBottomTabNavigator();

// Logout function, removes user credentials from AsyncStorage and redirects to Login screen
const handleLogout = async (navigation: NavigationProp<any>) => {
  await AsyncStorage.removeItem('username');
  await AsyncStorage.removeItem('password');
  navigation.navigate('Login');
};

// Typing for the logout function
export type HandleLogout = (navigation: NavigationProp<any>) => Promise<void>;

// First tab screen
// This screen checks for internet connection and display the Home component if connected
const Tab1Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);

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
        <View style={styles.offlineContainer}>
          <Icon name="wifi" size={32} color="#888" />
          <Text style={styles.offlineText}>No Internet Connection</Text>
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

  useEffect(() => {
    const setTheCampuses = async () => {
      // Retrieving campus and subcampus details from AsyncStorage
      var x = await AsyncStorage.getItem("campus");
      var y = await AsyncStorage.getItem("subcampus");
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
      <View style={styles.offlineContainer}>
        <ActivityIndicator size="large" color="#005a87" />
      </View>
    );
  }
  // Displaying Portal component if connected, else displaying offline message
  return (
    <>
      {isConnected ? (
        <Portal campus={school} />
      ) : (
        <View style={styles.offlineContainer}>
          <Icon name="wifi" size={32} color="#888" />
          <Text style={styles.offlineText}>No Internet Connection</Text>
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
 
  return <IDs />;
};

// Fourth tab screen
// This screen checks for internet connection and display the Grades component if connected
const Tab4Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);

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
        <View style={styles.offlineContainer}>
          <Icon name="wifi" size={32} color="#888" />
          <Text style={styles.offlineText}>No Internet Connection</Text>
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
        <SettingsScreen handleLogout={handleLogout}/>
      ) : (
        <View style={styles.offlineContainer}>
          <Icon name="wifi" size={32} color="#888" />
          <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
      )}
    </>
  );
};

// Styling options for the tab bar
const tabBarOptions = {
  headerTitle: () => (
    <View style={{ alignItems: 'center' }}>
      <Image source={require('../assets/lisd_white_2.jpg')} style={{ width: 258, height: 68, marginBottom: 12,}} />
    </View>
  ),
  headerStyle: {
    backgroundColor: '#005a87',
    height: 125,
  },
};

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
    <AuthProvider>
      <Tab.Navigator screenOptions={tabBarOptions}>
        <Tab.Screen
          name="Home"
          component={Tab1Screen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Portal"
          component={Tab2Screen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="map-marker" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="IDs"
          component={Tab3Screen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="credit-card" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="HAC"
          component={Tab4Screen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="pencil" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Tab5Screen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="gear" color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </AuthProvider>
  );
};

// Styling for offlineContainer and offlineText
const styles = StyleSheet.create({
  offlineContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    marginTop: 8,
    fontSize: 16,
  },
});

// Exporting AppRunner as the default component
export default AppRunner;
