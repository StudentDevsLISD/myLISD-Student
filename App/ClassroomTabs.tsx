// ClassroomTabs.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { classroom_v1, classroom } from '@googleapis/classroom';
import { OAuth2Client } from 'google-auth-library';

const CLASSROOM_API = classroom('v1');

interface ClassroomTabProps {
  courseId: string;
}

interface Assignment {
  id: string;
  title: string;
}

const ClassroomTab: React.FC<ClassroomTabProps> = ({ courseId }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    fetchAssignments(courseId);
  }, [courseId]);

  const fetchAssignments = async (courseId: string) => {
    try {
      const userInfo = await GoogleSignin.getTokens();

      const auth = new OAuth2Client();;
      auth.setCredentials({ access_token: userInfo.accessToken });

      const res = await CLASSROOM_API.courses.courseWork.list({
        courseId: courseId,
        auth: auth,
      });

      setAssignments(
        res.data.courseWork?.map((courseWork: classroom_v1.Schema$CourseWork) => ({
          id: courseWork.id!,
          title: courseWork.title!,
        })) || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView>
      {assignments.map((assignment) => (
        <Text key={assignment.id}>{assignment.title}</Text>
      ))}
    </ScrollView>
  );
};

interface Course {
  id: string;
  name: string;
  key: string;
}

const ClassroomTabs: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const userInfo = await GoogleSignin.getTokens();

      const auth = new OAuth2Client();
      auth.setCredentials({ access_token: userInfo.accessToken });

      const res = await CLASSROOM_API.courses.list({
        auth: auth,
      });

      setCourses(
        res.data.courses?.map((course: classroom_v1.Schema$Course) => ({
          id: course.id!,
          name: course.name!,
          key: course.id!,
        })) || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={{ backgroundColor: 'white' }}
      style={{ backgroundColor: 'skyblue' }}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes: courses }}
      renderScene={({ route }) => <ClassroomTab courseId={route.id} />}
      onIndexChange={setIndex}
      initialLayout={{ width: 200, height: 200 }}
      renderTabBar={renderTabBar}
    />
  );
};

export default ClassroomTabs;
