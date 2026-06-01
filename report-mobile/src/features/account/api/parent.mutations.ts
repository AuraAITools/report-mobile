import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphql } from "@/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { accountKeys } from "./account.keys";
import type { UpdateParentByIdInput } from "@/generated/graphql/graphql";

const UpdateParentByIdDocument = graphql(/* GraphQL */ `
  mutation UpdateParentById($input: UpdateParentByIdInput!) {
    updateParentById(input: $input) {
      id
      relationship
      profileImageUrl
    }
  }
`);

export function useUpdateParentById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateParentByIdInput) =>
      graphqlClient(UpdateParentByIdDocument, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}
