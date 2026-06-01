import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphql } from "@/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { accountKeys } from "./account.keys";
import type { UpdateEducatorByIdInput } from "@/generated/graphql/graphql";

const UpdateEducatorByIdDocument = graphql(/* GraphQL */ `
  mutation UpdateEducatorById($input: UpdateEducatorByIdInput!) {
    updateEducatorById(input: $input) {
      id
      name
      email
      dateOfBirth
      startDate
      employmentType
    }
  }
`);

export function useUpdateEducatorById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateEducatorByIdInput) =>
      graphqlClient(UpdateEducatorByIdDocument, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}
