import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import { RouteProp } from '@react-navigation/native';
import {ThemeContext} from './ThemeContext';
import LightStyles from './LightStyles';
import DarkStyles from './DarkStyles';
// ...


const AssignmentScreen = ({ route }) => {
  const navigation = useNavigation();
  const { data } = route.params;
  const [categories, setCategories] = useState([]);
  const [breakdowns, setBreakdowns] = useState([])
  const colors = [
    "#B19CD9", // Pastel Purple
    "#D5F5E3", // Pastel Mint Green
    "#FEC8D8", // Pastel Pink
    "#85C1E9", // Pastel Blue
    "#F9E79F", // Pastel Yellow
    "#F8C471", // Pastel Tangerine
    "#FAD7A0", // Pastel Gold
    "#D2B4DE", // Pastel Lavender
    "#A3E4D7", // Pastel Green
    "#F0B27A", // Pastel Peach
    "#D7BDE2", // Pastel Lilac
    "#F5B7B1", // Pastel Salmon
    "#AED6F1", // Pastel Sky Blue
    "#FADBD8", // Pastel Rose
    "#F5CBA7"  // Pastel Apricot
  ];
  
  const PaginationDots = ({ activeDotIndex, totalDots }) => {
    return (
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalDots }).map((_, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.6}
            style={[styles.dot, { transform: [{ scale: index === activeDotIndex ? 1.3 : 1 }] }, ,index === activeDotIndex ? styles.activeDot : styles.inactiveDot]}
          />
        ))}
      </View>
    );
  };
  
  const scrollViewRef = useRef(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: activeScreenIndex * Dimensions.get('window').width });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeScreenIndex]);
  const handleScroll = (event) => {
    const screenWidth = Dimensions.get('window').width*0.9;
    let newActiveIndex = Math.floor(event.nativeEvent.contentOffset.x / screenWidth);
  
    // Prevent the dot from unhighlighting when swiping left from the leftmost position
    newActiveIndex = Math.max(0, newActiveIndex);
  
    setActiveScreenIndex(newActiveIndex);
  };
  
  
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

    let y = [];
  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? LightStyles : DarkStyles;

  // console.log(data);

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
  const grade = data.grade;
  // const courseName = data.course.substring(12);
  

const numofscreens = Math.ceil((categories.length + 2)/ 4)


