import {
  BaseLessonSchema,
  ExpandedLesson,
  LESSON_STATUS,
} from "@/types/data/Lesson";
import { z } from "zod";
import { apiClient } from "../api-client";

export type CreateLessonParams = z.infer<typeof CreateLessonParamsSchema>;

export const CreateLessonParamsSchema = z
  .object({
    institution_id: z.string().uuid(),
    outlet_id: z.string().uuid(),
    course_id: z.string().uuid(),
    educator_ids: z.string().uuid().array(),
    student_ids: z.string().uuid().array(),
    outlet_room_id: z.string().uuid().optional(),
  })
  .merge(BaseLessonSchema)
  .omit({
    id: true,
    lesson_plan_status: true,
    lesson_review_status: true,
    lesson_status: true,
  });

export async function createLessonInOutlet(params: CreateLessonParams) {
  const { institution_id, outlet_id, course_id, ...requestBody } = params;
  console.log("here:" + JSON.stringify(requestBody));
  return await apiClient.post<CreateLessonParams>(
    `/api/institutions/${institution_id}/outlets/${outlet_id}/courses/${course_id}/lessons`,
    JSON.stringify(requestBody),
  );
}

export const UpdateLessonParamsSchema = z.object({
  institution_id: z.string().uuid(),
  outlet_id: z.string().uuid(),
  course_id: z.string().uuid(),
  lesson_id: z.string().uuid(),
  educator_ids: z.string().uuid().array().optional(),
  student_ids: z.string().uuid().array().optional(),
  name: z.string().optional(),
  status: z.enum(LESSON_STATUS).optional(),
  date: z.coerce.date().optional(),
  start_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Please enter a valid time in 24-hour format (HH:MM)",
    })
    .optional(),
  end_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Please enter a valid time in 24-hour format (HH:MM)",
    })
    .optional(),
  description: z.string().optional().optional(),
});

export type UpdateLessonParams = z.infer<typeof UpdateLessonParamsSchema>;

export async function updateLessonInOutlet(params: UpdateLessonParams) {
  const { institution_id, outlet_id, course_id, lesson_id, ...requestBody } =
    params;
  console.log("here:" + JSON.stringify(requestBody));
  return await apiClient.patch<UpdateLessonParams>(
    `/api/institutions/${institution_id}/outlets/${outlet_id}/courses/${course_id}/lessons/${lesson_id}`,
    JSON.stringify(requestBody),
  );
}

export async function getAllExpandedLessonsOfInstitution(
  institutionId: string,
) {
  return (
    await apiClient.get<ExpandedLesson[]>(
      `/api/institutions/${institutionId}/lessons/expand`,
    )
  ).data;
}

export async function getAllExpandedLessonsOutlet(
  institutionId: string,
  outletId: string,
) {
  return (
    await apiClient.get<ExpandedLesson[]>(
      `/api/institutions/${institutionId}/outlets/${outletId}/lessons/expand`,
    )
  ).data;
}
