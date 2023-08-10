import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { ThemeContext } from './ThemeContext';
import lightStyles from './LightStyles';
import darkStyles from './DarkStyles';
import { CommonActions, NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const GPAInfo = ({ title, value, themeStyle }) => (
  <TouchableOpacity style={themeStyle.GPAScreenGpaInfo}>
    <Text style={themeStyle.GPAScreenGpaTitle}>{title}</Text>
    <Text style={themeStyle.GPAScreenGpaValue}>{value}</Text>
    <TouchableOpacity style={themeStyle.GPAScreenViewMoreButton}>
      <Text style={themeStyle.GPAScreenViewMoreText}>View More</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const App = () => {
  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? lightStyles : darkStyles;
  const navigation = useNavigation();
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
      <View style={styles.GPAScreenGpaContainer}>
        <GPAInfo title="Weighted GPA" value="5.793" themeStyle={styles} />
        <GPAInfo title="College GPA" value="3.846" themeStyle={styles} />
      </View>
      <Text style={styles.GPAScreenChartTitle}>Weighted GPA by MP</Text>
      <BarChart
        data={data}
        width={320}
        height={220}
        yAxisInterval={0.5}
        yAxisSuffix=""
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
