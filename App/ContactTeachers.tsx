import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

interface Teacher {
  name: string;
  class: string;
  email: string;
  imageUrl: string;
}

const teachers: Teacher[] = [
  {
    name: "John Doe",
    class: "AP Calculus BC",
    email: "adith.chandraiah@gmail.com",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/5b56c01f9f877051fa238ca3/1573759915619-1LGAQ3NCIULHNEZ1OY87/Ray.jpg",
  },
  {
    name: "Jane Smith",
    class: "AP English Language and Composition",
    email: "janesmith@example.com",
    imageUrl: "https://media.istockphoto.com/id/1151796047/photo/laughing-mature-businesswoman-wearing-glasses-posing-on-grey-studio-background.jpg?s=612x612&w=0&k=20&c=Nkb3aDxmf2g_-zFqq0j97x8J_V9asEq5XUpPJU4wxLc=",
  },
  // Add more teachers here
];

const ItemView = ({ item }: { item: Teacher }) => {
  const handleEmailPress = () => {
    Linking.openURL(`mailto:${item.email}`);
  };

  return (
    <TouchableOpacity style={styles.articleContainer} onPress={handleEmailPress}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.source}>{item.class}</Text>
      </View>
      <Icon name="chevron-right" size={30} color="gray" />
    </TouchableOpacity>
  );
};

const ItemSeparatorView = () => {
  return (
    // FlatList Item Separator
    <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8' }} />
  );
};

const ContactTeachersScreen = () => {
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Contact Teachers</Text>
      <FlatList
        data={teachers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={ItemView}
        ItemSeparatorComponent={ItemSeparatorView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 5,
    color: "#005987",
  },
  articleContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  image: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  source: {
    fontSize: 14,
    color: 'grey',
  },
});

export default ContactTeachersScreen;
