import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { studentKeys } from "./students.keys";

const GetAllStudentsInInstitutionDocument = graphql(/* GraphQL */ `
  query GetAllStudentsInInstitution($institutionId: ID!) {
    getAllStudentsInInstitution(institutionId: $institutionId) {
      id
      name
      email
      dateOfBirth
      profileImageUrl
      level {
        id
        name
        category
      }
      school {
        id
        name
        schoolCategory
      }
    }
  }
`);

const GetStudentByIdDocument = graphql(/* GraphQL */ `
  query GetStudentById($input: GetStudentByIdInput!) {
    getStudentById(input: $input) {
      id
      name
      email
      dateOfBirth
      profileImageUrl
      level {
        id
        name
        category
      }
      school {
        id
        name
        schoolCategory
      }
      courses {
        id
        name
        lessonFrequency
        courseStartTimestamptz
        courseEndTimestamptz
        subjects {
          id
          name
        }
      }
    }
  }
`);

export function useGetAllStudentsInInstitution(
  institutionId: string | undefined,
) {
  return useQuery({
    queryKey: institutionId
      ? studentKeys.byInstitution(institutionId)
      : studentKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(
        GetAllStudentsInInstitutionDocument,
        { institutionId: institutionId! },
        signal,
      ),
    enabled: !!institutionId,
    select: (data) => data.getAllStudentsInInstitution,
  });
}

export function useGetStudentById(
  institutionId: string | undefined,
  studentId: string | undefined,
) {
  return useQuery({
    queryKey:
      institutionId && studentId
        ? studentKeys.byId(institutionId, studentId)
        : studentKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(
        GetStudentByIdDocument,
        { input: { institutionId: institutionId!, id: studentId! } },
        signal,
      ),
    enabled: !!institutionId && !!studentId,
    select: (data) => data.getStudentById,
  });
}
