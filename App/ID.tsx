  import React, { useState, useEffect } from 'react';
  import { View, StyleSheet, Image, Text } from 'react-native';
  import SwitchSelector from 'react-native-switch-selector';
  import Barcode from 'react-native-barcode-svg';
  import RNFS from 'react-native-fs';
  import RNFetchBlob from 'rn-fetch-blob';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  import base64js from 'base64-js';
  const mimeType = 'image/gif';

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
            clientAuthUN: 'usrVRHSApiDataAccess',
            clientAuthPwd: '59kt61&Tm!F5',
          },
          params: {
            APIKey: '6cbc0628-6147-4670-8be7-a8bc91206e2b',
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
  
  
  


  const downloadAndSaveImage = async (imageData: string, imagePath: string, mimeType: string) => {
    try {
      // Extract the file extension from the MIME type
      const extension = mimeType.split('/')[1];
      // Construct the file name with the extracted extension
      const fileName = `StudentID.${extension}`;
      
      // Write the image data to the file with the correct extension and format
      await RNFS.writeFile(imagePath + fileName, imageData, 'base64');
      console.log('Image saved successfully:', imagePath + fileName);
    } catch (error) {
      console.error('Error downloading and saving image:', error);
    }
  };
  




  const storeImageUrl = async (imageUrl: string) => {
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
          await downloadAndSaveImage(imageData, RNFS.DocumentDirectoryPath + '/', mimeType);
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
          style={styles.IDCard}
          source={require('../assets/VRHS_ID_Rounded.png')} //api
        />
        <Text style={styles.firstName}>{firstName}</Text>
        <Text style={styles.lastName}>{lastName}</Text>
        <Text style={styles.grade}>{"Grade: " + grade}</Text>
        <Text style={styles.IDNum}>{"#" + studentID}</Text>
        {localImagePath && (
          <Image
          style={styles.IDPic}
          source={{ uri: localImagePath }}
        />
        )}
        <View style={styles.barcodeContainer}>
          <Barcode value={studentID.toString()} format="CODE39" height={50} />
        </View>
      </View>
    );

    const SecondScreen = () => (
      <View style={styles.secondScreenContainer}>
        <Image
          style={styles.smartTag}
          source={require('../assets/SmartTagID.png')}
        />
        <Text style={styles.firstName2}>{firstName}</Text>
        <Text style={styles.lastName2}>{lastName}</Text>
        <View style={styles.barcodeContainer2}>
          <Barcode value={"944197"} format="CODE39" height={60} />
        </View>
      </View>
    );

    return (
      <View style={styles.container}>
        <SwitchSelector
          options={options}
          initial={0}
          onPress={(value: React.SetStateAction<number>) => setSelectedScreen(value)}
          style={styles.switchSelector}
          buttonColor={'#3495eb'}
          animationDuration={200}
        />
        {selectedScreen === 0 ? <FirstScreen /> : <SecondScreen />}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    IDCard: {
      height: 600,
      width: 550,
      resizeMode: 'contain',
      transform: [{ rotate: '90deg' }],
      alignSelf: 'center',
    },
    secondScreenContainer: {
      position: 'relative',
    },
    smartTag: {
      height: 575,
      width: 525,
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    switchSelector: {
      marginTop: 30,
      marginBottom: 20,
      marginHorizontal: 50,
    },
    firstName: {
      position: 'absolute',
      top: '65%',
      left: 50,
      width: '100%',
      color: 'black',
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'left',
      transform: [{ rotate: '90deg' }],
    },
    lastName: {
      position: 'absolute',
      top: '65%',
      left: 0,
      width: '100%',
      color: 'black',
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'left',
      transform: [{ rotate: '90deg' }],
    },
    barcodeContainer: {
      position: 'absolute',
      top: '42%',
      right: 128,
      width: '100%',
      alignSelf: 'center',
      transform: [{ rotate: '90deg' }],
    },
    grade: {
      position: 'absolute',
      top: '65%',
      right: 50,
      width: '100%',
      color: 'black',
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'left',
      transform: [{ rotate: '90deg' }],
    },
    IDNum: {
      position: 'absolute',
      top: '100%',
      right: 115,
      width: '100%',
      color: 'black',
      fontSize: 20,
      fontWeight: '900',
      textAlign: 'left',
      transform: [{ rotate: '90deg' }],
    },
    IDPic: {
      position: 'absolute',
      transform: [{rotate: '90deg'}], 
      height: 200,
      width: 160,
      left: 120,
      top: '4%',
    },
    firstName2: {
      position: 'absolute',
      top: '55%',
      left: 0,
      width: '100%',
      transform: [{ translateY: -50 }],
      color: 'black',
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    lastName2: {
      position: 'absolute',
      top: '65%',
      left: 0,
      width: '100%',
      transform: [{ translateY: -50 }],
      color: 'black',
      fontSize: 23,
      fontWeight: 'bold',
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    barcodeContainer2: {
      position: 'absolute',
      top: '75%',
      left: 65,
      width: '100%',
      alignSelf: 'center',
    },
  });

  export default ID;