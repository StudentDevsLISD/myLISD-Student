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



const Tab = createBottomTabNavigator();

const handleLogout = async (navigation: NavigationProp<any>) => {
  await AsyncStorage.removeItem('username');
  await AsyncStorage.removeItem('password');
  navigation.navigate('Login');
};

export type HandleLogout = (navigation: NavigationProp<any>) => Promise<void>;

const Tab1Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);

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

const Tab2Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);
  const [campus, setCampus] = useState("");
  const [school, setSchool] = useState("");
  const [subCampus, setSubCampus] = useState("");
  const [isMainCampusSelected, setIsMainCampusSelected] = useState(true);

  useEffect(() => {
    const setTheCampuses = async () => {
      var x = await AsyncStorage.getItem("campus");
      var y = await AsyncStorage.getItem("subcampus");
      setCampus(x ?? "");
      setSubCampus(y ?? x ?? "");

      // Set the initial value of school based on isMainCampusSelected
      setSchool(isMainCampusSelected ? (x ?? "") : (y ?? x ?? ""));
    };
    setTheCampuses();
  }, []);

  const switchCampus = () => {
    setIsMainCampusSelected(!isMainCampusSelected);
    setSchool(isMainCampusSelected ? subCampus : campus);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={switchCampus}>
          <Text style={{ marginRight: 10 }}>
            {isMainCampusSelected ? "Switch to Sub Campus" : "Switch to Main Campus"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isMainCampusSelected]);

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

  if (campus === "" || school === "") {
    return (
      <View style={styles.offlineContainer}>
        <ActivityIndicator size="large" color="#005a87" />
      </View>
    );
  }
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

const Tab3Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);

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

const Tab4Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);

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

  return (
    <>
      {isConnected ? (
        <Grades/>
      ) : (
        <View style={styles.offlineContainer}>
          <Icon name="wifi" size={32} color="#888" />
          <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
      )}
    </>
  );
};

const Tab5Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);

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

const tabBarOptions = {
  headerTitle: () => (
    <View style={{ alignItems: 'center' }}>
      <Image source={require('../assets/lisd_white_2.jpg')} style={{ width: 258, height: 68, marginBottom: 12, marginLeft: -100,}} />
    </View>
  ),
  headerStyle: {
    backgroundColor: '#005a87',
    height: 125,
  },
};

const AppRunner = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAppReady(true);
    }, 1500);
  }, []);

  if (!isAppReady) {
    return <SplashScreen />;
  }

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
          name="Grades"
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

export default AppRunner;
 
        
