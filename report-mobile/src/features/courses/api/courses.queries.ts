import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { graphql } from "@/generated/graphql";
import { graphqlClient } from "@/lib/graphql-client";
import type { GetAllCoursesInOutletQuery } from "@/generated/graphql/graphql";
import { courseKeys } from "./courses.keys";

const GetAllCoursesInOutletDocument = graphql(/* GraphQL */ `
  query GetAllCoursesInOutlet($institutionId: ID!, $outletId: ID!) {
    getAllCoursesInOutlet(institutionId: $institutionId, outletId: $outletId) {
      id
      name
      maxSize
      lessonFrequency
      courseStartTimestamptz
      courseEndTimestamptz
      level {
        id
        name
      }
      subjects {
        id
        name
      }
      priceRecord {
        id
        frequency
        price
      }
    }
  }
`);

const GetCourseByIdDocument = graphql(/* GraphQL */ `
  query GetCourseById($courseId: ID!) {
    getCourseById(courseId: $courseId) {
      id
      name
      maxSize
      lessonFrequency
      courseStartTimestamptz
      courseEndTimestamptz
      level {
        id
        name
      }
      subjects {
        id
        name
      }
      priceRecord {
        id
        frequency
        price
      }
      educators {
        id
        name
        email
      }
      students {
        id
        name
        email
      }
      lessons {
        id
        name
        lessonStartTimestamptz
        lessonEndTimestamptz
        state
      }
    }
  }
`);

export function useGetAllCoursesInOutlet(
  institutionId: string | undefined,
  outletId: string | undefined,
) {
  return useQuery({
    queryKey:
      institutionId && outletId
        ? courseKeys.byOutlet(institutionId, outletId)
        : courseKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(
        GetAllCoursesInOutletDocument,
        { institutionId: institutionId!, outletId: outletId! },
        signal,
      ),
    enabled: !!institutionId && !!outletId,
    select: (data) => data.getAllCoursesInOutlet,
  });
}

export function useGetCoursesAcrossOutlets(
  institutionId: string | undefined,
  outletIds: readonly string[],
) {
  const queries = useQueries({
    queries: outletIds.map((outletId) => ({
      queryKey: institutionId
        ? courseKeys.byOutlet(institutionId, outletId)
        : courseKeys.all,
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        graphqlClient(
          GetAllCoursesInOutletDocument,
          { institutionId: institutionId!, outletId },
          signal,
        ),
      enabled: !!institutionId,
      select: (data: GetAllCoursesInOutletQuery) => data.getAllCoursesInOutlet,
    })),
  });

  const data = useMemo(() => {
    const seen = new Set<string>();
    const out: GetAllCoursesInOutletQuery["getAllCoursesInOutlet"] = [];
    for (const q of queries) {
      for (const c of q.data ?? []) {
        if (seen.has(c.id)) continue;
        seen.add(c.id);
        out.push(c);
      }
    }
    return out;
  }, [queries]);

  return {
    data,
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
    refetch: () => queries.forEach((q) => q.refetch()),
  };
}

export function useGetCourseById(courseId: string | undefined) {
  return useQuery({
    queryKey: courseId ? courseKeys.byId(courseId) : courseKeys.all,
    queryFn: ({ signal }) =>
      graphqlClient(GetCourseByIdDocument, { courseId: courseId! }, signal),
    enabled: !!courseId,
    select: (data) => data.getCourseById,
  });
}
