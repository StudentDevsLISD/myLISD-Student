import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';

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

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formattedDate);
  }, []);


  const data = {
    labels: ['MP1', 'MP2', 'MP3', 'MP4', 'MP5', 'MP6'],
    datasets: [
      {
        data: [5.6, 5.5, 5.9, 5.8, 5.5, 6.0],
      },
      {
      data: [3.0]
      },
      {
        data: [6.0]
      }
    ],
  };

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
      <BarChart
        data={data}
        width={320}
        height={220}
        yAxisInterval={0.5}
        yAxisSuffix=""
        yAxisLabel=""
        chartConfig={{
          backgroundGradientFrom: '#FFFFFF', // Set the background to white
          backgroundGradientTo: '#FFFFFF',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Set the text color to black
          style: {
            borderRadius: 16,
            paddingTop: 0, // Reduce padding at the top
            paddingRight: 0, // Reduce padding at the right
          },
        }}
        style={styles.GPAScreenChart}
        contentInset={{ top: 10, bottom: 10 }} // Adjust content inset to limit grid lines
      />
    </View>
  );
};

export default App;
