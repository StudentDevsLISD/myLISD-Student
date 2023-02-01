import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const Tab1Screen = () => (
  <View>
    <Text>Home</Text>
  </View>
);

const Tab2Screen = () => (
  <View>
    <Text>Portal</Text>
  </View>
);

const Tab3Screen = () => (
  <View>
    <Text>IDs</Text>
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

const LISDHub = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Tab1Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Portal"
        component={Tab2Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-marker" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="IDs"
        component={Tab3Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="credit-card" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Club Hub"
        component={Tab4Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={Tab5Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bullhorn" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default LISDHub;
