import { useMutation, useQueryClient } from "@tanstack/react-query";
import { File as ExpoFile, UploadTask, UploadType } from "expo-file-system";
import { graphql } from "@/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import { accountKeys } from "./account.keys";
import type { PickedImage } from "@/components/ui/avatar-upload";

const RequestAccountProfileImageUploadDocument = graphql(/* GraphQL */ `
  mutation RequestAccountProfileImageUpload(
    $input: RequestAccountProfileImageUploadInput!
  ) {
    requestAccountProfileImageUpload(input: $input) {
      uploadUrl
      fileKey
    }
  }
`);

const ConfirmAccountProfileImageUploadDocument = graphql(/* GraphQL */ `
  mutation ConfirmAccountProfileImageUpload(
    $input: ConfirmAccountProfileImageUploadInput!
  ) {
    confirmAccountProfileImageUpload(input: $input) {
      id
      profileImageUrl
    }
  }
`);

const RequestParentProfileImageUploadDocument = graphql(/* GraphQL */ `
  mutation RequestParentProfileImageUpload(
    $input: RequestParentProfileImageUploadInput!
  ) {
    requestParentProfileImageUpload(input: $input) {
      uploadUrl
      fileKey
    }
  }
`);

const ConfirmParentProfileImageUploadDocument = graphql(/* GraphQL */ `
  mutation ConfirmParentProfileImageUpload(
    $input: ConfirmParentProfileImageUploadInput!
  ) {
    confirmParentProfileImageUpload(input: $input) {
      id
      profileImageUrl
    }
  }
`);

const RequestEducatorProfileImageUploadDocument = graphql(/* GraphQL */ `
  mutation RequestEducatorProfileImageUpload(
    $input: RequestEducatorProfileImageUploadInput!
  ) {
    requestEducatorProfileImageUpload(input: $input) {
      uploadUrl
      fileKey
    }
  }
`);

const ConfirmEducatorProfileImageUploadDocument = graphql(/* GraphQL */ `
  mutation ConfirmEducatorProfileImageUpload(
    $input: ConfirmEducatorProfileImageUploadInput!
  ) {
    confirmEducatorProfileImageUpload(input: $input) {
      id
      profileImageUrl
    }
  }
`);

const RequestStudentProfileImageUploadDocument = graphql(/* GraphQL */ `
  mutation RequestStudentProfileImageUpload(
    $input: RequestStudentProfileImageUploadInput!
  ) {
    requestStudentProfileImageUpload(input: $input) {
      uploadUrl
      fileKey
    }
  }
`);

const ConfirmStudentProfileImageUploadDocument = graphql(/* GraphQL */ `
  mutation ConfirmStudentProfileImageUpload(
    $input: ConfirmStudentProfileImageUploadInput!
  ) {
    confirmStudentProfileImageUpload(input: $input) {
      id
      profileImageUrl
    }
  }
`);

async function putToS3(uploadUrl: string, image: PickedImage) {
  const file = new ExpoFile(image.uri);
  const task = new UploadTask(file, uploadUrl, {
    httpMethod: "PUT",
    uploadType: UploadType.BINARY_CONTENT,
    headers: { "Content-Type": image.mimeType },
  });
  const res = await task.uploadAsync();
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`S3 upload failed: ${res.status}`);
  }
}

export type UploadAccountProfileImageArgs = {
  accountId: string;
  institutionId: string;
  image: PickedImage;
};

export function useUploadAccountProfileImage() {
  const qc = useQueryClient();
  return useMutation<void, Error, UploadAccountProfileImageArgs>({
    mutationFn: async (args) => {
      const requested = await graphqlClient(
        RequestAccountProfileImageUploadDocument,
        {
          input: {
            accountId: args.accountId,
            institutionId: args.institutionId,
            contentType: args.image.mimeType,
          },
        },
      );
      const { uploadUrl, fileKey } =
        requested.requestAccountProfileImageUpload;
      await putToS3(uploadUrl, args.image);
      await graphqlClient(ConfirmAccountProfileImageUploadDocument, {
        input: {
          accountId: args.accountId,
          institutionId: args.institutionId,
          fileKey,
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export type UploadParentProfileImageArgs = {
  parentId: string;
  institutionId: string;
  image: PickedImage;
};

export function useUploadParentProfileImage() {
  const qc = useQueryClient();
  return useMutation<void, Error, UploadParentProfileImageArgs>({
    mutationFn: async (args) => {
      const requested = await graphqlClient(
        RequestParentProfileImageUploadDocument,
        {
          input: {
            parentId: args.parentId,
            institutionId: args.institutionId,
            contentType: args.image.mimeType,
          },
        },
      );
      const { uploadUrl, fileKey } = requested.requestParentProfileImageUpload;
      await putToS3(uploadUrl, args.image);
      await graphqlClient(ConfirmParentProfileImageUploadDocument, {
        input: {
          parentId: args.parentId,
          institutionId: args.institutionId,
          fileKey,
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export type UploadEducatorProfileImageArgs = {
  educatorId: string;
  institutionId: string;
  image: PickedImage;
};

export function useUploadEducatorProfileImage() {
  const qc = useQueryClient();
  return useMutation<void, Error, UploadEducatorProfileImageArgs>({
    mutationFn: async (args) => {
      const requested = await graphqlClient(
        RequestEducatorProfileImageUploadDocument,
        {
          input: {
            educatorId: args.educatorId,
            institutionId: args.institutionId,
            contentType: args.image.mimeType,
          },
        },
      );
      const { uploadUrl, fileKey } =
        requested.requestEducatorProfileImageUpload;
      await putToS3(uploadUrl, args.image);
      await graphqlClient(ConfirmEducatorProfileImageUploadDocument, {
        input: {
          educatorId: args.educatorId,
          institutionId: args.institutionId,
          fileKey,
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export type UploadStudentProfileImageArgs = {
  studentId: string;
  institutionId: string;
  image: PickedImage;
};

export function useUploadStudentProfileImage() {
  const qc = useQueryClient();
  return useMutation<void, Error, UploadStudentProfileImageArgs>({
    mutationFn: async (args) => {
      const requested = await graphqlClient(
        RequestStudentProfileImageUploadDocument,
        {
          input: {
            studentId: args.studentId,
            institutionId: args.institutionId,
            contentType: args.image.mimeType,
          },
        },
      );
      const { uploadUrl, fileKey } = requested.requestStudentProfileImageUpload;
      await putToS3(uploadUrl, args.image);
      await graphqlClient(ConfirmStudentProfileImageUploadDocument, {
        input: {
          studentId: args.studentId,
          institutionId: args.institutionId,
          fileKey,
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}
