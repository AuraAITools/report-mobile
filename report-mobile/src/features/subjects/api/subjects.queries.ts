import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { subjectKeys } from "./subjects.keys";

const GetAllSubjectsInInstitutionDocument = graphql(/* GraphQL */ `
  query GetAllSubjectsInInstitution($institutionId: ID!) {
    getAllSubjectsInInstitution(institutionId: $institutionId) {
      id
      name
    }
  }
`);

export function useGetAllSubjectsInInstitution(institutionId: string | undefined) {
  return useQuery({
    queryKey: institutionId
      ? subjectKeys.byInstitution(institutionId)
      : subjectKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(
        GetAllSubjectsInInstitutionDocument,
        { institutionId: institutionId! },
        signal,
      ),
    enabled: !!institutionId,
    select: (data) => data.getAllSubjectsInInstitution,
  });
}
