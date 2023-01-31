import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const Tab1Screen = () => (
  <View>
    <Text>Tab 1</Text>
  </View>
);

const Tab2Screen = () => (
  <View>
    <Text>Tab 2</Text>
  </View>
);

const Tab3Screen = () => (
  <View>
    <Text>Tab 3</Text>
  </View>
);

const Tab4Screen = () => (
  <View>
    <Text>Tab 4</Text>
  </View>
);

const Tab5Screen = () => (
  <View>
    <Text>Tab 5</Text>
  </View>
);

const App = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen
        name="Tab1"
        component={Tab1Screen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="ios-home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tab2"
        component={Tab2Screen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="ios-search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tab3"
        component={Tab3Screen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="ios-heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tab4"
        component={Tab4Screen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="ios-settings" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tab5"
        component={Tab5Screen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="ios-person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default App;
