import { z } from "zod";
import { apiClient } from "../api-client";
import { BaseOutletRoom, BaseOutletRoomSchema } from "@/types/data/OutletRoom";

export const CreateOutletRoomParamsSchema = BaseOutletRoomSchema.extend({
  institution_id: z.string().uuid(),
  outlet_id: z.string().uuid(),
}).omit({ id: true });

export type CreateOutletRoomParams = z.infer<
  typeof CreateOutletRoomParamsSchema
>;

export async function createOutletRoomInOutlet(params: CreateOutletRoomParams) {
  const { institution_id, outlet_id, ...requestBody } = params;
  return (
    await apiClient.post<BaseOutletRoom>(
      `/api/institutions/${institution_id}/outlets/${outlet_id}/outlet-rooms`,
      JSON.stringify(requestBody),
    )
  ).data;
}

export async function getOutletRoomsInOutlet(
  institution_id: string,
  outlet_id: string,
) {
  return (
    await apiClient.get<BaseOutletRoom[]>(
      `/api/institutions/${institution_id}/outlets/${outlet_id}/outlet-rooms`,
    )
  ).data;
}
