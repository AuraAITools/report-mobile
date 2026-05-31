import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { useGetInstitutionsByIds } from "@/features/institutions";
import { outletKeys } from "./outlets.keys";

const GetOutletsInInstitutionDocument = graphql(/* GraphQL */ `
  query GetOutletsInInstitution($institutionId: ID!) {
    getOutletsInInstitution(institutionId: $institutionId) {
      id
      name
      address
      email
      contactNumber
      postalCode
      description
    }
  }
`);

export function useGetOutletsInInstitution(institutionId: string | undefined) {
  return useQuery({
    queryKey: institutionId
      ? outletKeys.byInstitution(institutionId)
      : outletKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(
        GetOutletsInInstitutionDocument,
        { institutionId: institutionId! },
        signal,
      ),
    enabled: !!institutionId,
    select: (data) => data.getOutletsInInstitution,
  });
}

export type OutletWithInstitution = {
  id: string;
  name: string;
  address: string;
  email: string;
  contactNumber: number;
  postalCode: number;
  description: string;
  institutionId: string;
};

/**
 * Derives a flat list of outlets across multiple institutions by reading from
 * the institutions query (which already includes nested outlets). Avoids
 * fanning out N parallel requests.
 */
export function useGetAllOutletsAcrossInstitutions(
  institutionIds: readonly string[],
) {
  const query = useGetInstitutionsByIds(institutionIds);

  const outlets = useMemo<OutletWithInstitution[]>(() => {
    if (!query.data) return [];
    return query.data.flatMap((institution) =>
      institution.outlets.map((outlet) => ({
        id: outlet.id,
        name: outlet.name,
        address: outlet.address,
        email: outlet.email,
        contactNumber: outlet.contactNumber,
        postalCode: outlet.postalCode,
        description: outlet.description,
        institutionId: institution.id,
      })),
    );
  }, [query.data]);

  return { ...query, data: outlets };
}
