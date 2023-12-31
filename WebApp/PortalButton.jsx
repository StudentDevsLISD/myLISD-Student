import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, StyleProp, ViewStyle, Text, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const mainurl = "https://api.leanderisd.org/portal"
const setFavUrl = mainurl + "/addFavorite";
const removeFavUrl = mainurl + "/removeFavorite";
import { LISD_CLIENT_AUTH_UN, LISD_CLIENT_AUTH_PWD, LISD_API_KEY } from '@env';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import { storeData, retrieveData, removeItem } from './storage.js';



const PortalButton = ({
  schedule_id,
  disabled,
  initiallyLiked,
  theDate,
  title,
  onPress,
  styleCont,
  styleText,
  //onLikeButtonPressed
}) => {
  const [isLiked, setIsLiked] = useState(initiallyLiked);
  const [isDisabled, setIsDisabled] = useState(disabled);

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;

  useEffect(() => {
    setIsLiked(initiallyLiked);
  }, [initiallyLiked]);

  useEffect(() => {
    setIsDisabled(disabled);
  }, [disabled]);

  const handleLike = async (isLiked, yes, schedID) => {
    if (yes) {
      return;
    }
    try {
      const idNum = await retrieveData('studentID');
      console.log(title);
      const data = {
        student: idNum,
        schedule_id: schedID,
      };
      if (!isLiked) {
        const response = await axios.post(setFavUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '/',
                'clientAuthUN': LISD_CLIENT_AUTH_UN,
                'clientAuthPwd': LISD_CLIENT_AUTH_PWD,
                },
                params: {
                APIKey: LISD_API_KEY,
                }
                });
                setIsLiked(true);
                //onLikeButtonPressed(title, true);
                } else {
                const response = await axios.post(removeFavUrl, data, {
                headers: {
                'Content-Type': 'application/json',
                'Accept': '/',
                'clientAuthUN': LISD_CLIENT_AUTH_UN,
                'clientAuthPwd': LISD_CLIENT_AUTH_PWD,
                },
                params: {
                APIKey: LISD_API_KEY,
                }
                });
                setIsLiked(false);
                //onLikeButtonPressed(title, false);
                }
                } catch (error) {
                console.log(error);
                }
                };
                
                return (
                <TouchableOpacity
                disabled={isDisabled}
                onPress={onPress}
                style={[styles.PortalButtonContainer, styleCont]}
                >
                <Text style={[styles.PortalButtonTitle, styleText]}>{title}</Text>
                <TouchableOpacity
                onPress={() =>
                isDisabled ? handleLike(isLiked, true, schedule_id) : handleLike(isLiked, false, schedule_id)
                }
                style={styles.PortalButtonLikeButton}
                activeOpacity={0.7}
                >
                <FontAwesome
                name={isLiked ? 'star' : 'star-o'}
                size={20}
                style={styles.PortalButtonLikeIcon}
                />
                </TouchableOpacity>
                </TouchableOpacity>
                );
                };
                
                const styles = StyleSheet.create({
                container: {
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor: '#f5f5f5',
                borderRadius: 15,
                marginVertical: 5,
                marginHorizontal: 10,
                },
                title: {
                fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
                fontWeight: '500',
                fontSize: 17,
                marginRight: 10,
                color: '#333',
                },
                likeButton: {
                backgroundColor: '#f5f5f5',
                borderWidth: 1,
                borderColor: '#eaeaea',
                borderRadius: 15,
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 15,
                },
                likeIcon: {
                color: '#007aff',
                },
                });
                
                export default PortalButton;
