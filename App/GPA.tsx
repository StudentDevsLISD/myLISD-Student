import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const GPAInfo = ({ title, value, themeStyle }) => (
  <TouchableOpacity style={themeStyle.GPAScreenGpaInfo}>
    <Text style={themeStyle.GPAScreenGpaTitle}>{title}</Text>
    <Text style={themeStyle.GPAScreenGpaValue}>{value}</Text>
    <TouchableOpacity style={themeStyle.GPAScreenViewMoreButton}>
      <Text style={themeStyle.GPAScreenViewMoreText}>Learn More</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const App = () => {
  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState('');
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
  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formattedDate);
  }, []);

  const barData = [
    {value: 5.5,label: 'MP1',frontColor: '#005987', topLabelComponent: () => (
      <Text style={{color: 'black', fontSize: 18, marginBottom: 6}}>5.5</Text>
    ),},
    {value: 5.8,label: 'MP2',frontColor: '#005987', topLabelComponent: () => (
      <Text style={{color: 'black', fontSize: 18, marginBottom: 6}}>5.8</Text>
    ),},
    {value: 5.5,label: 'MP3',frontColor: '#005987', topLabelComponent: () => (
      <Text style={{color: 'black', fontSize: 18, marginBottom: 6}}>5.5</Text>
    ),},
    {value: 5.9,label: 'MP4',frontColor: '#005987', topLabelComponent: () => (
      <Text style={{color: 'black', fontSize: 18, marginBottom: 6}}>5.9</Text>
    ),},
    {value: 5.9,label: 'MP5',frontColor: '#005987', topLabelComponent: () => (
      <Text style={{color: 'black', fontSize: 18, marginBottom: 6}}>5.9</Text>
    ),},
    {value: 5.9,label: 'MP6',frontColor: '#005987', topLabelComponent: () => (
      <Text style={{color: 'black', fontSize: 18, marginBottom: 6}}>5.9</Text>
    ),},

    ];



  return (
    <View style={styles.GPAScreenContainer}>
<View style={styles.GPAHeader}>
        <Text style={styles.GPAScreenDateText}>{currentDate}</Text>
        <Text style={styles.GPAScreenHeaderText}>GPA</Text>
      </View>
            <View style={styles.GPAScreenGpaContainer}>
        <GPAInfo title="Weighted GPA" value="5.793" themeStyle={styles} />
        <GPAInfo title="Unweighted GPA" value="3.85" themeStyle={styles} />
      </View>
      <Text style={styles.GPAScreenChartTitle}>Weighted GPA Progress</Text>
      <View>
            <BarChart
            showFractionalValue
            curved={true}
            showYAxisIndices
            noOfSections={4}
            maxValue={6.0}
            barBorderRadius={4}
disablePress={true}
            animationDuration={300}
            minValue={3.0}
            data={barData}
            isAnimated
            />
        </View>
    </View>
  );
};

export default App;
