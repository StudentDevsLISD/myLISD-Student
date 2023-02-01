import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tab2"
        component={Tab2Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tab3"
        component={Tab3Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tab4"
        component={Tab4Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tab5"
        component={Tab5Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default App;
