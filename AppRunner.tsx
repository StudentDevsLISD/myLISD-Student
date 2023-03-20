import React, {useEffect, useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Image } from 'react-native';
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



const Tab = createBottomTabNavigator();
const handleLogout = async (navigation: NavigationProp<any>) => {
  await AsyncStorage.removeItem('username');
  await AsyncStorage.removeItem('password');
  navigation.navigate('Login')
  // navigation.dispatch(
  //   CommonActions.reset({
  //     index: 0,
  //     routes: [{ name: 'Login' }],
  //   }),
  // );
};
export type HandleLogout = (navigation: NavigationProp<any>) => Promise<void>;


const Tab1Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);
  

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <SettingsDropdown handleLogout={() => handleLogout(navigation)} />,
    });
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
        <Home/>
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <SettingsDropdown handleLogout={() => handleLogout(navigation)} />,
    });
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
  return(
    <>
    {isConnected ? (
      <Portal/>
    ):(
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
    navigation.setOptions({
      headerRight: () => <SettingsDropdown handleLogout={() => handleLogout(navigation)} />,
    });
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
  return(
    <IDs/>
  );
};

const Tab4Screen = () => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <SettingsDropdown handleLogout={() => handleLogout(navigation)} />,
    });
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
  return(
  <>
    {isConnected? (
    <ClubHub/>
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
    navigation.setOptions({
      headerRight: () => <SettingsDropdown handleLogout={() => handleLogout(navigation)} />,
    });
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
  return(
  <>
    {isConnected ? (
    <Community/>
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
      <Image source={require('./assets/lisd_white_2.jpg')} style={{ width: 278, height: 53,  }} />
    </View>
  ),
  headerStyle: {
    backgroundColor: '#005a87',
    height: 100,
  },
};

const AppRunner = () => (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen
        name="Home"
        component={Tab1Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          )}}
      />
      <Tab.Screen
        name="Portal"
        component={Tab2Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-marker" color={color} size={size} />
          )}}
      />
      <Tab.Screen
        name="IDs"
        component={Tab3Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="credit-card" color={color} size={size} />
          )}}
      />
      <Tab.Screen
        name="Club Hub"
        component={Tab4Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="group" color={color} size={size} />
          )}}
      />
      <Tab.Screen
        name="Community"
        component={Tab5Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bullhorn" color={color} size={size} />
          )}}
      />
    </Tab.Navigator>
);

const styles = StyleSheet.create({
  offlineContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  offlineText: {
    marginTop: 8,
    fontSize: 16,
  },
});

export default AppRunner;

