import { Subject, SubjectLesson } from "@/types/models/Subject"
import { formatTimestampToDateString } from "@/util/DateTimeUtil"
import React, { useEffect, useState } from "react"
import { Dimensions } from "react-native"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native"

const { width, height } = Dimensions.get("window")

const HomeScreen = () => {
  const [studentName, setStudentName] = useState<string>("")
  const [tuitionCenter, setTuitionCenter] = useState<string>("")
  const [studentSubjects, setStudentSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [upcomingSubjectLesson, setUpcomingSubjectLessons] = useState<
    SubjectLesson[]
  >([])

  useEffect(() => {
    // TODO: HTTP request
    setStudentName("Eugene Lee")
    setTuitionCenter("AGrader Tuition Center (AMK)")
    const subjects: Subject[] = [
      {
        id: "1",
        name: "P5 Science",
        lessons: [
          { id: "1", name: "Respiratory System 2", timestamp: 1672541199000 },
          { id: "2", name: "Respiratory System 1", timestamp: 1672531199000 },
          { id: "3", name: "Respiratory System 3", timestamp: 1672561199000 },
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
    ]
    setStudentSubjects(subjects)
    setSelectedSubject(subjects.length > 0 ? subjects[0].name : "")
    setUpcomingSubjectLessons(subjects.length > 0 ? subjects[0].lessons : [])
  }, [])

  const handleStudentSwitch = () => {
    console.log("switch student")
  }

  const handleSubjectOnPress = (subjectName: string) => {
    setSelectedSubject(subjectName)
  }

  const studentSubjectItems = studentSubjects.map((subject, idx) => (
    <TouchableOpacity
      key={idx}
      style={
        selectedSubject === subject.name
          ? styles.subjectButtonSelected
          : styles.subjectButton
      }
      onPress={() => handleSubjectOnPress(subject.name)}
    >
      <Text
        style={
          selectedSubject === subject.name
            ? styles.subjectTextSelected
            : styles.subjectText
        }
      >
        {subject.name}
      </Text>
    </TouchableOpacity>
  ))

  const handleLessonOnPress = () => {
    console.log("handle lesson on press")
  }

  const studentLessonItems = upcomingSubjectLesson
    .sort(
      (currLesson, nextLesson) => currLesson.timestamp - nextLesson.timestamp
    )
    .map((lesson, idx) => (
      <View key={idx} style={styles.lessonCard}>
        <Text style={styles.lessonTitle}>
          {idx === 0 ? "Most recent class" : "Upcoming class"}
        </Text>
        <Text style={styles.lessonName}>{lesson.name}</Text>
        <Text style={styles.lessonDate}>
          {formatTimestampToDateString(lesson.timestamp)}
        </Text>
        <TouchableOpacity
          style={styles.lessonButton}
          onPress={handleLessonOnPress}
        >
          <Text style={styles.lessonButtonText}>something</Text>
        </TouchableOpacity>
      </View>
    ))

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{studentName}</Text>
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
        {studentLessonItems}
      </ScrollView>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.announcementCard}>
        <Text style={styles.announcementTitle}>Next Exam Countdown</Text>
        <Text style={styles.announcementDays}>40 days</Text>
        <Text style={styles.announcementText}>
          to P5 End-of-Year Exams (School)
        </Text>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  lessonCard: {
    backgroundColor: "#F5F5F5",
    padding: height * 0.02,
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    marginRight: width * 0.03,
  },
  lessonTitle: {
    fontSize: width * 0.035,
    color: "",
    marginBottom: height * 0.005,
  },
  lessonName: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "white",
    marginBottom: height * 0.01,
  },
  lessonDate: {
    fontSize: width * 0.035,
    color: "white",
    marginBottom: height * 0.02,
  },
  lessonButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: width * 0.02,
  },
  lessonButtonText: {
    color: "white",
    textAlign: "center",
  },
  lessonButtonOutlineText: {
    color: "blue",
    textAlign: "center",
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
})

export default HomeScreen
