export type SubjectLesson = {
  id: string
  name: string
  timestamp: number
}

export type Subject = {
  id: string
  name: string
  lessons: SubjectLesson[]
}
