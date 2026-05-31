import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { accountKeys } from "./account.keys";

const GetAccountByIdDocument = graphql(/* GraphQL */ `
  query GetAccountById($accountId: ID!) {
    getAccountById(accountId: $accountId) {
      id
      userId
      firstName
      lastName
      status
      profileImageUrl
      educatorFeatureEnabled
      parentFeatureEnabled
      staffFeatureEnabled
      parent {
        id
        relationship
        profileImageUrl
      }
      students {
        id
        name
        email
        dateOfBirth
        profileImageUrl
      }
      educators {
        id
        name
        email
        employmentType
      }
    }
  }
`);

export const GetAccountByUserIdDocument = graphql(/* GraphQL */ `
  query GetAccountByUserId($institutionId: ID!, $userId: ID!) {
    getAccountByUserId(institutionId: $institutionId, userId: $userId) {
      id
      userId
      firstName
      lastName
      status
      profileImageUrl
      educatorFeatureEnabled
      parentFeatureEnabled
      staffFeatureEnabled
      parent {
        id
        relationship
        profileImageUrl
      }
      students {
        id
        name
        email
        dateOfBirth
        profileImageUrl
      }
      educators {
        id
        name
        email
        employmentType
      }
    }
  }
`);

const GetAllAccountsInInstitutionDocument = graphql(/* GraphQL */ `
  query GetAllAccountsInInstitution($institutionId: ID!) {
    getAllAccountsInInstitution(institutionId: $institutionId) {
      id
      userId
      firstName
      lastName
      status
      profileImageUrl
      parentFeatureEnabled
      educatorFeatureEnabled
      staffFeatureEnabled
    }
  }
`);

export function useGetAccountById(accountId: string | undefined) {
  return useQuery({
    queryKey: accountId ? accountKeys.byId(accountId) : accountKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(GetAccountByIdDocument, { accountId: accountId! }, signal),
    enabled: !!accountId,
    select: (data) => data.getAccountById,
  });
}

export function useGetAccountByUserId(
  institutionId: string | undefined,
  userId: string | undefined,
) {
  return useQuery({
    queryKey:
      institutionId && userId
        ? accountKeys.byUserAndInstitution(institutionId, userId)
        : accountKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(
        GetAccountByUserIdDocument,
        { institutionId: institutionId!, userId: userId! },
        signal,
      ),
    enabled: !!institutionId && !!userId,
    select: (data) => data.getAccountByUserId,
  });
}

export function useGetAllAccountsInInstitution(institutionId: string | undefined) {
  return useQuery({
    queryKey: institutionId
      ? accountKeys.byInstitution(institutionId)
      : accountKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(
        GetAllAccountsInInstitutionDocument,
        { institutionId: institutionId! },
        signal,
      ),
    enabled: !!institutionId,
    select: (data) => data.getAllAccountsInInstitution,
  });
}

export function useGetMyAccountInInstitution(
  institutionId: string | undefined,
  userId: string | undefined,
) {
  return useQuery({
    queryKey:
      institutionId && userId
        ? accountKeys.myAccount(institutionId, userId)
        : accountKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(
        GetAllAccountsInInstitutionDocument,
        { institutionId: institutionId! },
        signal,
      ),
    enabled: !!institutionId && !!userId,
    select: (data) =>
      data.getAllAccountsInInstitution.find((a) => a.userId === userId),
  });
}
