import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphql } from "@/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { accountKeys } from "./account.keys";
import type { UpdateStudentByIdInput } from "@/generated/graphql/graphql";

const UpdateStudentByIdDocument = graphql(/* GraphQL */ `
  mutation UpdateStudentById($input: UpdateStudentByIdInput!) {
    updateStudentById(input: $input) {
      id
      name
      email
      dateOfBirth
      profileImageUrl
    }
  }
`);

export function useUpdateStudentById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStudentByIdInput) =>
      graphqlClient(UpdateStudentByIdDocument, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}
