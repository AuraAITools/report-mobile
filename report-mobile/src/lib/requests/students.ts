import { ExpandedAccount } from "@/types/data/Account";
import {
  BaseStudent,
  BaseStudentSchema,
  ExpandedStudent,
} from "@/types/data/Student";
import { z } from "zod";
import { apiClient } from "../api-client";
import { ACCOUNT_RELATIONSHIP } from "./accounts";

export async function getAllStudentsFromOutlet(
  institutionId: string,
  outletId: string,
) {
  const studentsPromise = await apiClient.get<BaseStudent[]>(
    `/api/institutions/${institutionId}/outlets/${outletId}/students`,
  );

  return studentsPromise.data;
}

export async function getAllExpandedStudentsFromOutlet(
  institutionId: string,
  outletId: string,
) {
  const studentsPromise = await apiClient.get<ExpandedStudent[]>(
    `/api/institutions/${institutionId}/outlets/${outletId}/students/expand`,
  );

  return studentsPromise.data;
}

export async function getAllStudentsFromInstitution(institutionId: string) {
  const studentsPromise = await apiClient.get<ExpandedStudent[]>(
    `/api/institutions/${institutionId}/students`,
  );
  return studentsPromise.data;
}

export const CreateStudentParamsSchema = BaseStudentSchema.omit({
  id: true,
  school: true,
}).extend({
  school_id: z.string().uuid(),
  level_id: z.string().uuid(),
  outlet_id: z.string().uuid().optional(),
  course_ids: z.string().uuid().array(),
});

export type CreateStudentParams = z.infer<typeof CreateStudentParamsSchema>;

export const CreateStudentsInAccountParamsSchema = z.object({
  relationship: z.enum(ACCOUNT_RELATIONSHIP),
  institution_id: z.string().uuid(),
  account_id: z.string().uuid(),
  students: CreateStudentParamsSchema.array(),
});

export type CreateStudentsInAccountParams = z.infer<
  typeof CreateStudentsInAccountParamsSchema
>;

export async function createStudentsInAccount(
  params: CreateStudentsInAccountParams,
) {
  const { institution_id, account_id, ...requestBody } = params;
  let response = await apiClient.post<ExpandedAccount>(
    `/api/institutions/${institution_id}/accounts/${account_id}/students`,
    JSON.stringify(requestBody),
  );
  return response.data;
}

export const UpdateStudentParamsSchema = z.object({
  institution_id: z.string().uuid(),
  student_id: z.string().uuid(),
  name: z.string().optional(),
  date_of_birth: z.coerce.date().optional(),
  current_school: z.string().optional(),
  level_id: z.string().uuid(),
  outlet_ids: z.string().uuid().array(),
  course_ids: z.string().uuid().array(),
});

export type UpdateStudentParams = z.infer<typeof UpdateStudentParamsSchema>;

export async function updateStudentInInstitution(params: UpdateStudentParams) {
  const { institution_id, student_id, ...requestBody } = params;
  console.log("here:" + JSON.stringify(requestBody));
  return await apiClient.patch<ExpandedStudent>(
    `/api/institutions/${institution_id}/students/${student_id}`,
    JSON.stringify(requestBody),
  );
}
