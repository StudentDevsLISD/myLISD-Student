import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';


const ContactUs = () => {
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
    // <WebView
    //   source={{ uri: 'https://www.k12insight.com/Lets-Talk/LetsTalkTabCustom.aspx?k=WKXY9FLT&rnd=1686678916022' }}
    //   style={{ flex: 1 }}
    // />
    <View></View>
  );
};

export default ContactUs;