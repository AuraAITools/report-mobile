import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { institutionKeys } from "./institutions.keys";

const GetInstitutionDocument = graphql(/* GraphQL */ `
  query GetInstitution($institutionId: ID!) {
    getInstitution(institutionId: $institutionId) {
      id
      name
      email
      uen
      address
      contactNumber
      logoUrl
      profileImageUrl
      state
      outlets {
        id
        name
        address
        email
        contactNumber
        postalCode
        description
      }
    }
  }
`);

const GetInstitutionsByIdsDocument = graphql(/* GraphQL */ `
  query GetInstitutionsByIds($institutionIds: [ID!]!) {
    getInstitutionsByIds(institutionIds: $institutionIds) {
      id
      name
      email
      uen
      address
      contactNumber
      logoUrl
      profileImageUrl
      state
      outlets {
        id
        name
        address
        email
        contactNumber
        postalCode
        description
      }
    }
  }
`);

export function useGetInstitution(institutionId: string | undefined) {
  return useQuery({
    queryKey: institutionId
      ? institutionKeys.byId(institutionId)
      : institutionKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(
        GetInstitutionDocument,
        { institutionId: institutionId! },
        signal,
      ),
    enabled: !!institutionId,
    select: (data) => data.getInstitution,
  });
}

export function useGetInstitutionsByIds(institutionIds: readonly string[]) {
  return useQuery({
    queryKey: institutionKeys.byIds(institutionIds),
    queryFn: ({ signal }) =>
      graphqlClient(
        GetInstitutionsByIdsDocument,
        { institutionIds: [...institutionIds] },
        signal,
      ),
    enabled: institutionIds.length > 0,
    select: (data) => data.getInstitutionsByIds,
  });
}
