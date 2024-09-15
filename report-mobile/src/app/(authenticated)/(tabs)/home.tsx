import React, { useEffect, useMemo, useState } from "react"
import { Dimensions } from "react-native"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native"
import LessonCard from "@/components/ui/LessonCard"
import { Exam } from "@/types/models/Exam"
import { Subject, SubjectLesson } from "@/types/models/Subject"
import { getDayDifference } from "@/util/DateTimeUtil"
import { binarySearchUpperBound } from "@/util/Utils"
import { useAuth } from "@/providers/AuthProvider"

const { width, height } = Dimensions.get("window")

const HomeScreen = () => {

  const {userDetails} = useAuth();
  const [studentName, setStudentName] = useState<string>("")
  const [tuitionCenter, setTuitionCenter] = useState<string>("")
  const [studentSubjects, setStudentSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [subjectLesson, setSubjectLesson] = useState<SubjectLesson[]>([])
  const [nextExam, setNextExam] = useState<Exam>()

  useEffect(() => {
    // Initial data fetch or setup
    setStudentName("Eugene Lee")
    setTuitionCenter("AGrader Tuition Center (AMK)")

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
        lessons: [{ id: "1", name: "Chinese Lesson 1", timestamp: 1672531199000 }],
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
    if (subjects.length > 0) {
      setSelectedSubject(subjects[0].name)
      setSubjectLesson(
        subjects[0].lessons.sort((currLesson, nextLesson) => currLesson.timestamp - nextLesson.timestamp) // Will be best if we can do in db
      )
    }
    setNextExam({
      name: "P5 End-of-Year Exams (School)",
      timestamp: 1726639043000,
    })
  }, [])

  useEffect(() => {
    const selectedSubjectData = studentSubjects.find((subject) => subject.name === selectedSubject)
    if (selectedSubjectData) {
      setSubjectLesson(
        selectedSubjectData.lessons.sort((currLesson, nextLesson) => currLesson.timestamp - nextLesson.timestamp)
      )
    }
  }, [selectedSubject, studentSubjects])

  const lessonUpperIndex = useMemo(() => {
    return binarySearchUpperBound(
      subjectLesson.map((lesson) => lesson.timestamp),
      Date.now()
    )
  }, [subjectLesson])

  const pastLesson = useMemo(() => {
    return lessonUpperIndex === 0 ? null : subjectLesson[lessonUpperIndex - 1]
  }, [lessonUpperIndex, subjectLesson])

  const upcomingLesson = useMemo(() => {
    return subjectLesson[lessonUpperIndex]
  }, [lessonUpperIndex, subjectLesson])

  const handleStudentSwitch = () => {
    console.log("switch student")
  }

  const handleSubjectOnPress = (subjectName: string) => {
    setSelectedSubject(subjectName)
  }

  const studentSubjectItems = studentSubjects.map((subject, idx) => (
    <TouchableOpacity
      key={idx}
      style={selectedSubject === subject.name ? styles.subjectButtonSelected : styles.subjectButton}
      onPress={() => handleSubjectOnPress(subject.name)}
    >
      <Text style={selectedSubject === subject.name ? styles.subjectTextSelected : styles.subjectText}>
        {subject.name}
      </Text>
    </TouchableOpacity>
  ))

  const handleLessonOnPress = () => {
    console.log("handle lesson on press")
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{userDetails?.name}</Text>
          <TouchableOpacity onPress={handleStudentSwitch}>
            <Text style={styles.switch}>Switch</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.center}>{tuitionCenter}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjects}>
        {studentSubjectItems}
      </ScrollView>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lessons</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.lessons}>
        {pastLesson && (
          <LessonCard
            title={"Most recent class"}
            lesson={pastLesson}
            theme={"blue"}
            handleLessonOnPress={handleLessonOnPress}
            buttonText={"View student review"}
          />
        )}
        {upcomingLesson && (
          <LessonCard
            title={"Upcoming class"}
            lesson={upcomingLesson}
            theme={"gray"}
            handleLessonOnPress={handleLessonOnPress}
            buttonText={"View lesson plan"}
          />
        )}
      </ScrollView>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.announcementCard}>
        <Text style={styles.announcementTitle}>Next Exam Countdown</Text>
        <Text style={styles.announcementDays}>{getDayDifference(nextExam?.timestamp as number)} days</Text>
        <Text style={styles.announcementText}>to {nextExam?.name}</Text>
      </View>

      <View style={styles.registrationCard}>
        <Image style={styles.registrationImage} source={{ uri: "https://something-here" }} />
        <Text style={styles.registrationText}>Registration for Academic Year 2024 Starts Now!</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.04,
  },
  header: {
    paddingVertical: height * 0.02,
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
  },
  announcementCard: {
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
    marginBottom: height * 0.015,
    paddingVertical: height * 0.02,
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
