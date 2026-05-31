import { BaseInstitution } from "@/types/data/Institution";
import { apiClient } from "../api-client";

export async function getInstitutionById(id: string): Promise<BaseInstitution> {
  console.log("jere");
  const response = await apiClient.get<BaseInstitution>(
    `/api/institutions/${id}`,
  );
  return response.data;
}
