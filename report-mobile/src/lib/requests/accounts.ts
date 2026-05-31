import {
  CreateBaseAccountParams,
  CreateBaseAccountParamsSchema,
  ExpandedAccount,
} from "@/types/data/Account";
import { z } from "zod";
import { apiClient } from "../api-client";
import { CreateStudentParamsSchema } from "./students";

export const ACCOUNT_RELATIONSHIP = ["PARENT", "SELF"] as const;

export const CreateInstitutionAdminParamsSchema = CreateBaseAccountParamsSchema;

export type CreateInstitutionAdminParams = z.infer<
  typeof CreateInstitutionAdminParamsSchema
>;

export async function createInstitutionAdminAccount(
  createInstitutionAdminParams: CreateInstitutionAdminParams
): Promise<ExpandedAccount> {
  const { institution_id, ...requestBody } = createInstitutionAdminParams;

  return await apiClient.post(
    `/api/institutions/${institution_id}/accounts/institution-admins`,
    requestBody
  );
}

export const CreateOutletAdminParamsSchema =
  CreateBaseAccountParamsSchema.extend({
    outlet_ids: z.string().uuid().array(),
  });

export type CreateOutletAdminParams = z.infer<
  typeof CreateOutletAdminParamsSchema
>;

export async function createOutletAdminAccount(
  createOutletAdminAccountParams: CreateOutletAdminParams
): Promise<ExpandedAccount> {
  const { institution_id, ...requestBody } = createOutletAdminAccountParams;
  return await apiClient.post(
    `/api/institutions/${institution_id}/accounts/outlet-admins`,
    requestBody
  );
}

export const CreateStudentClientAccountParamsSchema =
  CreateBaseAccountParamsSchema.extend({
    relationship: z.enum(ACCOUNT_RELATIONSHIP),
    students: z.lazy(() => CreateStudentParamsSchema.array().min(1)),
  });

export type CreateStudentClientAccountParams = z.infer<
  typeof CreateStudentClientAccountParamsSchema
>;

export async function createStudentClientAccount(
  createStudentClientAccountParams: CreateStudentClientAccountParams
) {
  const { institution_id, ...requestBody } = createStudentClientAccountParams;
  let response = await apiClient.post(
    `/api/institutions/${institution_id}/accounts/student-clients`,
    JSON.stringify(requestBody)
  );
  console.log(
    `created student_client_account ${JSON.stringify(response.data)}`
  );
  return response.data;
}

export async function createBlankAccount(params: CreateBaseAccountParams) {
  const { institution_id, ...requestBody } = params;
  let response = await apiClient.post<ExpandedAccount>(
    `/api/institutions/${institution_id}/accounts`,
    JSON.stringify(requestBody)
  );
  console.log(`created blank account ${JSON.stringify(response.data)}`);
  return response.data;
}

export async function getExpandedAccountsInInstitution(institution_id: string) {
  return (
    await apiClient.get<ExpandedAccount[]>(
      `/api/institutions/${institution_id}/accounts/expand`
    )
  ).data;
}

export async function getExpandedAccountsOfUserId(
  institution_id: string,
  user_id: string
) {
  return (
    await apiClient.get<ExpandedAccount>(
      `/api/v1/institutions/${institution_id}/users/${user_id}/accounts`
    )
  ).data;
}
