import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLessonInOutlet,
  getAllExpandedLessonsOfInstitution,
  getAllExpandedLessonsOutlet,
  updateLessonInOutlet,
} from "../requests/lesson";

export const lessonKeys = queryKeyFactory("lessons");

export function useCreateLessonInOutlet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLessonInOutlet,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({
        queryKey: lessonKeys.outletLists(
          variables.institution_id,
          variables.outlet_id,
        ),
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

export function useUpdateLessonInOutlet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLessonInOutlet,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({
        queryKey: lessonKeys.outletLists(
          variables.institution_id,
          variables.outlet_id,
        ),
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

export function useGetAllLessonsOfInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("institution ID is undefined");
      }
      return getAllExpandedLessonsOfInstitution(institutionId);
    },
    queryKey: lessonKeys.lists(),
    enabled: !!institutionId,
  });
}

export function useGetAllLessonsOfOutlet(
  institutionId?: string,
  outletId?: string,
) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("institution ID or outlet ID is undefined");
      }
      return getAllExpandedLessonsOutlet(institutionId, outletId);
    },
    queryKey: lessonKeys.outletLists(institutionId, outletId),
    enabled: !!institutionId && !!outletId,
  });
}

export const LessonsApis = {
  useGetAllLessonsOfInstitution,
  useGetAllLessonsOfOutlet,
  useCreateLessonInOutlet,
  useUpdateLessonInOutlet,
};
