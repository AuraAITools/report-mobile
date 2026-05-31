import { BaseInstitution } from "@/types/data/Institution";
import { queryKeyFactory } from "@/utils/query-key-factory";
import { useQueries } from "@tanstack/react-query";
import { getInstitutionById } from "../requests/institutions";

export const institutionQueryKeys = queryKeyFactory("institutions");

function useGetInstitutionByIds(institutionIds: string[]) {
  console.log(`${JSON.stringify(institutionIds)}`);

  return useQueries({
    queries: institutionIds.map((institutionId) => ({
      queryFn: async () => getInstitutionById(institutionId),
      queryKey: institutionQueryKeys.detail(institutionId), // creates a [institutions, detail, id] cache
      enabled: !!institutionId,
    })),
    combine: (results) => ({
      data: results.map((res) => res.data) as BaseInstitution[],
      isPending: results.some((res) => res.isPending),
      isError: results.some((res) => res.isError),
      refetch: () => {
        results.forEach((res) => res.refetch());
      },
    }),
  });
}

export const InstitutionsApi = {
  useGetInstitutionByIds,
};
