import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import Barcode from 'react-native-barcode-svg';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';

const downloadAndSaveImage = async (imageUrl: string, imagePath: string) => {
  try {
    const response = await RNFetchBlob.config({
      fileCache: true,
    }).fetch('GET', imageUrl);

    const base64Image = await response.readFile('base64');
    await RNFS.writeFile(imagePath, base64Image, 'base64');
    console.log('Image saved successfully:', imagePath);
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

const ID = () => {
  const [selectedScreen, setSelectedScreen] = useState(0);
  const [localImagePath, setLocalImagePath] = useState<string | null>(null);
  const firstName = 'Pranav'; //api
  const lastName = 'Sarma'; //api
  const barcodeNumber = '420069'; //api
  const studentIDNum = '#' + barcodeNumber;
  const grade = 10; //api
  const gradeText = 'Grade: ' + grade;

  const imageUrl = 'https://www.austintexas.gov/sites/default/files/files/Sustainability/Pranav-headshot.png';
  const imageName = 'StudentID.jpg';
  const imagePath = `${RNFS.DocumentDirectoryPath}/${imageName}`;

  useEffect(() => {
    const loadImage = async () => {
      const storedImageUrl = await getStoredImageUrl();

      if (storedImageUrl !== imageUrl) {
        await downloadAndSaveImage(imageUrl, imagePath);
        storeImageUrl(imageUrl);
      }

      setLocalImagePath(imagePath);
    };

    RNFS.exists(imagePath)
      .then((exists: any) => {
        if (exists) {
          loadImage();
        } else {
          downloadAndSaveImage(imageUrl, imagePath);
          setLocalImagePath(imagePath);
        }
      })
      .catch((error: any) => {
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
        source={require('./assets/VRHS_ID_Rounded.png')} //api
      />
      <Text style={styles.firstName}>{firstName}</Text>
      <Text style={styles.lastName}>{lastName}</Text>
      <Text style={styles.grade}>{gradeText}</Text>
      <Text style={styles.IDNum}>{studentIDNum}</Text>
      {localImagePath && (
        <Image
          style={styles.IDPic}
          source={{ uri: 'file://' + localImagePath }}
        />
      )}
      <View style={styles.barcodeContainer}>
        <Barcode value={barcodeNumber} format="CODE39" height={50} />
      </View>
    </View>
  );

  const SecondScreen = () => (
<View style={styles.secondScreenContainer}>
      <Image
        style={styles.smartTag}
        source={require('./assets/SmartTagID.png')}
      />
      <Text style={styles.firstName2}>JAYACHANDRA</Text>
      <Text style={styles.lastName2}>DASARI</Text>
      <View style={styles.barcodeContainer2}>
        <Barcode value={barcodeNumber} format="CODE39" height={60} />
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