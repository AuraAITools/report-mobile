import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type Href, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAccountContext } from "@/components/providers/AccountProvider";
import { useInstitutionsContext } from "@/components/providers/InstitutionsProvider";
import {
  type EducatorLesson,
  useGetLessonsForEducator,
} from "@/features/lessons";
import { formatTimestampToDateString } from "@/utils/DateTimeUtil";

export default function EducatorLessonsList() {
  const router = useRouter();
  const { currentInstitution } = useInstitutionsContext();
  const { currentAccount } = useAccountContext();
  const educatorId = currentAccount?.educators[0]?.id;

  const { data: lessons = [], isLoading, isError, refetch } =
    useGetLessonsForEducator(currentInstitution?.id, educatorId);

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...lessons].sort(
      (a, b) => b.lessonStartTimestamptz - a.lessonStartTimestamptz,
    );
    if (!q) return sorted;
    return sorted.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.courseName.toLowerCase().includes(q),
    );
  }, [lessons, search]);

  return (
    <SafeAreaView className="bg-background flex-1" edges={["top", "left", "right"]}>
      <View className="px-4 pt-2 pb-3">
        <Text className="text-2xl font-bold">Lessons</Text>
        <View className="mt-3 flex-row items-center">
          <View className="border-input bg-background flex-1 flex-row items-center rounded-md border px-3">
            <Ionicons name="search" size={16} color="#6B7280" />
            <Input
              testID="lessons-search"
              value={search}
              onChangeText={setSearch}
              placeholder="Search lessons"
              autoCapitalize="none"
              autoCorrect={false}
              className="ml-2 flex-1 border-0 bg-transparent shadow-none"
            />
          </View>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground text-center">
            Couldn't load lessons.
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
          testID="lessons-list"
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text className="text-muted-foreground text-sm">
                {search ? "No matching lessons" : "No lessons yet"}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <LessonRow
              lesson={item}
              onPress={() =>
                router.push({
                  pathname:
                    "/(authenticated)/educator/(tabs)/lessons/[lessonId]",
                  params: { lessonId: item.id },
                } as unknown as Href)
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function LessonRow({
  lesson,
  onPress,
}: {
  lesson: EducatorLesson;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      testID={`lesson-card-${lesson.id}`}
      className="active:opacity-70"
    >
      <Card>
        <CardHeader>
          <CardDescription>{lesson.courseName}</CardDescription>
          <CardTitle className="text-base">{lesson.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground text-xs">
              {formatTimestampToDateString(lesson.lessonStartTimestamptz)}
            </Text>
            <LessonStateBadge state={lesson.state} />
          </View>
        </CardContent>
      </Card>
    </Pressable>
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
