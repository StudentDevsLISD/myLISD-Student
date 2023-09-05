import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, Text, Linking, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, CommonActions, NavigationProp } from '@react-navigation/native';
import Navigation from './Navigation';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import axios from 'axios';
import { IP_ADDRESS } from '@env';
import { ActivityIndicator } from 'react-native-paper';






const ItemView = ({ item, navigation }) => {
  
  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;
  
  
  return (
    <TouchableOpacity style={styles.NewsScreenArticleContainer} onPress={() => 
    Linking.openURL(item.url)
    //   navigation.dispatch(
    //     CommonActions.navigate({
    //       name: "WebViewScreen",
    //       params: { url: item.url }
    //     }
    //     )
        
    //   )
    }>
      <Image source={{ uri: item.imageUrl }} style={styles.NewsScreenImage} resizeMode="contain" />
      <View style={styles.NewsScreenTextContainer}>
        <Text style={styles.NewsScreenTitle}>{item.title}</Text>
        <Text style={styles.NewsScreenSource}>{item.source}</Text>
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
const NewsScreen = () => {
  const navigation = useNavigation();  
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://' + IP_ADDRESS + ':8082/news')
      .then((response) => {
        setNewsArticles(response.data.news);
        setLoading(false); // Hide loading indicator
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Hide loading indicator
      });
  }, []);

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

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;

  return (
    
    <ScrollView style={{flex:1}}>
    <View style={styles.NewsScreenContainer}>
      <Text style={styles.NewsScreenSectionTitle}>Top Stories</Text>
      {loading ? (
        <View style={styles.NewsScreenLoadingContainer}>
          <ActivityIndicator
            animating={true}
            size={'large'}
            color={theme === 'light' ? '#005a87' : '#ede1d1'}
          />
        </View>
      ) : (
        <FlatList
          data={newsArticles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ItemView item={item} navigation={navigation} />}
          ItemSeparatorComponent={ItemSeparatorView}
        />
      )}
    </View>
    </ScrollView>
  );
};

export default NewsScreen;
