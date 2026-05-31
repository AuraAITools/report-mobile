import { graphql } from "@/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { queryKeyFactory } from "@/utils/query-key-factory";
import { skipToken, useQuery } from "@tanstack/react-query";

export const schoolsQueryKeys = queryKeyFactory("schools");

const GetSchoolsInInstitution = graphql(`
  query GetSchoolsInInstitution($institutionId: ID!) {
    getSchoolsInInstitution(institutionId: $institutionId) {
      id
      name
      schoolCategory
      createdAt
      updatedAt
      createdBy {
        userId
        accountId
        name
        url
      }
      updatedBy {
        userId
        accountId
        name
        url
      }
    }
  }
`);

function useGetAllSchoolsInInstitution(institutionId?: string) {
  return useQuery({
    queryKey: schoolsQueryKeys.institutionScopedList(institutionId),
    queryFn: institutionId
      ? async ({ signal }) => {
          const data = await graphqlClient(
            GetSchoolsInInstitution,
            { institutionId },
            signal,
          );
          return data.getSchoolsInInstitution;
        }
      : skipToken,
  });
}

export const SchoolsApis = {
  useGetAllSchoolsInInstitution,
};
