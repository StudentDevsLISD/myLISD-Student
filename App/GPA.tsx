import React, { useContext } from 'react';
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

  const data = {
    labels: ['MP1', 'MP2', 'MP3', 'MP4', 'MP5', 'MP6'],
    datasets: [
      {
        data: [3.5, 4.0, 4.5, 5.0, 5.5, 6.0],
      },
    ],
  };

  return (
    <View style={styles.GPAScreenContainer}>
      <Text style={styles.GPAScreenHeader}>GPA</Text>
      <View style={styles.GPAScreenGpaContainer}>
        <GPAInfo title="Weighted GPA" value="5.79" themeStyle={styles} />
        <GPAInfo title="College GPA" value="3.85" themeStyle={styles} />
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
          },
        }}
        style={styles.GPAScreenChart}
      />
    </View>
  );
};

export default App;
