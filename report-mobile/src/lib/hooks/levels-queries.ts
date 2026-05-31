import { BaseCourse } from "@/types/data/Course";
import { BaseEducator } from "@/types/data/Educator";
import { BaseLevel } from "@/types/data/Level";
import { BaseStudent } from "@/types/data/Student";
import { BaseSubject } from "@/types/data/Subject";
import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLevelInInstitution,
  getAllExpandedLevelsOfInstitution,
  getAllLevelsOfInstitution,
  updateLevelInInstitution,
} from "../requests/levels";

export type ExpandedLevel = BaseLevel & {
  courses: BaseCourse[];
  students: BaseStudent[];
  educators: BaseEducator[];
  subjects: BaseSubject[];
};

export const levelsQueryKeys = queryKeyFactory("levels");
function useCreateLevelOfInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLevelInInstitution,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({
        queryKey: levelsQueryKeys.institutionLists(variables.institution_id),
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

export function useUpdateLevelInInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLevelInInstitution,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({
        queryKey: levelsQueryKeys.institutionLists(variables.institution_id),
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

function useGetAllLevelsOfInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("institution ID is undefined");
      }
      return getAllLevelsOfInstitution(institutionId);
    },
    queryKey: levelsQueryKeys.institutionLists(institutionId),
    enabled: !!institutionId,
  });
}

function useGetAllExpandedLevelsOfInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("institution ID is undefined");
      }
      return getAllExpandedLevelsOfInstitution(institutionId);
    },
    queryKey: levelsQueryKeys.institutionLists(institutionId),
    enabled: !!institutionId,
  });
}

export const LevelsApis = {
  useCreateLevelOfInstitution,
  useGetAllLevelsOfInstitution,
  useGetAllExpandedLevelsOfInstitution,
  useUpdateLevelInInstitution,
};
