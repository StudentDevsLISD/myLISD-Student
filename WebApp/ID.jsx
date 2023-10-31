import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import Barcode from 'react-native-barcode-svg';
import axios from 'axios';
import base64js from 'base64-js';
import { storeData, retrieveData } from './storage.js';
import { LISD_CLIENT_AUTH_UN, LISD_CLIENT_AUTH_PWD, LISD_API_KEY } from '@env';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';

const getImageDataAPI = async () => {
  try {
    const storedIDNum = await retrieveData('studentID');
    const data = { "student": storedIDNum };
    const response = await axios.post(
      'https://api.leanderisd.org/portal/getPicture',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          clientAuthUN: LISD_CLIENT_AUTH_UN,
          clientAuthPwd: LISD_CLIENT_AUTH_PWD,
        },
        params: {
          APIKey: LISD_API_KEY,
        },
        responseType: 'arraybuffer', 
      }
    );

    const imageData = base64js.fromByteArray(new Uint8Array(response.data));
    const mimeType = response.headers['content-type'];

    if (imageData && imageData !== '') {
      const base64ImageData = `data:${mimeType};base64,${imageData}`;
      await storeData('imageData', base64ImageData);
      return base64ImageData;
    } else {
      throw new Error('Image data is empty or null');
    }
  } catch (error) {
    console.log('API error:', error);
    throw error;
  }
};

const ID = () => {
  const [selectedScreen, setSelectedScreen] = useState(0);
  const [localImageData, setLocalImageData] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [grade, setGrade] = useState(null);
  const [studentID, setStudentIDNum] = useState(null);

  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;

  useEffect(() => {
    const fetchData = async () => {
      const storedFirstName = await retrieveData('firstName');
      const storedLastName = await retrieveData('lastName');
      const storedGrade = await retrieveData('grade');
      const storedIDNum = await retrieveData('studentID');

      setFirstName(storedFirstName);
      setLastName(storedLastName);
      setGrade(Number(storedGrade));
      setStudentIDNum(storedIDNum);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const storedImageData = await retrieveData('imageData');
        if (!storedImageData) {
          const newImageData = await getImageDataAPI();
          setLocalImageData(newImageData);
        } else {
          setLocalImageData(storedImageData);
        }
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    loadImage();
  }, []);

  const options = [
    { label: 'Student ID', value: 0 },
    { label: 'SmartTag', value: 1 },
  ];

  const FirstScreen = () => (
    <View>
      <Image
        style={styles.IDsIDCard}
        source={require('../assets/VRHS_ID_Rounded.png')}
      />
      <Text style={styles.IDsFirstName}>{firstName || 'N/A'}</Text>
      <Text style={styles.IDsLastName}>{lastName || 'N/A'}</Text>
      <Text style={styles.IDsGrade}>{"Grade: " + (grade || 'N/A')}</Text>
      <Text style={styles.IDsIDNum}>{"#" + (studentID || 'N/A')}</Text>
      {localImageData ? (
        <Image
          style={styles.IDsIDPic}
          source={{ uri: localImageData }}
        />
      ) : null}
      {studentID ? (
        <View style={styles.IDsBarcodeContainer}>
          <Barcode value={studentID.toString()} format="CODE39" height={50} />
        </View>
      ) : null}
    </View>
  );

  const SecondScreen = () => (
    <View style={styles.IDsSecondScreenContainer}>
      <Image
        style={styles.IDsSmartTag}
        source={require('../assets/SmartTagID.png')}
      />
      <Text style={styles.IDsFirstName2}>{firstName || 'N/A'}</Text>
      <Text style={styles.IDsLastName2}>{lastName || 'N/A'}</Text>
      {studentID ? (
        <View style={styles.IDsBarcodeContainer2}>
          <Barcode value={studentID.toString()} format="CODE39" height={60} />
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.IDsContainer}>
      <SwitchSelector
        options={options}
        initial={0}
        onPress={(value) => setSelectedScreen(value)}
        style={styles.IDsSwitchSelector}
        buttonColor={'#3495eb'}
        backgroundColor={theme === 'dark' ? '#111' : '#FFF'}
        textColor={theme === 'dark' ? '#FFF' : '#111'}
        animationDuration={200}
      />
      {selectedScreen === 0 ? <FirstScreen /> : <SecondScreen />}
    </View>
  );
};

export default ID;
