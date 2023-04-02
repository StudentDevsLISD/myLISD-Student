import React, { useEffect, useState } from 'react';
import { StyleSheet, StyleProp, ViewStyle, Text, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mainurl = "https://api.leanderisd.org/portal"
const setFavUrl = mainurl + "/addFavorite";
const removeFavUrl = mainurl + "/removeFavorite";

interface Props {
  title: string;
  onPress: () => void;
  styleCont?: StyleProp<ViewStyle>;
  styleText?: StyleProp<ViewStyle>;
  theDate: Date;
  initiallyLiked: boolean;
  disabled: boolean;
  schedule_id: number;
}

const PortalButton = ({
  schedule_id,
  disabled,
  initiallyLiked,
  theDate,
  title,
  onPress,
  styleCont,
  styleText,
}: Props) => {
  const [isLiked, setIsLiked] = useState(initiallyLiked);
  const [isDisabled, setIsDisabled] = useState(disabled);

  useEffect(() => {
    setIsLiked(initiallyLiked);
  }, [initiallyLiked]);

  useEffect(() => {
    setIsDisabled(disabled);
  }, [disabled]);

  const handleLike = async (isLiked: boolean, yes: boolean, schedID: number) => {
    if (yes) {
      return;
    }
    try {
      const idNum = await AsyncStorage.getItem('studentID');
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
                'clientAuthUN': 'usrVRHSApiDataAccess',
                'clientAuthPwd': '59kt61&Tm!F5',
                },
                params: {
                APIKey: '6cbc0628-6147-4670-8be7-a8bc91206e2b',
                }
                });
                setIsLiked(true);
                } else {
                const response = await axios.post(removeFavUrl, data, {
                headers: {
                'Content-Type': 'application/json',
                'Accept': '/',
                'clientAuthUN': 'usrVRHSApiDataAccess',
                'clientAuthPwd': '59kt61&Tm!F5',
                },
                params: {
                APIKey: '6cbc0628-6147-4670-8be7-a8bc91206e2b',
                }
                });
                setIsLiked(false);
                }
                } catch (error) {
                console.log(error);
                }
                };
                
                return (
                <TouchableOpacity
                disabled={isDisabled}
                onPress={onPress}
                style={[styles.container, styleCont]}
                >
                <Text style={[styles.title, styleText]}>{title}</Text>
                <TouchableOpacity
                onPress={() =>
                isDisabled ? handleLike(isLiked, true, schedule_id) : handleLike(isLiked, false, schedule_id)
                }
                style={styles.likeButton}
                activeOpacity={0.7}
                >
                <FontAwesome
                name={isLiked ? 'star' : 'star-o'}
                size={20}
                style={styles.likeIcon}
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
