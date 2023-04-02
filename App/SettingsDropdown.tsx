import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { HandleLogout } from './AppRunner';

type Props = {
  handleLogout: HandleLogout;
};

const SettingsDropdown: React.FC<Props> = ({ handleLogout }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogoutPress = async () => {
    await handleLogout(navigation);
    setMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
        <Icon name="cog" size={35} color="#fff" />
      </TouchableOpacity>
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleLogoutPress}>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    position: 'absolute',
    right: 0,
    top: 50,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    fontSize: 16,
    padding: 5,
    textAlign: 'center',
  },
});

export default SettingsDropdown;
