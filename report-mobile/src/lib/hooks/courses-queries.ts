import { BaseCourse } from "@/types/data/Course";
import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCourseInOutlet,
  CreateCourseParams,
  getAllCoursesFromOutlet,
  getAllExpandedCoursesFromOutlet,
} from "../requests/courses";

export const courseKeys = queryKeyFactory("courses");

function useGetAllCoursesFromOutlet(institutionId?: string, outletId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("no institution id or outlet id yet");
      }
      return getAllCoursesFromOutlet(institutionId, outletId);
    },
    queryKey: courseKeys.outletLists(institutionId, outletId),
  });
}

function useGetAllExpandedCoursesFromOutlet(
  institutionId?: string,
  outletId?: string,
) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("no institution id or outlet id yet");
      }
      return getAllExpandedCoursesFromOutlet(institutionId, outletId);
    },
    queryKey: courseKeys.outletLists(institutionId, outletId),
  });
}

export function useCreateCourseInOutlet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCourseInOutlet,
    onSuccess: (data, variables, context) => {
      console.log(`succesfully created course ${JSON.stringify(data)}`);
      queryClient.invalidateQueries({
        queryKey: courseKeys.outletLists(
          variables.institution_id,
          variables.outlet_id,
        ),
      });
    },
  });
}

export const CoursesApis = {
  useGetAllCoursesFromOutlet,
  useGetAllExpandedCoursesFromOutlet,
  useCreateCourseInOutlet,
};
