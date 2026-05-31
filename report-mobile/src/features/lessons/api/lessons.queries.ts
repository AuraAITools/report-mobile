import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { lessonKeys } from "./lessons.keys";

const GetAllLessonsInCourseDocument = graphql(/* GraphQL */ `
  query GetAllLessonsInCourse($institutionId: ID!, $courseId: ID!) {
    getAllLessonsInCourse(institutionId: $institutionId, courseId: $courseId) {
      id
      name
      description
      state
      lessonStartTimestamptz
      lessonEndTimestamptz
      recap
      subjects {
        id
        name
      }
    }
  }
`);

const GetAllLessonsInOutletDocument = graphql(/* GraphQL */ `
  query GetAllLessonsInOutlet($institutionId: ID!, $outletId: ID!) {
    getAllLessonsInOutlet(institutionId: $institutionId, outletId: $outletId) {
      id
      name
      description
      state
      lessonStartTimestamptz
      lessonEndTimestamptz
      course {
        id
        name
      }
    }
  }
`);

const GetLessonByIdDocument = graphql(/* GraphQL */ `
  query GetLessonById($institutionId: ID!, $lessonId: ID!) {
    getLessonById(institutionId: $institutionId, lessonId: $lessonId) {
      id
      name
      description
      state
      lessonStartTimestamptz
      lessonEndTimestamptz
      recap
      course {
        id
        name
      }
      outlet {
        id
        name
      }
      outletRoom {
        id
        name
      }
      educators {
        id
        name
      }
      students {
        id
        name
      }
      subjects {
        id
        name
      }
      topics {
        id
        name
      }
      materials {
        id
        name
        fileUrl
        description
      }
      lessonPlans {
        id
        plan
        state
      }
      lessonObjectives {
        id
        name
        objective
      }
    }
  }
`);

export function useGetAllLessonsInCourse(
  institutionId: string | undefined,
  courseId: string | undefined,
) {
  return useQuery({
    queryKey:
      institutionId && courseId
        ? lessonKeys.byCourse(institutionId, courseId)
        : lessonKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(
        GetAllLessonsInCourseDocument,
        { institutionId: institutionId!, courseId: courseId! },
        signal,
      ),
    enabled: !!institutionId && !!courseId,
    select: (data) => data.getAllLessonsInCourse,
  });
}

export function useGetAllLessonsInOutlet(
  institutionId: string | undefined,
  outletId: string | undefined,
) {
  return useQuery({
    queryKey:
      institutionId && outletId
        ? lessonKeys.byOutlet(institutionId, outletId)
        : lessonKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(
        GetAllLessonsInOutletDocument,
        { institutionId: institutionId!, outletId: outletId! },
        signal,
      ),
    enabled: !!institutionId && !!outletId,
    select: (data) => data.getAllLessonsInOutlet,
  });
}

export function useGetLessonById(
  institutionId: string | undefined,
  lessonId: string | undefined,
) {
  return useQuery({
    queryKey:
      institutionId && lessonId
        ? lessonKeys.byId(institutionId, lessonId)
        : lessonKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(
        GetLessonByIdDocument,
        { institutionId: institutionId!, lessonId: lessonId! },
        signal,
      ),
    enabled: !!institutionId && !!lessonId,
    select: (data) => data.getLessonById,
  });
}
