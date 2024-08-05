import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"

type Subject = {
  name: string
  lessons: SubjectLesson[]
}

type SubjectLesson = {
  name: string
  date: string
}

const HomeScreen = () => {
  const [studentName, setStudentName] = useState<string>("")
  const [tuitionCenter, setTuitionCenter] = useState<string>("")
  const [studentSubjects, setStudentSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [subjectLessons, setSubjectLessons] = useState<SubjectLesson[]>([])

  useEffect(() => {
    // TODO: HTTP request
    setStudentName("Eugene Lee")
    setTuitionCenter("AGrader Tuition Center (AMK)")
    const subjects: Subject[] = [
      {
        name: "P5 Science",
        lessons: [
          { name: "Respiratory System 1", date: "3 April 2024, 01:15 PM" },
          { name: "Respiratory System 1", date: "3 April 2024, 01:15 PM" },
        ],
      },
      {
        name: "P5 Chinese",
        lessons: [{ name: "Chinese Lesson 1", date: "4 April 2024, 02:15 PM" }],
      },
      {
        name: "P5 Math",
        lessons: [{ name: "Math Lesson 1", date: "5 April 2024, 03:15 PM" }],
      },
    ]
    setStudentSubjects(subjects)
    setSelectedSubject(subjects.length > 0 ? subjects[0].name : "")
    setSubjectLessons(subjects.length > 0 ? subjects[0].lessons : [])
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

  const studentLessonItems = subjectLessons.map((lesson, idx) => (
    <View style={styles.lessonCard}>
      <Text style={styles.lessonTitle}>test</Text>
      <Text style={styles.lessonName}>{lesson.name}</Text>
      <Text style={styles.lessonDate}>{lesson.date}</Text>
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

      <View style={styles.subjects}>{studentSubjectItems}</View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lessons</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.lessons}>{studentLessonItems}</View>

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
          source={{ uri: "https://your-image-url" }}
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
    padding: 16,
  },
  headerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  switch: {
    color: "grey",
  },
  center: {
    fontSize: 16,
    color: "gray",
  },
  subjects: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  subjectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
  },
  subjectButtonSelected: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ff6347",
    borderRadius: 16,
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
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    color: "grey",
  },
  lessons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    columnGap: 12,
    marginHorizontal: 16,
  },
  lessonCard: {
    backgroundColor: "#005B9A",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  lessonTitle: {
    fontSize: 14,
    color: "white",
    marginBottom: 4,
  },
  lessonName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  lessonDate: {
    fontSize: 14,
    color: "white",
    marginBottom: 16,
  },
  lessonButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
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
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FFF16F",
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  announcementDays: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 4,
  },
  announcementText: {
    fontSize: 14,
    color: "black",
  },
  registrationCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  registrationImage: {
    width: "100%",
    height: 100,
    marginBottom: 8,
  },
  registrationText: {
    fontSize: 14,
    color: "black",
  },
})

export default HomeScreen
