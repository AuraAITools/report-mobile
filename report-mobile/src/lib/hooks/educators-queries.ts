import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEducatorAccountInInstitution,
  getAllEducatorsFromInstitution,
  getAllEducatorsFromOutlet,
  getAllExpandedEducatorsFromInstitution,
  getAllExpandedEducatorsFromOutlet,
} from "../requests/educator";

export const educatorKeys = queryKeyFactory("educators");

function useGetAllEducatorsFromInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("no institutionId or outletId yet");
      }
      return getAllEducatorsFromInstitution(institutionId);
    },
    queryKey: educatorKeys.institutionLists(institutionId),
  });
}

function useGetAllExpandedEducatorsFromInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("no institutionId or outletId yet");
      }
      return getAllExpandedEducatorsFromInstitution(institutionId);
    },
    queryKey: educatorKeys.institutionLists(institutionId),
  });
}

function useGetAllEducatorsFromOutlet(
  institutionId?: string,
  outletId?: string,
) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("no institutionId or outletId yet");
      }
      return getAllEducatorsFromOutlet(institutionId, outletId);
    },
    queryKey: educatorKeys.outletLists(institutionId, outletId),
  });
}

function useGetAllExpandedEducatorsFromOutlet(
  institutionId?: string,
  outletId?: string,
) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("no institutionId or outletId yet");
      }
      return getAllExpandedEducatorsFromOutlet(institutionId, outletId);
    },
    // queryKey: educatorKeys.outletLists(institutionId, outletId),
    queryKey: educatorKeys.outletLists(institutionId, outletId),
  });
}

function useCreateEducatorAccountInInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEducatorAccountInInstitution,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({
        queryKey: educatorKeys.institutionLists(variables.institution_id),
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
  });
}

export const EducatorsApis = {
  useGetAllEducatorsFromInstitution,
  useGetAllExpandedEducatorsFromInstitution,
  useGetAllEducatorsFromOutlet,
  useGetAllExpandedEducatorsFromOutlet,
  useCreateEducatorAccountInInstitution,
};
