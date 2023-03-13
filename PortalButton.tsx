import React, { Component, useEffect, useState } from 'react';
import { Button, ScrollView, View, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip'; // import CalendarStrip
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const setFavUrl = "http://192.168.86.23:18080/addFavorite";
const removeFavUrl = "http://192.168.86.23:18080/withdrawFavorite";

interface Props {
    title: string;
    onPress: () => void;
    styleCont?: StyleProp<ViewStyle>;
    styleText?: StyleProp<ViewStyle>;
    theDate: Date;
    initiallyLiked: boolean;
    
}

const PortalButton = ({ initiallyLiked, theDate, title, onPress, styleCont, styleText}: Props) => {
    const [isLiked, setIsLiked] = useState(initiallyLiked);

    useEffect(() => {
        setIsLiked(initiallyLiked);
    }, [initiallyLiked]);

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
    };
    return(
        <TouchableOpacity onPress={onPress} style={styleCont}>
            <Text style={styleText}>{title}</Text>
            <TouchableOpacity
                onPress={() => handleLike(isLiked)}
                style={styles.likeButton}
                activeOpacity={0.7}
      >
                <FontAwesome
                    name={isLiked ? 'heart' : 'heart-o'}
                    color={isLiked ? 'red' : '#333'}
                    size={20}
                />
            </TouchableOpacity>  
        </TouchableOpacity>
    );
  
};
const styles = StyleSheet.create({
    likeButton: {
        backgroundColor: '#FFFFFF',
        elevation: 8,
        borderRadius: 50,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
      },
  });
export default PortalButton;