import { BaseCourse } from "@/types/data/Course";
import { BaseEducator } from "@/types/data/Educator";
import { BaseOutlet } from "@/types/data/Outlet";
import { BaseStudent } from "@/types/data/Student";
import { queryKeyFactory } from "@/utils/query-key-factory";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getAllCoursesFromOutlet } from "../requests/courses";
import { getAllEducatorsFromOutlet } from "../requests/educator";
import {
  createOutletInInstitution,
  getAllExpandedOutletsInInstitution,
  getAllOutletsInInstitution,
  updateOutletInInstitution,
} from "../requests/outlet";
import { getAllStudentsFromOutlet } from "../requests/students";
import { institutionQueryKeys } from "./institutions-queries";
export const outletKeys = queryKeyFactory("outlets");

function useGetAllOutletsOfInstitutionIds(institutionIds: string[]) {
  return useQueries({
    queries: institutionIds.map((institutionId) => ({
      queryFn: async () => {
        const institutionOutlets =
          await getAllOutletsInInstitution(institutionId);
        return institutionOutlets.map((outlet) => ({
          ...outlet,
          institution_id: institutionId,
        }));
      },
      queryKey: [
        institutionQueryKeys.all,
        institutionId,
        ...outletKeys.lists(),
      ],
    })),
    combine: (results) => ({
      data: results.flatMap((res) => res.data ?? []),
      isPending: results.some((res) => res.isPending),
      isError: results.some((res) => res.isError),
    }),
  });
}
/**
 * Fetch all outlets with expanded assocations course, educators and students
 * @param outlets
 * @param institutionId
 * @returns
 */
function useGetExpandedOutlets(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("institution ID is undefined");
      }
      return getAllExpandedOutletsInInstitution(institutionId);
    },
    queryKey: outletKeys.institutionLists(institutionId),
    enabled: !!institutionId,
  });
}

export function useCreateOutletInInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOutletInInstitution,
    onError: (error, variables) => {
      // An error happened!
      console.error(error);
      console.log(`rolling back optimistic update with id`);
    },

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: outletKeys.institutionLists(variables.institution_id),
      });
    },
  });
}

export function useUpdateOutletInInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOutletInInstitution,
    onError: (error, variables) => {
      // An error happened!
      console.error(error);
      console.log(`rolling back optimistic update with id`);
    },

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: outletKeys.institutionLists(variables.institution_id),
      });
    },
  });
}

/**
 * function that asynchronously fetches associations (courses, educators, students) for an outlet and transforms the results
 * @param institutionId
 * @param outlet
 * @returns
 */
async function fetchExpandedOutlets(
  institutionId: string,
  outlet: BaseOutlet,
): Promise<ExpandedOutlet> {
  let [courses, educators, students] = await Promise.all([
    getAllCoursesFromOutlet(institutionId, outlet.id),
    getAllEducatorsFromOutlet(institutionId, outlet.id),
    getAllStudentsFromOutlet(institutionId, outlet.id),
  ]);

  return {
    ...outlet,
    courses,
    educators,
    students,
  };
}

export type ExpandedOutlet = {
  courses: BaseCourse[];
  educators: BaseEducator[];
  students: BaseStudent[];
} & BaseOutlet;

export const OutletsApis = {
  useGetAllOutletsOfInstitutionIds,
  useGetExpandedOutlets,
  useCreateOutletInInstitution,
  useUpdateOutletInInstitution,
};
