import React from 'react';
import { Dimensions, Platform, StyleSheet, } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

const DarkStyles = StyleSheet.create({
    AppRunnerOfflineContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
        },
        AppRunnerOfflineText: {
        marginTop: 8,
        fontSize: 16,
        color: "white"
        },
        AssignmentScreenContainer: {
          flex: 1,
          backgroundColor: '#111',
          paddingTop: 10,
        },
        AssignmentScreenCourseTitle: {
          fontSize: 25,
          fontWeight: 'bold',
          textAlign: 'center',
          padding: 5,
          color: "#ede1d1"
        },
        AssignmentScreenTop: {
          flexDirection: 'row',
          padding: 10,
        },
        AssignmentScreenBorderBox: {
          borderRadius: 15,
          backgroundColor: '#222',
          margin: 5,
          borderWidth: 0,
          borderColor: '#ddd',
        },
        AssignmentScreenProgressBarContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 13,
          paddingBottom: 8,
          paddingHorizontal: 15,
          borderRadius: 15,
        },
        AssignmentScreenGradeText: {
          fontSize: 28,
          fontWeight: 'bold',
          color: "#ede1d1"
        },
        AssignmentScreenOverallText: {
          fontSize: 16,
          color: 'grey',
        },
        AssignmentScreenBreakdownContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
        },
        AssignmentScreenBreakdownColumn: {
          paddingHorizontal: 5,
        },
        AssignmentScreenBreakdownBox: {
          marginBottom: 5,
          backgroundColor: '#222',
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingTop: 3,
          paddingBottom: 10,
          marginTop: 6,
          width: Dimensions.get('window').width * 0.45,
          height: 80,
        },
        AssignmentScreenBreakdownLabel: {
          fontSize: 18,
          fontWeight: 'normal',
          color: "white",
        },
        AssignmentScreenBreakdownValue: {
          fontSize: 30,
          fontWeight: 'bold',
          color: "#EDE1D1",
        },
        AssignmentScreenBreakdownWeight: {
          fontSize: 14,
          color: "white",
        },
        AssignmentScreenBreakdownColor: {
          width: 25,
          height: 10,
          borderRadius: 5,
          position: 'absolute',
          right: 10,
          bottom: 5,
        },
        AssignmentScreenBottom: {
          backgroundColor: '#222',
          borderRadius: 10,
          margin: 10,
          padding: 10,
        },
        AssignmentScreenAssignmentTitle: {
          fontSize: 22,
          fontWeight: 'bold',
          paddingTop: 3,
          paddingBottom: 3,
          color: "#EDE1D1",
        },
        AssignmentScreenAssignmentName: {
          fontSize: 18,
          fontWeight: 'bold',
          paddingVertical: 3,
          color: "white",
        },
        AssignmentScreenAssignmentBox: {
          marginBottom: 10,
          paddingHorizontal: 10,
        },
       AssignmentScreenAssignmentItem: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        AssignmentScreenAssignmentTextContainer: {
          flex: 1,
        },
        AssignmentScreenAssignmentSubtitle: {
          fontSize: 14,
          color: "#d3d3d3",
        },
        AssignmentScreenAssignmentGradeContainer: {
          flex: 0.2,
          alignItems: 'flex-end',
        },
        AssignmentScreenAssignmentGrade: {
          fontSize: 14,
          fontWeight: 'bold',
          color: "white"
        },
        AssignmentScreenAssignmentMaxGrade: {
          fontSize: 12,
          color: 'grey',
        },
        AssignmentScreenBreakdownColorIndicator: {
          width: 10,
          height: 35,
          borderRadius: 5,
          marginRight: 10,
        },
        AssignmentScreenCalculateButton: {
          marginTop: 5,
          marginBottom: -5,
          borderRadius: 10,
          paddingVertical: 9,
          paddingHorizontal: 32.5,
          justifyContent: 'center',
          alignItems: 'center',
        },
        AssignmentScreenCalculateButtonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '800',
        },
        AttendanceLoadingContainer:{
            flex: 1,
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: "#111",
          },
          AttendanceContainer: {
            flex: 1,
            padding: 16,
            backgroundColor: '#111',
          },
          AttendanceCalendarContainer: {
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: "#111",
            color: "#fff",
          },
          AttendanceLegendContainer: {
            marginTop: 16,
            backgroundColor: "#111",
          },
          AttendanceLegendBox: {
            backgroundColor: '#222',
            borderRadius: 10,
            padding: 16,
          },
          AttendanceLegendTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 16,
            textAlign: 'center',
            color: "#ede1d1"
          },
          AttendanceLegendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          },
          AttendanceLegendColorBox: {
            width: 18,
            height: 18,
            borderRadius: 4,
            marginRight: 8,
          },
          AttendanceLegendText: {
            fontSize: 16,
            color: "#fff"
          },
          AttendanceDayContainer: {
            alignItems: 'center',
          },
          AttendanceDayText: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 4,
            color: "#fff",
          },
          AttendanceCalendarBox: {
            backgroundColor: '#222',
            calendarBackground: '#222',
            textSectionTitleColor: '#fff',
            selectedDayBackgroundColor: '#fff',
            selectedDayTextColor: '#fff',
            todayTextColor: '#fff',
            dayTextColor: '#fff',
            textDisabledColor: '#fff',
            dotColor: 'transparent',
            selectedDotColor: 'rgba(0, 0, 0, 0)',
            arrowColor: 'black',
            monthTextColor: '#fff',
            indicatorColor: '#fff',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 13,
            textDayFontWeight: 'bold',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: 'bold',
          },
          AttendanceEmptyBox: {
            width: 20,
            height: 20,
            marginRight: 8,
          },
          CalendarEventContainer: {
            backgroundColor: '#222',
            margin: 10,
            padding: 10,
            borderRadius: 5,
            },
          CalendarEventEventContainer: {
            backgroundColor: '#ffffff',
            padding: 10,
            marginVertical: 5,
            marginHorizontal: 10,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            CalendarEventShadowOpacity: 0.1,
            shadowRadius: 1.5,
            elevation: 3,
            flexDirection: 'row',
            overflow: 'hidden',
          },
          CalendarEventBlueStripWrapper: {
            width: 4,
            backgroundColor: '#007AFF',
            borderRadius: 4,
            overflow: 'hidden',
            paddingRight: 6,
          },
          CalendarEventBlueStrip: {
            flex: 1,
            backgroundColor: '#007AFF',
            borderRadius: 4,
          },
          CalendarEventContent: {
            flex: 1,
            flexDirection: 'column',
            marginLeft: 10, // add some left margin
          },
          CalendarEventTime: {
            fontSize: 12,
            color: '#999',
            marginBottom: 2,
          },
          CalendarEventTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: '#fff',
            marginBottom: 2,
          },
          CalendarEventLocation: {
            fontSize: 12,
            color: '#999',
          },
          ClassScheduleContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          ContactTeacherContainer: {
            flex: 1,
            paddingTop: 20,
            paddingHorizontal: 20,
            backgroundColor: "#222",
          },
          ContactTeacherSectionTitle: {
            fontSize: 35,
            fontWeight: '600',
            marginBottom: 5,
            color: "#ede1d1",
          },
          ContactTeacherArticleContainer: {
            flexDirection: 'row',
            padding: 10,
            alignItems: 'center',
            backgroundColor: "#222",
          },
          ContactTeacherTextContainer: {
            flex: 1,
            paddingHorizontal: 15,
          },
          ContactTeacherImage: {
            width: 70,
            height: 70,
          },
          ContactTeacherTitle: {
            fontSize: 18,
            fontWeight: '500',
            color: "white",
          },
          ContactTeacherSource: {
            fontSize: 14,
            color: 'grey',
          },
          GPAScreenContainer: {
            flex: 1,
            padding: 20,
            backgroundColor: '#fff',
          },
          GPAScreenGpaContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          },
          GPAScreenGpaInfo: {
            flex: 1,
            padding: 20,
            margin: 10,
            borderRadius: 10,
            backgroundColor: '#f0f0f0',
            alignItems: 'center',
          },
          GPAScreenGpaTitle: {
            fontSize: 16,
            color: '#333',
          },
          GPAScreenGpaValue: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333',
          },
          GPAScreenViewMoreButton: {
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#007BFF',
          },
          GPAScreenViewMoreText: {
            color: '#fff',
          },
          GPAScreenChartTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
          },
          GPAScreenChart: {
            marginVertical: 8,
          },
          GradesContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',
           
            backgroundColor: '#111',
          },
          GradesGradeContainer: {
            backgroundColor: '#333',
            borderRadius: 10,
            padding: 12.5,
            marginVertical: 5,
            marginHorizontal: 10,
          },
          GradesGradeItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: -3,
          },
          GradesCourseNameAndNum: {
            flexDirection: 'column',
          },
          GradesGradeText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: "#fff",
          },
          GradesGradeTextCourse: {
            fontSize: 14,
            marginTop: 3,
            color: "#808080",
          },
          GradesGradeBadge: {
            flexDirection: 'row',
            borderRadius: 8,
            paddingHorizontal: 11,
            paddingVertical: 5,
            marginLeft: 10,
          },
          GradesGradeBadgeColor: {
            borderRadius: 8,
            paddingHorizontal: 11,
            paddingVertical: 8,
          },
          GradesGradeBadgeText: {
        
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
          },
          GradesGradeBadgeText2: {
        
            color: '#444',
            fontSize: 0,
            fontWeight: 'bold',
          },
          GradesHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            paddingLeft: 5,
          },
          GradesHeaderText: {
            fontSize: 40,
            marginLeft: -127,
            marginBottom: 10,
            marginTop: 10,
            color: "#ede1d1",
            fontWeight: "600",
          },  
          GradesGradientTextContainer: {
            flexDirection: 'row',
            maxWidth: '60%',
            position: 'relative',
          },
          GradesGradientOverlay: {
            position: 'absolute',
            right: 0,
            top: 0,
            width: '30%',
            height: '100%',
          },
          GradesDateText: {
            fontSize: 14,
            color: 'gray',
            marginTop: 58,
            marginLeft: 14,
          },
          GradesInputContainer: {
            padding: 20,
            backgroundColor: '#333',
            marginVertical: 10,
            marginHorizontal: 20,
            borderRadius: 10,
            shadowColor: '#555',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 2,
          },
          GradesInput: {
            height: 45,
            borderColor: '#555',
            borderWidth: 1,
            marginBottom: 20,
            paddingHorizontal: 10,
            borderRadius: 5,
            backgroundColor: '#333',
            color: "white",
          },
          GradesLoginButton: {
            backgroundColor: '#005987',
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
          },
          GradesLoginButtonText: {
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
          },
          GradesAppButtonContainer2: {
          elevation: 8,
          backgroundColor: '#333',
          borderRadius: 15,
          paddingVertical: 13,
          marginHorizontal: 1.05,
          marginBottom: 7,
          marginTop: 0,
          width: '94%',
          borderWidth: 2,
          borderColor: '#444',
          fontWeight: 'bold',
          alignSelf: 'center',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          
          },
          GradesAppButtonText2: {
          fontSize: 18,
          color: '#fff',
          alignSelf: 'center',
          fontWeight: '500',
          
          },
          GradesNewAssignmentsScrollView: {
            maxHeight: 100,
            marginTop: 5,
            flexDirection: 'row', // Add this line to display new assignments horizontally
            marginHorizontal: 8,
          },
          FadedAssignmentName: {
            color: '#FFF', // Adjust as needed
          },
        
          GradesNewAssignmentTouchable: {
            marginBottom: 5,
            backgroundColor: '#333',
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 0, // Increase the height of the touchable area even more
            marginHorizontal: 5,
            justifyContent: 'center', // Vertically center the text
          },
          GradesNewAssignmentText1: {
            fontSize: 18,
            fontWeight: 'normal',
            paddingVertical: 10,
            color: "white",
          },
          GradesNewAssignmentText2: {
            fontSize: 30,
            fontWeight: 'bold',
            paddingVertical: 10,
            color: "white",
          },
          HACContainer: {
            flexGrow: 1,
            paddingHorizontal: 10,
            paddingTop: 20,
            backgroundColor: "#111",
          },
          HACHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            paddingLeft: 5,
          },
          HACHeaderText: {
            fontSize: 40,
            marginBottom:10,
            marginTop: -13,
            color: "#ede1d1",
            fontWeight: "600",
            marginLeft: -125,
            
          },
          HACDateText: {
            fontSize: 14,
            color: '#777',
            marginTop:40,
            marginLeft: 5,
          },
          HACBox: {
            borderRadius: 15,
            borderWidth: 1,
            borderColor: '#dcdcdc',
            marginVertical: 5,
            overflow: 'hidden', // Needed to apply border radius to ListItem
          },
          HACDescriptionText: {
            color: 'gray',
          },
          HACChevronIcon: {
            marginLeft: 'auto',
            paddingLeft: 10,
          },
          HACAppButtonContainer2: {
            elevation: 8,
            backgroundColor: 'white',
            borderRadius: 15,
            paddingVertical: 13,
            marginHorizontal: 2.05,
            marginBottom: 7,
            marginTop: -1,
            width: '99%',
            borderWidth: 2,
            borderColor: '#ebe8e8',
            fontWeight: 'bold',
            justifyContent: 'center',
            alignItems: 'center',
            
            },
            HACAppButtonText2: {
            fontSize: 18,
            color: 'black',
            alignSelf: 'center',
            fontWeight: 'normal',
            },
            HomeWork:{
              fontSize: 24,
              color: "#fff",

              alignSelf: "center",
              marginVertical: 8,
              marginBottom: 12,
            },
            HomeLetterView:{
              flexDirection: 'column',
              paddingHorizontal: 25,
              //paddingBottom: 6,
              marginVertical: 2,
            },
    
            HomeContainer: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: '#111',
            },
            HomeIndicator: {
            marginBottom: 20,
            },
            HomeOptions5: {
              backgroundColor: "ebe8e8",
              width: Dimensions.get('window').width * 0.935,
            },
            HomeBox5: {
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#444',
              marginVertical: 5,
              overflow: 'hidden', // Needed to apply border radius to ListItem
            },
            HomeScreenIcon5:{
              fontSize: 20,
              color: "#005987"
  
            },
            HomeDescriptionText5: {
              color: 'gray',
            },
            HomeParentView5:{
              flexDirection: 'column',
            },
            
            HomeLetterContainer: {
              borderWidth: 2,
              borderColor: '#444',
              borderRadius: 15,
              //paddingBottom: 14,
              //paddingTop: -20,
              overflow: 'hidden',
              backgroundColor: '#222',
              marginVertical:9,
              marginHorizontal: 5,
              width: Dimensions.get('window').width * 0.467,
              justifyContent: 'center', 
              alignItems: 'center',
            },
            HomeLetter_day: {
            fontSize: RFPercentage(9),
            color: "#ede1d1",

            fontWeight: 'normal',
            },
            HomeLetter_day_2: {
            textAlign: 'center',
            alignItems: 'center',
            color: "#ede1d1",

            fontSize: 24,
            fontWeight: 'normal',
            //paddingTop: 10,
            //paddingBottom: -5,
            
            },
            HomeDate: {
              backgroundColor: '#fff',
              marginLeft: 158,
              marginTop: -182,
              fontSize: RFPercentage(8), // Adjust the value (5) to your preference
              color: "#ede1d1",
              borderWidth: 2,
              borderColor: '#444',
              borderRadius: 15,
              paddingBottom: 34,
              paddingTop: 2,
              paddingHorizontal: 28,
              overflow: 'hidden',
              fontWeight: 'normal',
            },
            HomeHeader: {
              flexDirection: 'row',
              alignItems: 'left',
              marginBottom: 10,
              paddingLeft: 5,
            },
          HomeHeaderText: {
              fontSize: 40,
              marginTop: 10,
              marginBottom:2,
              color: "#ede1d1",
              fontWeight: "600",
              alignContent: 'left',
            },
            HomeTitleText5: {
              color: "white",
              fontWeight: "600",

            },
            HomeBox5: {
              backgroundColor: "#444",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#444',
              marginVertical: 5,
              overflow: 'hidden', // Needed to apply border radius to ListItem
            },
            HomeScreenIcon5:{
              fontSize: 20,
              color: "white",
  
            },
            HomeChevronIcon: {
              marginLeft: 'auto',
              paddingLeft: 10,
              color: "#ede1d1"
            },
            HomeDescriptionText5: {
              color: "#ede1d1",
            },
            HomeDay: {
              fontSize: 15, // Adjust the value (2) to your preference
              paddingVertical: 0,
              marginHorizontal: 237,
              marginBottom: 0,
              marginTop: -30,
              height: 100,
              width: 250,
              fontWeight: "normal",
            color: "#ede1d1",

            },
            HomeNewStyle: {
              flex: 2,
              width: "100%"
              
              // marginTop: -200,
              //padding: "1.2%"
            },
            HomeGoogle1:{
              marginLeft:85,
              marginTop: -45,
              fontSize: 25,
              marginRight: 29,
              fontWeight: 'normal',
            },
            HomeGooglebox:{
              backgroundColor: '#ffffff',
              borderRadius: 15,
              paddingHorizontal: 20,
              paddingRight: 20,
              marginHorizontal: 10,
              paddingBottom: 15,
              width: '95%',
              borderWidth: 2,
              borderColor: '#444',
              fontWeight: 'normal',
            },
            HomeNoWorkText: {
              fontSize: 18,
              fontWeight: 'normal',
              alignSelf: 'center',
              marginVertical: 8,
            },
            HomeAppButtonContainer2: {
            elevation: 8,
            backgroundColor: 'white',
            borderRadius: 15,
            paddingVertical: 13,
            paddingHorizontal: 12,
            marginHorizontal: 12,
            marginBottom: 7,
            marginTop: -1,
            width: '93%',
            borderWidth: 2,
            borderColor: '#444',
            fontWeight: 'bold',
            },
            HomeAppButtonText2: {
            fontSize: 18,
            color: 'black',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'normal',
            },
              IDsContainer: {
                flex: 1,
                backgroundColor: '#222',
              },
              IDsIDCard: {
                height: 600,
                width: 550,
                resizeMode: 'contain',
                transform: [{ rotate: '90deg' }],
                alignSelf: 'center',
              },
              IDsSecondScreenContainer: {
                position: 'relative',
              },
              IDsSmartTag: {
                height: 575,
                width: 525,
                resizeMode: 'contain',
                alignSelf: 'center',
              },
              IDsSwitchSelector: {
                marginTop: 30,
                marginBottom: 20,
                marginHorizontal: 50,
              },
              IDsFirstName: {
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
              IDsLastName: {
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
              IDsBarcodeContainer: {
                position: 'absolute',
                top: '42%',
                right: 128,
                width: '100%',
                alignSelf: 'center',
                transform: [{ rotate: '90deg' }],
              },
              IDsGrade: {
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
              IDsIDNum: {
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
              IDsIDPic: {
                position: 'absolute',
                transform: [{rotate: '90deg'}], 
                height: 200,
                width: 160,
                left: 120,
                top: '4%',
              },
              IDsFirstName2: {
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
              IDsLastName2: {
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
              IDsBarcodeContainer2: {
                position: 'absolute',
                top: '75%',
                left: 65,
                width: '100%',
                alignSelf: 'center',
              },
              LoginContainer: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
                backgroundColor: '#0080c2',
              },
              LoginLogo: {
                width: 1000, // Increase the width for a bigger logo
                height: 105, // Increase the height for a bigger logo
                marginBottom: 30,
              },
              LoginInput: {
                width: '100%',
                height: 50, // Decreased the height back to 50
                backgroundColor: 'white',
                paddingHorizontal: 15,
                marginBottom: 10,
                borderRadius: 5,
                color: 'darkgray', // Set the text color within the input box
              },
              LoginError: {
                color: 'red',
                marginBottom: 10,
              },
              LoginLoginButton: {
                width: '100%',
                height: 50,
                backgroundColor: '#3495eb',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                marginTop: 10,
              },
              LoginLoginButtonText: {
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
              },
              LoginContainer:{
                flex: 1,
                backgroundColor: "#005987",

              },
              LoginOrText: {
                fontSize: 18,
                marginVertical: 20,
              },
              LoginGoogleButton: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#444',
                borderRadius: 5,
                width: '100%',
                height: 50,
              },
              LoginGoogleIcon: {
                width: 30,
                height: 30,
                marginRight: 10,
              },
              LoginGoogleButtonText: {
                fontSize: 18,
              },
              NewsScreenContainer: {
                flex: 1,
                backgroundColor: "#222",

                paddingTop: 20,
                paddingHorizontal: 20,
              },
              NewsScreenSectionTitle: {
                fontSize: 28,
                fontWeight: '600',
                marginBottom: 5,
                color: "#ede1d1",
              },
              MentalHealthContainer: {
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#222",
            
              },
              NewsScreenLoadingContainer:{
                flex: 1,
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: "#222",
                marginTop: 200,
              },
              NewsScreenArticleContainer: {
                flexDirection: 'row',
                padding: 10,
                alignItems: 'center',
              },
              NewsScreenTextContainer: {
                flex: 1,
                paddingHorizontal: 15,
            
              },
              NewsScreenImage: {
                width: 70,
                height: 70,
              },
              NewsScreenTitle: {
                fontSize: 18,
                fontWeight: '500',
                color: "white"
              },
              NewsScreenSource: {
                fontSize: 14,
                color: 'grey',
              },
              PeriodTimerContainer: {
                backgroundColor: '#222',
                borderRadius: 15,
                paddingHorizontal: 20,
                paddingRight: 20,
                paddingVertical: 10,
                marginHorizontal: 10,
                width: '94%',
                borderWidth: 2,
                borderColor: '#444',
              },
              PeriodTimerPeriod: {
                fontSize: 24,
                textAlign: 'center',
                color: "#ede1d1"
              },
              PeriodTimerTimer: {
                fontSize: 50,
                color: "#ede1d1",
                fontWeight: "500",
                marginTop: 10,
                marginBottom: 15,
                textAlign: 'center',
              },
              PeriodTimerProgressBarContainer: {
                overflow: 'hidden',
                paddingHorizontal: 0,
                borderColor: "#444"
              },
              PeriodTimerProgressBar: {
                width: '100%',
                height: 30,
                borderRadius: 11,
                borderWidth: 1,
                borderColor: '#ede1d1',
    
              },
              PortalContainer: {
                backgroundColor: "#ebe8e8",
                // marginBottom: -200,
              },
              PortalNewStyle: {
                flex: 2,
                backgroundColor: "#ebe8e8",
                // marginTop: -200,
                //padding: "1.2%"
                
              },
              PortalAppButtonContainer: {
                elevation: 8,
                backgroundColor: "white",
                borderRadius: 10,
                paddingVertical: "3.5%",
                //13
                paddingLeft: "3.23%",
                //12
                paddingRight: 0,
                marginHorizontal: "3.5%",
                //13,
                marginVertical: "1.88%",
                //7
                flexDirection: "row",
                justifyContent: "space-between",
              },
              PortalAppButtonContainer2: {
                elevation: 8,
                backgroundColor: "white",
                borderRadius: 10,
                paddingVertical: "3.5%",
                paddingHorizontal: "3.23%",
                marginHorizontal: "3.23%",
                marginBottom: "1.88%",
                marginTop: 16/* "4.30%" */,
                //16
              },
              PortalAppButtonText: {
                fontSize: 18,
                color: "#2e2d2d",
                alignSelf: "center",
                width: "80%"
                //marginRight: "10%",
              },
              PortalAppButtonText2: {
                fontSize: 18,
                color: "black",
                fontWeight: "bold",
                alignSelf: "center",
              },
              PortalButtonContainer: {
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor: '#f5f5f5',
                borderRadius: 15,
                marginVertical: 5,
                marginHorizontal: 10,
                },
                PortalButtonTitle: {
                fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
                fontWeight: '500',
                fontSize: 17,
                marginRight: 10,
                color: '#333',
                },
                PortalButtonLikeButton: {
                backgroundColor: '#f5f5f5',
                borderWidth: 1,
                borderColor: '#eaeaea',
                borderRadius: 15,
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 15,
                },
                PortalButtonLikeIcon: {
                color: '#007aff',
                },
                QuickLinksContainer: {
                  flex: 1,
                  backgroundColor: '#111',
                  },
                  QuickLinksSearchContainer: {
                  backgroundColor: '#111',
                  borderBottomColor: 'transparent',
                  borderTopColor: 'transparent',
                  paddingHorizontal:17,
                  paddingTop: 15,
                  },
                  QuickLinksSearchInputContainer: {
                  backgroundColor: '#333',
                  borderRadius: 10,
                  },
                  QuickLinksSearchInput: {
                  color: '#000',
                  },
                  QuickLinksLinksContainer: {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-around',
                  padding: 10,
                  },
                  QuickLinksLinkSquare: {
                  width: '45%',
                  height: 130,
                  padding: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 15,
                  marginBottom: 20,
                  backgroundColor: '#444',
                  borderWidth: 2,
                  borderColor: '#444',
                  elevation: 3, // for Android
                  },
                  QuickLinksLinkText: {
                  color: '#fff',
                  fontSize: 16,
                  marginBottom: 7, // Creates space between the title and the description
                  textAlign: 'center',
                  },
                  QuickLinksLinkDescription: {
                  color: '#ede1d1',
                  fontSize: 11.5,
                  justifyContent:'center',
                  textAlign: 'center',
                  },
                SettingsContainer: {
                    flex: 1,
                    backgroundColor: '#111',
                    padding: 20,
                  },
                    SettingsSettingRow: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  },
                  SettingsSettingText: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#fff',
                  },
                  SettingsHACLogoutButton: {
                    backgroundColor: '#005987',
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginBottom: 20
                  },
                  SettingsLogoutButton: {
                    backgroundColor: '#ff6347',
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginBottom: 20
                  },
                  SettingsLogoutButtonText: {
                    color: '#fff',
                    fontSize: 16,
                    marginLeft: 10,
                  },
                  SplashScreenContainer: {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#111',
                  },
                  SplashScreenLogo: {
                    width: 400,
                    height: 400,
                  },
});

export default DarkStyles;