import { BaseSubject, BaseSubjectSchema } from "@/types/data/Subject";
import { apiClient } from "../api-client";
import { z } from "zod";

export async function getAllSubjectsOfInstitution(institutionId: string) {
  let response = await apiClient.get<BaseSubject[]>(
    `/api/institutions/${institutionId}/subjects`,
  );
  console.log(`fetched subjects ${JSON.stringify(response.data)}`);
  return response.data;
}
export const CreateSubjectParamsSchema = BaseSubjectSchema.omit({
  id: true,
}).extend({
  institution_id: z.string().uuid(),
});
export type CreateSubjectParams = z.infer<typeof CreateSubjectParamsSchema>;
export async function createSubject(params: CreateSubjectParams) {
  const { institution_id, ...subjectBody } = params;
  console.log(`created subject ${JSON.stringify(params)}`);

  let response = await apiClient.post<BaseSubject>(
    `/api/institutions/${institution_id}/subjects`,
    JSON.stringify(subjectBody),
  );
  console.log(`created subject ${JSON.stringify(response.data)}`);
  return response.data;
}

export type DeleteSubjectParams = {
  institutionId: string;
  id: string;
};
export async function deleteSubject({
  institutionId,
  id,
}: DeleteSubjectParams) {
  let response = await apiClient.delete(
    `/api/institutions/${institutionId}/subjects/${id}`,
  );
  console.log(`deleted with status ${response.status}`);
  return response.data;
}
