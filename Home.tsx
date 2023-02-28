import React from 'react';
import { View, Text, StyleSheet, Image, TurboModuleRegistry } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Portal from './Portal';
const Tab = createBottomTabNavigator();

const Tab1Screen = () => (
  <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('./assets/lisd.png')}
        />      
    </View>
);

const Tab2Screen = () => (
  <Portal />
);

const Tab3Screen = () => (
  <View>
    <Image
      style={styles.IDCard} 
      source={require('./assets/VRHS_ID_Rounded.png')}
      />

  </View>
);

const Tab4Screen = () => (
  <View>
    <Text>Club Hub</Text>
  </View>
);

const Tab5Screen = () => (
  <View>
    <Text>Community</Text>
  </View>
);

const Home = () => (
  <NavigationContainer independent = {true}>
    <Tab.Navigator>
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
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  logo: {
    height: 100,
    width: 250,
    marginTop: 5,
    alignSelf: "center",
  },
  header: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
  },
  headerLeft: {
    textAlign: "left",
  },
  headerRight: {
    textAlign: "right",
  },
  body: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  bodyText: {
    fontSize: 16,
    marginVertical: 10,
  },
  IDCard: {
    height: 650,
    width: 550,
    resizeMode: 'contain',
    transform: [{rotate: '90deg'}],
    alignSelf: 'center',
  }
});

export default Home;