import { useMemo } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useInstitutionsContext } from "@/components/providers/InstitutionsProvider";
import { useGetCourseById } from "@/features/courses";
import { formatTimestampToDateString } from "@/utils/DateTimeUtil";

type Lesson = {
  id: string;
  name: string;
  state: string;
  lessonStartTimestamptz: number | string;
  lessonEndTimestamptz: number | string;
};

export default function EducatorClassDetail() {
  const router = useRouter();
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const { currentInstitution } = useInstitutionsContext();

  const { data: course, isLoading, isError, refetch } = useGetCourseById(
    classId,
  );

  const sortedLessons = useMemo<Lesson[]>(() => {
    const lessons = (course?.lessons ?? []) as Lesson[];
    return [...lessons].sort(
      (a, b) =>
        Number(a.lessonStartTimestamptz) - Number(b.lessonStartTimestamptz),
    );
  }, [course?.lessons]);

  return (
    <SafeAreaView
      className="bg-background flex-1"
      edges={["top", "left", "right"]}
    >
      <View className="flex-row items-center px-4 pt-2">
        <Pressable
          onPress={() => router.back()}
          testID="class-detail-back"
          hitSlop={12}
          className="flex-row items-center gap-1 rounded-md px-2 py-2 active:opacity-60"
        >
          <Ionicons name="chevron-back" size={22} color="#374151" />
          <Text className="text-base">Classes</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : isError || !course ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground text-center">
            Couldn't load class.
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="bg-secondary mt-3 rounded-md px-4 py-2"
          >
            <Text className="text-secondary-foreground text-sm font-medium">
              Try again
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          testID="class-lesson-plan"
          data={sortedLessons}
          keyExtractor={(l) => l.id}
          contentContainerClassName="px-4 pb-8"
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListHeaderComponent={
            <View className="pb-4 pt-2">
              <Text className="text-2xl font-bold">{course.name}</Text>
              <View className="mt-2 flex-row flex-wrap gap-2">
                {course.level?.name ? (
                  <View className="bg-secondary rounded-full px-2.5 py-1">
                    <Text className="text-secondary-foreground text-xs font-medium">
                      {course.level.name}
                    </Text>
                  </View>
                ) : null}
                {(course.subjects ?? []).map((s) => (
                  <View
                    key={s.id}
                    className="border-input rounded-full border px-2.5 py-1"
                  >
                    <Text className="text-foreground text-xs font-medium">
                      {s.name}
                    </Text>
                  </View>
                ))}
              </View>
              <View className="mt-4 flex-row items-center justify-between">
                <Text className="text-lg font-semibold">Lesson plan</Text>
                <Text className="text-muted-foreground text-xs">
                  {sortedLessons.length}{" "}
                  {sortedLessons.length === 1 ? "lesson" : "lessons"}
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text className="text-muted-foreground text-sm">
                No lessons scheduled yet
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <Pressable
              testID={`class-lesson-${item.id}`}
              onPress={() => {
                if (!currentInstitution) return;
                router.push({
                  pathname:
                    "/(authenticated)/educator/(tabs)/lessons/[lessonId]",
                  params: { lessonId: item.id },
                } as unknown as Href);
              }}
              className="active:opacity-70"
            >
              <Card>
                <CardHeader>
                  <CardDescription>Lesson {index + 1}</CardDescription>
                  <CardTitle className="text-base">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-muted-foreground text-xs">
                      {formatTimestampToDateString(
                        Number(item.lessonStartTimestamptz),
                      )}
                    </Text>
                    <LessonStateBadge state={item.state} />
                  </View>
                </CardContent>
              </Card>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function LessonStateBadge({ state }: { state: string }) {
  const { bg, text } =
    state === "ENDED"
      ? { bg: "bg-muted", text: "text-muted-foreground" }
      : state === "CANCELLED"
        ? { bg: "bg-destructive/10", text: "text-destructive" }
        : { bg: "bg-secondary", text: "text-secondary-foreground" };
  return (
    <View className={`rounded-full px-2 py-0.5 ${bg}`}>
      <Text className={`text-[10px] font-semibold ${text}`}>{state}</Text>
    </View>
  );
}
