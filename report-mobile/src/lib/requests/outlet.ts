import { BaseOutlet, BaseOutletSchema } from "@/types/data/Outlet";
import { apiClient } from "../api-client";
import { ExpandedOutlet } from "../hooks/outlets-queries";
import { z } from "zod";

export async function getOutletById(
  institutionId: string,
  outletId: string,
): Promise<BaseOutlet> {
  const response = await apiClient.get<BaseOutlet>(
    `/api/institutions/${institutionId}/outlets/${outletId}`,
  );
  return response.data;
}

export async function getAllOutletsInInstitution(
  id: string,
): Promise<BaseOutlet[]> {
  const response = await apiClient.get<BaseOutlet[]>(
    `/api/institutions/${id}/outlets`,
  );
  return response.data;
}

export async function getAllExpandedOutletsInInstitution(
  id: string,
): Promise<BaseOutlet[]> {
  const response = await apiClient.get<ExpandedOutlet[]>(
    `/api/institutions/${id}/outlets/expand`,
  );
  return response.data;
}

export const CreateOutletParamsSchema = BaseOutletSchema.extend({
  institution_id: z.string().uuid(),
}).omit({
  id: true,
});

export type CreateOutletParams = z.infer<typeof CreateOutletParamsSchema>;
export async function createOutletInInstitution(
  outlet: CreateOutletParams,
): Promise<BaseOutlet> {
  const { institution_id, ...outletBody } = outlet;
  const response = await apiClient.post<BaseOutlet>(
    `/api/institutions/${outlet.institution_id}/outlets`,
    JSON.stringify(outletBody),
  );
  return response.data;
}

export const UpdateOutletParamsSchema = z.object({
  institution_id: z.string().uuid(),
  outlet_id: z.string().uuid(),
  name: z.string().optional(),
  address: z.string().optional(),
  postal_code: z.string().optional(),
  contact_number: z.string().optional(),
  email: z.string().email().optional(),
  description: z.string().optional(),
});

export type UpdateOutletParams = z.infer<typeof UpdateOutletParamsSchema>;

export async function updateOutletInInstitution(
  params: UpdateOutletParams,
): Promise<BaseOutlet> {
  const { institution_id, outlet_id, ...requestBody } = params;
  const response = await apiClient.patch<BaseOutlet>(
    `/api/institutions/${params.institution_id}/outlets/${params.outlet_id}`,
    JSON.stringify(requestBody),
  );
  return response.data;
}
