import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOutletRoomInOutlet,
  CreateOutletRoomParams,
  getOutletRoomsInOutlet,
} from "../requests/outlet-room";
export const outletRoomKeys = queryKeyFactory("outlet-rooms");

function useGetAllOutletsRoomsOfOutlet(
  institutionId?: string,
  outletId?: string,
) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("institutionId or outletId is undefined");
      }
      return getOutletRoomsInOutlet(institutionId, outletId);
    },
    queryKey: outletRoomKeys.outletLists(institutionId, outletId),
    enabled: !!institutionId && !!outletId,
  });
}

function useCreateOutletRoomInOutlet(params: CreateOutletRoomParams) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOutletRoomInOutlet,
    onError: (error, variables) => {
      // An error happened!
      console.error(error);
      console.log(`rolling back optimistic update with id`);
    },

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: outletRoomKeys.outletLists(
          params.institution_id,
          params.outlet_id,
        ),
      });
    },
  });
}

export const OutletRoomsApis = {
  useGetAllOutletsRoomsOfOutlet,
  useCreateOutletRoomInOutlet,
};
