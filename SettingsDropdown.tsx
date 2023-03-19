import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer, useNavigation, CommonActions, NavigationProp } from '@react-navigation/native';
import { HandleLogout } from './Home'; 

type Props = {
    handleLogout: HandleLogout;
  };

const SettingsDropdown: React.FC<Props> = ({ handleLogout }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
        <Icon name="cog" size={24} color="#000" />
      </TouchableOpacity>
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={async () => {
                await handleLogout(navigation);
            }}>
            <Text style={styles.menuItem}>Log out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    position: 'absolute',
    right: 0,
    top: 40,
    width: 120,
  },
  menuItem: {
    fontSize: 16,
    padding: 5,
  },
});

export default SettingsDropdown;
