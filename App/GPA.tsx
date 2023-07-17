import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const GPAInfo = ({ title, value }) => (
  <TouchableOpacity style={styles.gpaInfo}>
    <Text style={styles.gpaTitle}>{title}</Text>
    <Text style={styles.gpaValue}>{value}</Text>
    <TouchableOpacity style={styles.viewMoreButton}>
      <Text style={styles.viewMoreText}>View More</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const App = () => {
  const data = {
    labels: ['MP1', 'MP2', 'MP3', 'MP4', 'MP5', 'MP6'],
    datasets: [
      {
        data: [3.5, 4.0, 4.5, 5.0, 5.5, 6.0],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.gpaContainer}>
        <GPAInfo title="Weighted GPA" value="5.793" />
        <GPAInfo title="College GPA" value="3.846" />
      </View>
      <Text style={styles.chartTitle}>Weighted GPA by MP</Text>
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
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  gpaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gpaInfo: {
    flex: 1,
    padding: 20,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  gpaTitle: {
    fontSize: 16,
    color: '#333',
  },
  gpaValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  viewMoreButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#007BFF',
  },
  viewMoreText: {
    color: '#fff',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
  },
});

export default App;