const FadedText = ({ text }) => {
  const { theme } = useContext(ThemeContext);
  const styles = theme === 'light' ? LightStyles : DarkStyles;
  const fadeStart = 23; // Adjusted fadeStart to start fading effect earlier
  const fadeEndWhite = 26;
  const fadeEndBlack = 27.7;
  let fade = theme === 'light' ? fadeEndWhite : fadeEndBlack;
  return (
    <Text style={styles.AssignmentScreenAssignmentName} numberOfLines={1} ellipsizeMode="tail">
      {text.split('').map((char, i) => {
        let color = theme === 'light' ? '#000' : '#FFF';
        if (i >= fadeStart && i < fade) {
          const fadeProgress = (i - fadeStart + 1) / (fade - fadeStart);
          if (theme === 'light') {
            const colorValue = Math.round(fadeProgress * 232); // 232 is (0xe8 - 0x00)
            color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
          } else {
            const colorValue = Math.round((1 - fadeProgress) * 187); // 187 is (0xe8 - 0x44)
            color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
          }
        } else if (i >= fade) {
          color = theme === 'light' ? '#e8e8e8' : '#444';
        }
        return (
          <Text key={i} style={{ color }}>
            {char}
          </Text>
        );
      })}
    </Text>
  );
};
  // const assignments = [
  //   { title: 'Math Assignment', subtitle: '01/02/2023', grade: '94.00', maxGrade: '100.00', breakdownColor: '#00ff00' },
  //   { title: 'Science Project', subtitle: '02/03/2023', grade: '86.00', maxGrade: '100.00', breakdownColor: '#ff0000' },
  //   { title: 'Math Assignment', subtitle: '01/02/2023', grade: '94.00', maxGrade: '100.00', breakdownColor: '#00ff00' },
  //   { title: 'Math Assignment', subtitle: '01/02/2023', grade: '94.00', maxGrade: '100.00', breakdownColor: '#00ff00' },
  //   { title: 'Math Assignment', subtitle: '01/02/2023', grade: '94.00', maxGrade: '100.00', breakdownColor: '#00ff00' },
  //   { title: 'Math Assignment', subtitle: '01/02/2023', grade: '94.00', maxGrade: '100.00', breakdownColor: '#00ff00' },
  //   { title: 'Math Assignment', subtitle: '01/02/2023', grade: '94.00', maxGrade: '100.00', breakdownColor: '#00ff00' },
  //   { title: 'Math Assignment', subtitle: '01/02/2023', grade: '94.00', maxGrade: '100.00', breakdownColor: '#00ff00' },
  //   // Other assignments...
  // ];
  const assignments = data.assignments;
  React.useEffect(() => {
    // let y = [];
    let updatedBreakdowns = [];
  
    for (let i = 0; i < assignments.length; i++) {
      y.push(assignments[i].category);
    }
    
    y = y.filter(function(item, pos) {
      return y.indexOf(item) === pos;
    });
    
    // Assuming that you have predefined weights and colors, let's create new breakdowns
    // y.forEach((category, index) => {
    //   updatedBreakdowns.push({
    //     label: category, // update this value accordingly
    //     weight: '1.0', // update this value accordingly // update this value accordingly
    //   });
    // });
    // console.log(y);
    setCategories(y);
    setBreakdowns(y); 
    }, [assignments]);// It will only rerun this effect if 'assignments' change
  
    const average = ((num) => {
      let sum = 0;
      let total = 0;
      let weight = 0.00;
      for(let i =0; i<assignments.length; i++){
        if(categories[num] == assignments[i].category){
          // console.log(assignments[i])
          
          if(assignments[i].weight == "N/A"){
            // console.log(assignments[i].name + ":" + assignments[i].score)
            // console.log((Number(assignments[i].totalPoints) ? Number(assignments[i].totalPoints) : 0))
           
            weight = 1;
          }  else {
            weight = Number(assignments[i].weight);
          }
          if(assignments[i].score == "X" || assignments[i].isDr.indexOf("strike") != -1){
            weight = 0;
          }
          // if(assignments[i].score == "M"){
          //   assignments[i].score = "0"
          // }
          if(assignments[i].score == "N/A"){
            weight = 0;
          }
          if(assignments[i].assignmentPercentage == "N/A"){
            assignments[i].assignmentPercentage = assignments[i].score;
          }
          if(Number(assignments[i].totalPoints) != 100){
            assignments[i].assignmentPercentage = assignments[i].score;
          }
          sum = sum + ((Number(assignments[i].assignmentPercentage.substring(0, assignments[i].assignmentPercentage.length -1))) * weight)
           total = total + ((Number(assignments[i].totalPoints) ? Number(assignments[i].totalPoints) : 0) * weight)
        }
     }
     console.log("CATEGORY: " + categories[num]);
     console.log("SUM: " + sum);
     console.log("TOTAL: " + total);
     return ((sum/total)*100).toFixed(2);
    })


  const getColor = ((idx) => {
    return colors[categories.indexOf(assignments[idx].category)];
  })

  const splitBreakdowns = [];
  // console.log(breakdowns)
  for (let i = 0; i < breakdowns.length; i += 2) {
    splitBreakdowns.push(breakdowns.slice(i, i + 2));
  }
  // console.log(splitBreakdowns);

  // Add a ref for the AnimatedCircularProgress
  const progressRef = useRef(null);
  const getBackgroundColor = (theme) => {
    return theme === 'dark' ? '#333' : '#e9eef1';
  };
  const backgroundColor = getBackgroundColor(theme);

  useFocusEffect(
    React.useCallback(() => {
        // Animate the grade from 0 to its current value when the component is in focus
        if (progressRef.current) {
            progressRef.current.animate(grade, 700); // animate to grade
        }

        return () => {
            // Optional: Reset the progress when the screen goes out of focus.
            // Note: This step might not be necessary depending on your needs, and you might not need to return a cleanup function at all.
            if (progressRef.current) {
                progressRef.current.animate(0, 0); // animate back to zero
            }

        };
    }, [])
);





