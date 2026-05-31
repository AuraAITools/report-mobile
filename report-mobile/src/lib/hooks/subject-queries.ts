import { BaseSubject } from "@/types/data/Subject";
import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubject,
  CreateSubjectParams,
  deleteSubject,
  DeleteSubjectParams,
  getAllSubjectsOfInstitution,
} from "../requests/subjects";
const subjectQueryKeys = queryKeyFactory("subjects");
function useGetAllSubjectsOfInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) return Promise.reject("institutionId is undefined");
      return getAllSubjectsOfInstitution(institutionId);
    },
    queryKey: subjectQueryKeys.institutionLists(institutionId),
  });
}

type CreateSubjectMutationContext = {
  previousData: BaseSubject[];
};
export function useCreateSubjectInInstitution() {
  const queryClient = useQueryClient();
  return useMutation<
    BaseSubject, // data returned on success
    Error, // error emitted
    CreateSubjectParams, // variable passed in to the mutate function
    CreateSubjectMutationContext // context to be passed
  >({
    mutationFn: createSubject,
    onSuccess: (data, variables, context) => {
      console.log(`succesfully created subject ${JSON.stringify(data)}`);
      queryClient.invalidateQueries({
        queryKey: subjectQueryKeys.institutionLists(variables.institution_id),
      });
    },
    // onMutate: async (subject) => {
    //   queryClient.cancelQueries({ queryKey: ["subjects"] });

    //   // take snapshot if old data
    //   const previousSubjects = queryClient.getQueryData([
    //     "subjects",
    //   ]) as BaseSubject[];
    //   console.log(
    //     `taking snapshot of previous data ${JSON.stringify(previousSubjects)}`,
    //   );
    //   // optimistically add to list
    //   queryClient.setQueryData(["subjects"], (oldSubjects: BaseSubject[]) => {
    //     let optimisticSubjectObject: BaseSubject = {
    //       id: nanoid(),
    //       name: subject.name,
    //     };
    //     let optimisticSubjects = [...oldSubjects, optimisticSubjectObject];
    //     console.log(
    //       `optimistically updating new data ${JSON.stringify(oldSubjects)}`,
    //     );
    //     return optimisticSubjects;
    //   });

    //   // pass snapshot of old data as context, we can use this context to rollback if error
    //   return { previousData: previousSubjects };
    // },
    onError: (err, variables, context) => {
      // conduct rollback
      console.log(`conducting rollback as request failed`);
      if (context) {
        console.log(
          `rolling back to previous context data ${JSON.stringify(context.previousData)}`,
        );
        queryClient.setQueryData(["subjects"], context.previousData);
      }
      console.error(`create failed`, err);
    },
  });
}

// TODO: implement delete function
type DeleteSubjectMutationContext = {
  previousData: BaseSubject[];
};
export function useDeleteSubjectInInstitution() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    DeleteSubjectParams,
    DeleteSubjectMutationContext
  >({
    mutationFn: (deleteParams) => deleteSubject(deleteParams),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onMutate: async (params: DeleteSubjectParams) => {
      await queryClient.cancelQueries({ queryKey: ["subjects"] });

      // take snapshot of old data
      const previousSubjects = queryClient.getQueryData([
        "subjects",
      ]) as BaseSubject[];
      console.log(
        `taking snapshot of previous data ${JSON.stringify(previousSubjects)}`,
      );
      // optimistically remove the user from list
      queryClient.setQueryData(["subjects"], (oldSubjects: BaseSubject[]) => {
        let optimisticData = oldSubjects.filter(
          (subject) => subject.id !== params.id,
        );
        console.log(
          `optimistically updating new data ${JSON.stringify(optimisticData)}`,
        );
        return optimisticData;
      });

      // pass snapshot of old data as context, we can use this context to rollback if error
      return { previousData: previousSubjects };
    },
    onError: (err, variables, context) => {
      // conduct rollback
      console.log(`conducting rollback as request failed`);
      if (context) {
        console.log(
          `rolling back to previous context data ${JSON.stringify(context.previousData)}`,
        );
        queryClient.setQueryData(["subjects"], context.previousData);
      }
      console.error(`delete failed`, err);
    },
  });
}

export const SubjectsApis = {
  useGetAllSubjectsOfInstitution,
  useCreateSubjectInInstitution,
  useDeleteSubjectInInstitution,
};
