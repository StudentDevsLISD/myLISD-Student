import { StatusBar } from "expo-status-bar";
import React, { useRef, useContext } from "react";
import { StyleSheet, Text, View, Dimensions, Animated } from "react-native";
import { ThemeContext } from './ThemeContext';

const { width, height } = Dimensions.get("window");

export default function App() {
  const { theme } = useContext(ThemeContext);

  // Determine the device type (mobile or desktop)
  const isMobile = width < 768; // Adjust the width threshold as needed

  // Set the circleWidth based on the device type
  const circleWidth = isMobile ? width / 1.76 : width / 4.4; // Adjusted circle width for mobile and desktop

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme === 'light' ? "#e8e8e8" : "#222",
      alignItems: "center",
      justifyContent: "center",
    },
    animationContainer: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginLeft: -circleWidth / 2,
      marginTop: -circleWidth / 2 + (isMobile ? 10 : 0), // Adjusted marginTop for proper centering
    },
  };

  const move = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;

  Animated.loop(
    Animated.sequence([
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(move, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          delay: 100,
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(move, {
          delay: 1000,
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ])
  ).start();

  const translate = move.interpolate({
    inputRange: [0, 1],
    outputRange: [0, circleWidth / 6],
  });
  const exhale = textOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={styles.container}>
      {/* Center the animation */}
      <View style={styles.animationContainer}>
        <Animated.View
          style={{
            width: circleWidth,
            height: circleWidth,
            ...StyleSheet.absoluteFillObject,
            alignItems: "center",
            justifyContent: "center",
            opacity: textOpacity,
          }}
        >
          <Text
            style={{
              fontSize: isMobile ? 16 : 20, // Adjusted font size for mobile and desktop
              fontWeight: "600",
color: theme === 'light' ? "#000" : "#fff",
            }}
          >
            Inhale
          </Text>
        </Animated.View>
        <Animated.View
          style={{
            width: circleWidth,
            height: circleWidth,
            ...StyleSheet.absoluteFillObject,
            alignItems: "center",
            justifyContent: "center",
            opacity: exhale,
          }}
        >
          <Text
            style={{
              fontSize: isMobile ? 16 : 20, // Adjusted font size for mobile and desktop
              fontWeight: "600",
              color: theme === 'light' ? "#000" : "#fff",

            }}
          >
            Exhale
          </Text>
        </Animated.View>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => {
          const rotation = move.interpolate({
            inputRange: [0, 1],
            outputRange: [`${item * 45}deg`, `${item * 45 + 180}deg`],
          });
          return (
            <Animated.View
              key={item}
              style={{
                opacity: 0.1,
                backgroundColor: "#005a87",
                width: circleWidth,
                height: circleWidth,
                borderRadius: circleWidth / 2,
                ...StyleSheet.absoluteFillObject,
                transform: [
                  {
                    rotateZ: rotation,
                  },
                  { translateX: translate },
                  { translateY: translate },
                ],
              }}
            ></Animated.View>
          );
        })}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