return (
  <ScrollView style={styles.AssignmentScreenContainer}>
    {/* Rest of your existing JSX */}
    <View style={styles.AssignmentScreenTop}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={Dimensions.get('window').width} snapToAlignment='start' snaptoDuration='100' decelerationRate="fast" onScroll={handleScroll} // Call the handleScroll function when the user scrolls
      scrollEventThrottle={16} >
        <View style={styles.AssignmentScreenBorderBox}>
          <View style={styles.AssignmentScreenProgressBarContainer}>
            <AnimatedCircularProgress
              ref={progressRef}
              size={145}
              width={16}
              fill={0}
              tintColor="#5b92f9"
              rotation={0}
              backgroundColor={backgroundColor} // Set the background color based on the theme
              
            >
              {(fill) => (
                <>
                  <Text style={styles.AssignmentScreenGradeText}>{fill.toFixed(2)}</Text>
                  <Text style={styles.AssignmentScreenOverallText}>Overall</Text>
                </>
              )}
            </AnimatedCircularProgress>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
          <View style={styles.AssignmentScreenBreakdownContainer}>
          {splitBreakdowns.map((breakdownPair, index) => (
    <View key={index} style={styles.AssignmentScreenBreakdownColumn}>
      
      {breakdownPair.map((category) => (
        
        <TouchableOpacity key={category} activeOpacity={1} style={styles.AssignmentScreenBreakdownBox}>
          <Text style={styles.AssignmentScreenBreakdownLabel}>{category}</Text>
          {/* Pass the index of the category from the entire breakdowns array */}
          <Text style={styles.AssignmentScreenBreakdownValue}>{average(breakdowns.findIndex(c => c === category))}</Text>
          {/* Pass the index of the category from the entire breakdowns array */}
          <View style={[styles.AssignmentScreenBreakdownColor, { backgroundColor: colors[breakdowns.findIndex(c => c === category) % colors.length]}]} />
        </TouchableOpacity>
      ))}
    </View>
  ))}
</View>
          </ScrollView>
          <View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.dotview}>
      <PaginationDots activeDotIndex={activeScreenIndex} totalDots={numofscreens} />
      </View>
      <View style={styles.AssignmentScreenBottom}>

        <Text style={styles.AssignmentScreenAssignmentTitle}>Assignments</Text>

        <View>
          {assignments.map((assignment, index) => (
            <TouchableOpacity key={index} style={styles.AssignmentScreenAssignmentBox} activeOpacity={1}>
              <View style={styles.AssignmentScreenAssignmentItem}>
                <View style={[styles.AssignmentScreenBreakdownColorIndicator, { backgroundColor: getColor(index) }]} />
                <View style={styles.AssignmentScreenAssignmentTextContainer}>
                  <Text style={styles.AssignmentScreenAssignmentName}>{assignment.name}</Text>
                  <Text style={styles.AssignmentScreenAssignmentSubtitle}>{assignment.dateDue}</Text>
                </View>
                <View style={styles.AssignmentScreenAssignmentGradeContainer}>
                  <Text style={styles.AssignmentScreenAssignmentGrade}>{assignment.score}</Text>
                  <Text style={styles.AssignmentScreenAssignmentMaxGrade}>{`/${assignment.totalPoints}`}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};


export default AssignmentScreen;
