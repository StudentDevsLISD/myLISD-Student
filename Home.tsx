import React from 'react';
import { View, Text, StyleSheet, Image, TurboModuleRegistry } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Portal from './Portal';
import PeriodTimer from './PeriodTimer';
import ID from './ID';

const Tab = createBottomTabNavigator();

const Tab1Screen = () => (
  <View style={styles.container}>

  <Text style={styles.letter_day}>{'A'}</Text>
    <Text style={styles.letter_day_2}>{'day'}</Text>
    <Text style={styles.date}>{'03/15'}</Text>
    <Text style={styles.day}>{'Wednesday'}</Text>


    <PeriodTimer periodSchedule={[
      { start: new Date('2023-03-15T08:00:00'), duration: 60 },
      { start: new Date('2023-03-15T09:00:00'), duration: 90 },
      { start: new Date('2023-03-15T10:30:00'), duration: 45 },
      { start: new Date('2023-03-15T11:30:00'), duration: 60 },
    ]} />

    {/* <Image
      style={styles.logo}
      source={require('./assets/lisd.png')}
    /> */}

  </View>
);

// rest of the code remains same as before


const Tab2Screen = () => (
  <Portal/>
);

const Tab3Screen = () => (
  <ID/>
);

const Tab4Screen = () => (
  <View>
    <Text>Coming Soon</Text>
  </View>
);

const Tab5Screen = () => (
  <View>
    <Text>Coming Soon</Text>
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
    backgroundColor: "ebe8e8"
  },
  letter_day:{
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 34,
    marginHorizontal: 20,
    marginBottom: 7,
    marginTop: 20,
    fontSize: 80,
    borderWidth: 2,
    borderColor: '#ebe8e8',
    borderRadius: 15,
    paddingBottom: 18,
    paddingTop: -10,
    overflow: 'hidden',
  },
  letter_day_2:{
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 26,
    marginHorizontal: 39,
    marginBottom: 0,
    marginTop: -37,
    height: 100,
    width: 250,
  },
  date: {
    backgroundColor: "#fff",
    marginLeft: 158,
    marginTop: -186,
    fontSize: 66,
    borderWidth: 2,
    borderColor: '#ebe8e8',
    borderRadius: 15,
    paddingBottom: 34,
    paddingTop: 2,
    paddingHorizontal: 20,
    overflow: 'hidden',

  },
  day:{
    fontSize: 15,
    paddingVertical: 0,
    marginHorizontal: 225,
    marginBottom: 0,
    marginTop: -30,
    height: 100,
    width: 250,
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



