import {
  CreateBaseAccountParamsSchema,
  ExpandedAccount,
} from "@/types/data/Account";
import {
  BaseEducator,
  BaseEducatorSchema,
  ExpandedEducator,
} from "@/types/data/Educator";
import { z } from "zod";
import { apiClient } from "../api-client";

export async function getAllEducatorsFromInstitution(institutionId: string) {
  return (
    await apiClient.get<BaseEducator[]>(
      `/api/institutions/${institutionId}/educators`,
    )
  ).data;
}

export async function getAllExpandedEducatorsFromInstitution(
  institutionId: string,
) {
  return (
    await apiClient.get<ExpandedEducator[]>(
      `/api/institutions/${institutionId}/educators/expand`,
    )
  ).data;
}

export async function getAllEducatorsFromOutlet(
  institutionId: string,
  outletId: string,
) {
  return (
    await apiClient.get<BaseEducator[]>(
      `/api/institutions/${institutionId}/outlets/${outletId}/educators`,
    )
  ).data;
}

export async function getAllExpandedEducatorsFromOutlet(
  institutionId: string,
  outletId: string,
) {
  return (
    await apiClient.get<ExpandedEducator[]>(
      `/api/institutions/${institutionId}/outlets/${outletId}/educators/expand`,
    )
  ).data;
}

export const CreateBaseEducatorParamsSchema = BaseEducatorSchema.omit({
  id: true,
}).extend({
  level_ids: z.string().uuid().array(),
  subject_ids: z.string().uuid().array(),
  outlet_ids: z.string().uuid().array(),
  courseIds: z.string().uuid().array(),
});

export type CreateBaseEducatorParams = z.infer<
  typeof CreateBaseEducatorParamsSchema
>;

export const CreateAccountWithEducatorParamsSchema =
  CreateBaseAccountParamsSchema.extend({
    educator: CreateBaseEducatorParamsSchema,
  });
export type CreateAccountWithEducatorParams = z.infer<
  typeof CreateAccountWithEducatorParamsSchema
>;

export async function createEducatorAccountInInstitution(
  params: CreateAccountWithEducatorParams,
) {
  const { institution_id, ...requestBody } = params;
  return await apiClient.post<ExpandedAccount>(
    `/api/institutions/${institution_id}/accounts/educator-clients`,
    JSON.stringify(requestBody),
  );
}
