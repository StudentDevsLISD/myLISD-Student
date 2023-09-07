  import React, { useState, useEffect, useContext } from 'react';
  import { View, StyleSheet, Image, Text } from 'react-native';
  import SwitchSelector from 'react-native-switch-selector';
  import Barcode from 'react-native-barcode-svg';
  import RNFS from 'react-native-fs';
  import RNFetchBlob from 'rn-fetch-blob';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  import base64js from 'base64-js';
  const mimeType = 'image/gif';
  import { LISD_CLIENT_AUTH_UN, LISD_CLIENT_AUTH_PWD, LISD_API_KEY } from '@env';
  import { ThemeContext } from './ThemeContext';
  import lightStyles from './LightStyles';
  import darkStyles from './DarkStyles';

  const getImageUrlAPI = async () => {
    try {
      const storedIDNum = await AsyncStorage.getItem('studentID');
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
          responseType: 'arraybuffer', // set the response type to arraybuffer to get the raw image data
        }
      );
  
      const imageData = base64js.fromByteArray(new Uint8Array(response.data)); // convert the raw image data to base64-encoded string
      const mimeType = response.headers['content-type']; // extract the MIME type from the response headers
  
      console.log('Image data:', imageData);
      if (imageData && imageData !== '') {
        await downloadAndSaveImage(
          imageData,
          RNFS.DocumentDirectoryPath + '/',
          mimeType
        ); // pass mimeType as the third argument
        return imageData;
      } else {
        throw new Error('Image data is empty or null');
      }
    } catch (error) {
      console.log('API error:', error);
      throw error;
    }
  };
  
  
  


  const downloadAndSaveImage = async (imageData, imagePath, mimeType) => {
    try {
      // Extract the file extension from the MIME type
      const extension = mimeType.split('/')[1];
      // Construct the file name with the extracted extension
      const fileName = `StudentID.${extension}`;
      
      // Write the image data to the file with the correct extension and format
      await RNFetchBlob.fs.writeFile(`${imagePath}/${fileName}`, imageData, 'base64');
      console.log('Image saved successfully:', `${imagePath}${fileName}`);
    } catch (error) {
      console.error('Error downloading and saving image:', error);
    }
  };
  




  const storeImageUrl = async (imageUrl) => {
    try {
      await AsyncStorage.setItem('imageUrl', imageUrl);
    } catch (error) {
      console.error('Error storing image URL:', error);
    }
  };

  const getStoredImageUrl = async () => {
    try {
      return await AsyncStorage.getItem('imageUrl');
    } catch (error) {
      console.error('Error getting stored image URL:', error);
    }
    return null;
  };


  // const getData = async (key: string) => {
  //   try {
  //     return await AsyncStorage.getItem(key);
  //   } catch (error) {
  //     console.error(`Error getting stored ${key}:`, error);
  //   }
  //   return null;
  // };

  const ID = () => {
    const [selectedScreen, setSelectedScreen] = useState(0);
    const [localImagePath, setLocalImagePath] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [grade, setGrade] = useState<number | null>(null);
    const [studentID, setStudentIDNum] = useState<String>("");
    const [imageUrl, setImageUrl] = useState<String>("");
    //const [studentIDNum, setStudentIDNum] = useState<number | null>(null);

    const { theme } = useContext(ThemeContext);
    const styles = theme === 'light' ? lightStyles : darkStyles;

    //const imageUrl = 'https://smarttagprodweststorage.blob.core.windows.net/07861/photos/student/942584.jpg';
    const imageName = 'StudentID.gif';
    const imagePath = `${RNFS.DocumentDirectoryPath}/${imageName}`;

    useEffect(() => {
      const fetchData = async () => {
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedGrade = await AsyncStorage.getItem('grade');
        const storedIDNum = await AsyncStorage.getItem('studentID');
        console.log(getImageUrlAPI());
        if (!storedFirstName || !storedLastName || !storedGrade || !storedIDNum) {

          setFirstName(storedFirstName);
          setLastName(storedLastName);
          setGrade(Number(storedGrade));
          setStudentIDNum(String(storedIDNum));
        } else {
          // Set state variables from stored data
          setFirstName(storedFirstName);
          setLastName(storedLastName);
          setGrade(Number(storedGrade));
          setStudentIDNum(String(storedIDNum));
        }
      };

      fetchData();
    }, []);

  

    useEffect(() => {
      const loadImage = async () => {
        const storedImageUrl = await getStoredImageUrl();
      
        if (storedImageUrl !== imageUrl) {
          const imageData = await getImageUrlAPI();
          const base64ImageData = `data:image/gif;base64,${imageData}`;
          await downloadAndSaveImage(imageData, RNFS.DocumentDirectoryPath + "/", mimeType);
          storeImageUrl(base64ImageData);
          setLocalImagePath(base64ImageData);
        } else {
          setLocalImagePath(storedImageUrl);
        }
      };
      
      

      RNFS.exists(imagePath)
        .then(async (exists) => {
          if (exists) {
            loadImage();
          } else {
            downloadAndSaveImage(await getImageUrlAPI(), RNFS.DocumentDirectoryPath + '/', mimeType);
            setLocalImagePath(imagePath);
          }
        })
        .catch((error) => {
          console.error('Error checking image existence:', error);
        });
    }, []);

    const options = [
      { label: 'Student ID', value: 0 },
      { label: 'SmartTag', value: 1 },
    ];

    const FirstScreen = () => (
      <View>
        <Image
          style={styles.IDsIDCard}
          source={require('../assets/VRHS_ID_Rounded.png')} //api
        />
        <Text style={styles.IDsFirstName}>{firstName}</Text>
        <Text style={styles.IDsLastName}>{lastName}</Text>
        <Text style={styles.IDsGrade}>{"Grade: " + grade}</Text>
        <Text style={styles.IDsIDNum}>{"#" + studentID}</Text>
        {localImagePath && (
          <Image
          style={styles.IDsIDPic}
          source={{ uri: localImagePath }}
        />
        )}
        <View style={styles.IDsBarcodeContainer}>
          <Barcode value={studentID.toString()} format="CODE39" height={50} />
        </View>
      </View>
    );

    const SecondScreen = () => (
      <View style={styles.IDsSecondScreenContainer}>
        <Image
          style={styles.IDsSmartTag}
          source={require('../assets/SmartTagID.png')}
        />
        <Text style={styles.IDsFirstName2}>{firstName}</Text>
        <Text style={styles.IDsLastName2}>{lastName}</Text>
        <View style={styles.IDsBarcodeContainer2}>
          <Barcode value={studentID.toString()} format="CODE39" height={60} />
        </View>
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
          animationDuration={200}
        />
        {selectedScreen === 0 ? <FirstScreen /> : <SecondScreen />}
      </View>
    );
  };

  

  export default ID;