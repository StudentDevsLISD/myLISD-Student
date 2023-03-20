import React, { useEffect, useState } from 'react';
import { StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { TouchableOpacity, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const setFavUrl = "http://192.168.86.33:18080/addFavorite";
const removeFavUrl = "http://192.168.86.33:18080/withdrawFavorite";

interface Props {
    title: string;
    onPress: () => void;
    styleCont?: StyleProp<ViewStyle>;
    styleText?: StyleProp<ViewStyle>;
    theDate: Date;
    initiallyLiked: boolean;
    disabled: boolean;
    doOne: () => void;
    
}

const PortalButton = ({ doOne, disabled, initiallyLiked, theDate, title, onPress, styleCont, styleText}: Props) => {
    const [isLiked, setIsLiked] = useState(initiallyLiked);
    const [isDisabled, setIsDisabled] = useState(disabled);

    useEffect(() => {
        setIsLiked(initiallyLiked);
    }, [initiallyLiked]);

    useEffect(() => {
        setIsDisabled(disabled);
    }, [disabled]);

    const handleLike = async (isLiked: boolean) => {
        try {
            const username = await AsyncStorage.getItem('username');
            const password = await AsyncStorage.getItem('password');
            console.log(title);
            const data = { username: username, password: password, favorite: title };
            if(!isLiked){
            const response = await axios.post(setFavUrl, data, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            setIsLiked(true);
            } else {
                const response = await axios.post(removeFavUrl, data, {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                  setIsLiked(false);
            }
            
        } catch (error) {
            console.log(error);
          }
        doOne;
    };
    return(
        <TouchableOpacity disabled = {isDisabled} onPress={onPress} style={styleCont}>
            <Text style={styleText}>{title}</Text>
            <TouchableOpacity
                onPress={() => handleLike(isLiked)}
                style={styles.likeButton}
                activeOpacity={0.7}
      >
                <FontAwesome
                    name={isLiked ? 'star' : 'star-o'}
                    color={isLiked ? 'green' : '#333'}
                    size={30}
                />
            </TouchableOpacity>  
        </TouchableOpacity>
    );
  
};
const styles = StyleSheet.create({
    likeButton: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
        borderRadius: 100,
        width: 30,
        height: 30,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginHorizontal: 10,
        //marginVertical: 10,
        alignSelf: 'flex-end'
      },
  });
export default PortalButton;