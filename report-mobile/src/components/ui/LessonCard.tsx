import { SubjectLesson } from "@/types/models/Subject"
import { formatTimestampToDateString } from "@/util/DateTimeUtil"
import { View, Text, TouchableOpacity, GestureResponderEvent, StyleSheet, Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")
type Theme = "blue" | "gray"

type Props = {
  title: string
  lesson: SubjectLesson
  theme: Theme
  handleLessonOnPress: (event: GestureResponderEvent) => void
  buttonText: string
}

const LessonCard: React.FC<Props> = ({ title, lesson, theme, handleLessonOnPress, buttonText }) => {
  const styles = themeStyles[theme]
  return (
    <View style={styles.lessonCard}>
      <Text style={styles.lessonTitle}>{title}</Text>
      <Text style={styles.lessonName}>{lesson.name}</Text>
      <Text style={styles.lessonDate}>{formatTimestampToDateString(lesson.timestamp)}</Text>
      <TouchableOpacity style={styles.lessonButton} onPress={handleLessonOnPress}>
        <Text style={styles.lessonButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  )
}

const baseStyles = {
  lessonCard: {
    padding: height * 0.02,
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    marginRight: width * 0.03,
  },
  lessonTitle: {
    fontSize: width * 0.035,
    marginBottom: height * 0.005,
  },
  lessonName: {
    fontSize: width * 0.045,
    fontWeight: "bold" as "bold",
    marginBottom: height * 0.01,
  },
  lessonDate: {
    fontSize: width * 0.035,
    marginBottom: height * 0.02,
  },
  lessonButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderWidth: 1,
    borderRadius: width * 0.1,
  },
  lessonButtonText: {
    textAlign: "center" as "center",
  },
}

const themeStyles = {
  blue: StyleSheet.create({
    lessonCard: {
      ...baseStyles.lessonCard,
      backgroundColor: "#004E89",
      color: "white",
    },
    lessonTitle: {
      ...baseStyles.lessonTitle,
      color: "white",
    },
    lessonName: {
      ...baseStyles.lessonName,
      color: "white",
    },
    lessonDate: {
      ...baseStyles.lessonDate,
      color: "white",
    },
    lessonButton: {
      ...baseStyles.lessonButton,
      borderColor: "white",
      color: "white",
    },
    lessonButtonText: {
      ...baseStyles.lessonButtonText,
      color: "white",
    },
  }),
  gray: StyleSheet.create({
    lessonCard: {
      ...baseStyles.lessonCard,
      backgroundColor: "#F5F5F5",
      color: "black",
    },
    lessonTitle: baseStyles.lessonTitle,
    lessonName: baseStyles.lessonName,
    lessonDate: baseStyles.lessonDate,
    lessonButton: {
      ...baseStyles.lessonButton,
      borderColor: "black",
    },
    lessonButtonText: baseStyles.lessonButtonText,
  }),
}

export default LessonCard
