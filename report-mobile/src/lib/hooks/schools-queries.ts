import { queryKeyFactory } from "@/utils/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { getAllSchoolsInInstitution } from "../requests/schools";

export const accountQueryKeys = queryKeyFactory("schools");

function useGetAllSchoolsInInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("institutionId is undefined");
      }
      return getAllSchoolsInInstitution(institutionId);
    },
    queryKey: accountQueryKeys.institutionLists(institutionId),
    enabled: !!institutionId,
  });
}

export const SchoolsApis = {
  useGetAllSchoolsInInstitution,
};
