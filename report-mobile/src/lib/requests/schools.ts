import { BaseSchool } from "@/types/data/School";
import { apiClient } from "../api-client";

export async function getAllSchoolsInInstitution(institution_id: string) {
  return (
    await apiClient.get<BaseSchool[]>(
      `/api/institutions/${institution_id}/schools`,
    )
  ).data;
}
