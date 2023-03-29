import React, { useEffect, useState } from 'react';
import { StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { TouchableOpacity, } from 'react-native';
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
    //doOne: () => void;
    schedule_id: Number;
    
}

const PortalButton = ({ schedule_id, disabled, initiallyLiked, theDate, title, onPress, styleCont, styleText}: Props) => {
    const [isLiked, setIsLiked] = useState(initiallyLiked);
    const [isDisabled, setIsDisabled] = useState(disabled);

    useEffect(() => {
        setIsLiked(initiallyLiked);
    }, [initiallyLiked]);

    useEffect(() => {
        setIsDisabled(disabled);
    }, [disabled]);

    const handleLike = async (isLiked: boolean, yes: boolean, schedID: Number) => {
        if(yes){
            return;
        }
        try {
            const idNum = await AsyncStorage.getItem('studentID');
            console.log(title);
            const data = { 
                student: idNum, 
                schedule_id: schedID, 
                };
            if(!isLiked){
            const response = await axios.post(setFavUrl, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
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
                        'Accept': '*/*',
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
        //doOne;
    };
    return(
        <TouchableOpacity disabled = {isDisabled} onPress={onPress} style={styleCont}>
            <Text style={styleText}>{title}</Text>
            <TouchableOpacity
                onPress={() => isDisabled ? handleLike(isLiked, true, schedule_id) : handleLike(isLiked, false, schedule_id)}
                style={styles.likeButton}
                activeOpacity={0.7}
      >
                <FontAwesome
                    name={isLiked ? 'star' : 'star-o'}
                    color={isLiked ? '#3495eb' : '#3495eb'}
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