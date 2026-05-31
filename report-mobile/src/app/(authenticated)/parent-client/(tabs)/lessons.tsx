import React, { useEffect, useMemo, useState } from "react"
import { Dimensions } from "react-native"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native"
import { Subject } from "@/types/models/Subject"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Lesson } from "@/types/models/Lesson"
import { parse } from "date-fns"
const { width, height } = Dimensions.get("window")

interface LessonWithFlags extends Lesson {
  mostRecent?: boolean
  upcoming?: boolean
}

interface GroupedLessons {
  monthYear: string
  lessons: LessonWithFlags[]
}

const LessonScreen = () => {
  const [studentSubjects, setStudentSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject>()
  const [subjectLesson, setSubjectLesson] = useState<Lesson[]>([])

  const groupLessonsByMonthAndYear = (lessons: Lesson[]): GroupedLessons[] => {
    const lessonsCopy: LessonWithFlags[] = lessons.map((lesson) => ({ ...lesson }))
    lessonsCopy.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    const currentDate = new Date()

    let mostRecentLesson: LessonWithFlags | null = null
    let upcomingLesson: LessonWithFlags | null = null

    for (const lesson of lessonsCopy) {
      const lessonDate = new Date(lesson.timestamp)

      if (lessonDate <= currentDate) {
        if (!mostRecentLesson || lessonDate > new Date(mostRecentLesson.timestamp)) {
          mostRecentLesson = lesson
        }
      } else {
        if (!upcomingLesson) {
          upcomingLesson = lesson
          break
        }
      }
    }

    if (mostRecentLesson) {
      mostRecentLesson.mostRecent = true
    }

    if (upcomingLesson) {
      upcomingLesson.upcoming = true
    }

    const groupedLessonsMap: { [key: string]: LessonWithFlags[] } = {}

    for (const lesson of lessonsCopy) {
      const lessonDate = new Date(lesson.timestamp)
      const monthYear = lessonDate.toLocaleString("default", {
        month: "short",
        year: "numeric",
      })

      if (!groupedLessonsMap[monthYear]) {
        groupedLessonsMap[monthYear] = []
      }

      groupedLessonsMap[monthYear].push(lesson)
    }

    const sortedMonthYears = Object.keys(groupedLessonsMap).sort((a, b) => {
      const dateA = parse(a, "MMM yyyy", new Date())
      const dateB = parse(b, "MMM yyyy", new Date())
      return dateB.getTime() - dateA.getTime()
    })

    const groupedLessons: GroupedLessons[] = sortedMonthYears.map((monthYear) => {
      const lessonsInMonth = groupedLessonsMap[monthYear]
      lessonsInMonth.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

      return {
        monthYear,
        lessons: lessonsInMonth,
      }
    })

    return groupedLessons
  }

  useEffect(() => {
    // Initial data fetch or setup
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
      setSelectedSubject(subjects[0])
      setSubjectLesson(subjects[0].lessons)
    }
  }, [])

  const handleLessonFilter = () => {
    console.log("switch Lesson")
  }

  const handleSubjectOnPress = (subject: Subject) => {
    setSelectedSubject(subject)
    setSubjectLesson(subject.lessons)
  }

  const studentSubjectItems = studentSubjects.map((subject, idx) => (
    <TouchableOpacity
      key={idx}
      style={selectedSubject?.name === subject.name ? styles.subjectButtonSelected : styles.subjectButton}
      onPress={() => handleSubjectOnPress(subject)}
    >
      <Text style={selectedSubject?.name === subject.name ? styles.subjectTextSelected : styles.subjectText}>
        {subject.name}
      </Text>
    </TouchableOpacity>
  ))

  const mapLessonToCard = (lessons: LessonWithFlags[]) => {
    return lessons.map((lesson, idx) => {
      return (
        <View key={idx} style={[styles.card, lesson.mostRecent && styles.completedCard]} testID={`lesson-card-${idx}`}>
          {lesson.mostRecent && <Text style={styles.label}>Most recent completed</Text>}
          {lesson.upcoming && <Text style={styles.label}>Next upcoming</Text>}
          <Text style={styles.title}>INSERT LESSON NUMBER HERE</Text>
          <Text style={styles.subtitle}>{lesson.name}</Text>
          <Text style={styles.date}>INSERT LESSON DURATION & DATE HERE</Text>
        </View>
      )
    })
  }

  const studentSubjectLessons = useMemo(
    () =>
      groupLessonsByMonthAndYear(subjectLesson).map((lessonGroup, idx) => {
        return (
          <View key={idx}>
            <Text style={styles.dateHeader}>{lessonGroup.monthYear}</Text>
            {mapLessonToCard(lessonGroup.lessons)}
          </View>
        )
      }),
    [subjectLesson]
  )

  return (
    <View style={styles.container} testID="lessons-screen">
      <View>
        <View style={styles.header}>
          <Text style={styles.name}>Lessons</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjects}>
          {studentSubjectItems}
        </ScrollView>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome style={styles.searchIcon} size={16} name='search' color={"#828282"} />
          <TextInput style={styles.searchInput} placeholder='Search' />
        </View>
        <TouchableOpacity onPress={handleLessonFilter}>
          <Text style={styles.filterButtonText}>Filter View</Text>
        </TouchableOpacity>
      </View>
      <ScrollView testID="lessons-list">{studentSubjectLessons}</ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: height * 0.02,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  name: {
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  subjects: {
    marginBottom: height * 0.02,
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
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: height * 0.05,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    marginRight: width * 0.04,
    backgroundColor: "white",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    marginLeft: 4,
    flex: 1,
    fontSize: 16,
  },
  filterButtonText: {
    color: "grey",
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: "#004E89",
    borderColor: "#004E89",
  },
  upcomingCard: {
    backgroundColor: "#FFF",
    borderColor: "##004E89",
  },
  announcementCard: {
    backgroundColor: "#FFF",
    borderColor: "#FF6B35",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
  },
})

export default LessonScreen
