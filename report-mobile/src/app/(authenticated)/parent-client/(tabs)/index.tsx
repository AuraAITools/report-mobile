import React, { useEffect, useMemo, useState } from "react";
import { Dimensions } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LessonCard from "@/components/ui/LessonCard";
import { Exam } from "@/types/models/Exam";
import { Subject } from "@/types/models/Subject";
import { getDayDifference } from "@/utils/DateTimeUtil";
import { binarySearchUpperBound } from "@/utils/Utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { Lesson } from "@/types/models/Lesson";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const router = useRouter();
  const { userInfo } = useAuth();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(authenticated)");
    }
  };
  const [tuitionCenter, setTuitionCenter] = useState<string>("");
  const [studentSubjects, setStudentSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject>();
  const [subjectLesson, setSubjectLesson] = useState<Lesson[]>([]);
  const [nextExam, setNextExam] = useState<Exam>();

  useEffect(() => {
    // Initial data fetch or setup
    setTuitionCenter("AGrader Tuition Center (AMK)");

    const subjects: Subject[] = [
      {
        id: "1",
        name: "P5 Science",
        lessons: [
          { id: "1", name: "Respiratory System 2", timestamp: 1672541199001 },
          { id: "2", name: "Respiratory System 1", timestamp: 1672531199005 },
          { id: "3", name: "Respiratory System 3", timestamp: 1672561199010 },
        ],
      },
      {
        id: "2",
        name: "P5 Chinese",
        lessons: [
          { id: "1", name: "Chinese Lesson 1", timestamp: 1672531199000 },
        ],
      },
      {
        id: "3",
        name: "P5 Math",
        lessons: [{ id: "1", name: "Math Lesson 1", timestamp: 1672531199000 }],
      },
      {
        id: "4",
        name: "P5 Music",
        lessons: [{ id: "1", name: "Music Lesson 1", timestamp: 167253119900 }],
      },
      {
        id: "5",
        name: "P5 Art",
        lessons: [{ id: "1", name: "Art Lesson 1", timestamp: 1672531199000 }],
      },
    ];
    setStudentSubjects(subjects);
    if (subjects.length > 0) {
      setSelectedSubject(subjects[0]);
      setSubjectLesson(
        subjects[0].lessons.sort(
          (currLesson, nextLesson) =>
            currLesson.timestamp - nextLesson.timestamp
        ) // Will be best if we can do in db
      );
    }
    setNextExam({
      name: "P5 End-of-Year Exams (School)",
      timestamp: 1726639043000,
    });
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      setSubjectLesson(
        selectedSubject.lessons.sort(
          (currLesson, nextLesson) =>
            currLesson.timestamp - nextLesson.timestamp
        )
      );
    }
  }, [selectedSubject, studentSubjects]);

  const lessonUpperIndex = useMemo(() => {
    return binarySearchUpperBound(
      subjectLesson.map((lesson) => lesson.timestamp),
      Date.now()
    );
  }, [subjectLesson]);

  const pastLesson = useMemo(() => {
    return lessonUpperIndex === 0 ? null : subjectLesson[lessonUpperIndex - 1];
  }, [lessonUpperIndex, subjectLesson]);

  const upcomingLesson = useMemo(() => {
    return subjectLesson[lessonUpperIndex];
  }, [lessonUpperIndex, subjectLesson]);

  const handleStudentSwitch = () => {
    console.log("switch student");
  };

  const handleSubjectOnPress = (subject: Subject) => {
    setSelectedSubject(subject);
  };

  const studentSubjectItems = studentSubjects.map((subject, idx) => (
    <TouchableOpacity
      key={idx}
      style={
        selectedSubject?.name === subject.name
          ? styles.subjectButtonSelected
          : styles.subjectButton
      }
      onPress={() => handleSubjectOnPress(subject)}
    >
      <Text
        style={
          selectedSubject?.name === subject.name
            ? styles.subjectTextSelected
            : styles.subjectText
        }
      >
        {subject.name}
      </Text>
    </TouchableOpacity>
  ));

  const handleLessonOnPress = () => {
    console.log("handle lesson on press");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.backRow}>
        <TouchableOpacity
          onPress={handleBack}
          testID="parent-home-back"
          hitSlop={12}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color="#374151" />
          <Text style={styles.backLabel}>Accounts</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container} testID="home-screen">
        <View style={styles.header} testID="home-header">
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{userInfo?.name}</Text>
          <TouchableOpacity onPress={handleStudentSwitch}>
            <Text style={styles.switch}>Switch</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.center}>{tuitionCenter}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.subjects}
        testID="subjects-list"
      >
        {studentSubjectItems}
      </ScrollView>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lessons</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.lessons}
      >
        {pastLesson && (
          <LessonCard
            title={"Most recent class"}
            lesson={pastLesson}
            theme={"blue"}
            handleLessonOnPress={handleLessonOnPress}
            buttonText={"View student review"}
            testID="lesson-card-recent"
          />
        )}
        {upcomingLesson && (
          <LessonCard
            title={"Upcoming class"}
            lesson={upcomingLesson}
            theme={"gray"}
            handleLessonOnPress={handleLessonOnPress}
            buttonText={"View lesson plan"}
            testID="lesson-card-upcoming"
          />
        )}
      </ScrollView>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.announcementCard} testID="announcement-card">
        <Text style={styles.announcementTitle}>Next Exam Countdown</Text>
        <Text style={styles.announcementDays}>
          {getDayDifference(nextExam?.timestamp as number)} days
        </Text>
        <Text style={styles.announcementText}>to {nextExam?.name}</Text>
      </View>

      <View style={styles.registrationCard}>
        <Image
          style={styles.registrationImage}
          source={{ uri: "https://something-here" }}
        />
        <Text style={styles.registrationText}>
          Registration for Academic Year 2024 Starts Now!
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.02,
    paddingTop: height * 0.005,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.008,
  },
  backLabel: {
    fontSize: width * 0.04,
    color: "#374151",
  },
  header: {
    padding: height * 0.02,
  },
  headerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  switch: {
    color: "grey",
  },
  center: {
    marginTop: height * 0.01,
    fontSize: width * 0.04,
    color: "gray",
  },
  subjects: {
    marginBottom: height * 0.01,
    paddingLeft: width * 0.04,
  },
  subjectButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    backgroundColor: "#f0f0f0",
    borderRadius: width * 0.06,
    marginRight: width * 0.03,
  },
  subjectButtonSelected: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    backgroundColor: "#ff6347",
    borderRadius: width * 0.06,
    marginRight: width * 0.03,
  },
  subjectText: {
    color: "black",
  },
  subjectTextSelected: {
    color: "white",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: "800",
  },
  seeAll: {
    color: "grey",
  },
  lessons: {
    marginVertical: height * 0.015,
    paddingLeft: width * 0.04,
  },
  announcementCard: {
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.015,
    padding: height * 0.02,
    borderRadius: width * 0.02,
    backgroundColor: "#FFF16F",
  },
  announcementTitle: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "black",
  },
  announcementDays: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginVertical: height * 0.005,
  },
  announcementText: {
    fontSize: width * 0.035,
    color: "black",
  },
  registrationCard: {
    marginHorizontal: width * 0.04,
    marginBottom: height * 0.015,
    padding: height * 0.02,
    borderRadius: width * 0.02,
    backgroundColor: "#f0f0f0",
  },
  registrationImage: {
    width: "100%",
    height: height * 0.125,
    marginBottom: height * 0.01,
  },
  registrationText: {
    fontSize: width * 0.035,
    color: "black",
  },
});

export default HomeScreen;
