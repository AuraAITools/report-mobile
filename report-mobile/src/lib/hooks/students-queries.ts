import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStudentsInAccount,
  getAllExpandedStudentsFromOutlet,
  getAllStudentsFromInstitution,
  getAllStudentsFromOutlet,
  updateStudentInInstitution,
} from "../requests/students";

const studentsQueryKeys = queryKeyFactory("students");

function useGetAllStudentsFromOutlet(
  institutionId?: string,
  outletId?: string,
) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("no institutionId or outletId yet");
      }
      return getAllStudentsFromOutlet(institutionId, outletId);
    },
    queryKey: studentsQueryKeys.outletLists(institutionId, outletId),
  });
}

function useGetAllExpandedStudentsFromOutlet(
  institutionId?: string,
  outletId?: string,
) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("no institutionId or outletId yet");
      }
      return getAllExpandedStudentsFromOutlet(institutionId, outletId);
    },
    queryKey: studentsQueryKeys.outletLists(institutionId, outletId),
  });
}

function useGetAllStudentsFromInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("no institutionId or outletId yet");
      }
      return getAllStudentsFromInstitution(institutionId);
    },
    queryKey: studentsQueryKeys.institutionLists(institutionId),
  });
}

function useCreateStudentsInAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudentsInAccount,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({
        queryKey: studentsQueryKeys.institutionLists(variables.institution_id), // invalidate both institution and outlet caches for students
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

function useUpdateStudentInInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudentInInstitution,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: studentsQueryKeys.lists() });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

export const StudentsApis = {
  useGetAllStudentsFromOutlet,
  useGetAllExpandedStudentsFromOutlet,
  useGetAllStudentsFromInstitution,
  useCreateStudentsInAccount,
  useUpdateStudentInInstitution,
};
