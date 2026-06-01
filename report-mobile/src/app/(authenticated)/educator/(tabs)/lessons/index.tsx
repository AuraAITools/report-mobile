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

type FilterField = "courseName" | "state";

const FILTER_FIELDS: { id: FilterField; label: string }[] = [
  { id: "courseName", label: "Course" },
  { id: "state", label: "State" },
];

export default function EducatorLessonsList() {
  const router = useRouter();
  const { currentInstitution } = useInstitutionsContext();
  const { currentAccount } = useAccountContext();
  const educatorId = currentAccount?.educators[0]?.id;

  const { data: lessons = [], isLoading, isError, refetch } =
    useGetLessonsForEducator(currentInstitution?.id, educatorId);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  // field -> set of active values
  const [activeFilters, setActiveFilters] = useState<
    Record<FilterField, Set<string>>
  >({ courseName: new Set(), state: new Set() });

  const valuesByField = useMemo(() => {
    const result: Record<FilterField, string[]> = {
      courseName: [],
      state: [],
    };
    for (const field of FILTER_FIELDS) {
      const seen = new Set<string>();
      for (const l of lessons) {
        const v = l[field.id];
        if (!v || seen.has(v)) continue;
        seen.add(v);
      }
      result[field.id] = Array.from(seen).sort((a, b) => a.localeCompare(b));
    }
    return result;
  }, [lessons]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...lessons].sort(
      (a, b) => a.lessonStartTimestamptz - b.lessonStartTimestamptz,
    );
    return sorted.filter((l) => {
      if (q) {
        const matchesSearch =
          l.name.toLowerCase().includes(q) ||
          l.courseName.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      for (const field of FILTER_FIELDS) {
        const active = activeFilters[field.id];
        if (active.size > 0 && !active.has(l[field.id])) return false;
      }
      return true;
    });
  }, [lessons, search, activeFilters]);

  const toggleFilter = (field: FilterField, value: string) => {
    setActiveFilters((prev) => {
      const nextSet = new Set(prev[field]);
      if (nextSet.has(value)) nextSet.delete(value);
      else nextSet.add(value);
      return { ...prev, [field]: nextSet };
    });
  };

  const filterCount =
    activeFilters.courseName.size + activeFilters.state.size;

  return (
    <SafeAreaView className="bg-background flex-1" edges={["top", "left", "right"]}>
      <View className="px-4 pt-2 pb-3">
        <Text className="text-2xl font-bold">Lessons</Text>
        <View className="mt-3 flex-row items-center gap-2">
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
          <Pressable
            onPress={() => setShowFilters((v) => !v)}
            testID="lessons-filter-toggle"
            className={`relative h-10 w-10 items-center justify-center rounded-md border ${
              showFilters || filterCount > 0
                ? "bg-secondary border-secondary"
                : "border-input bg-background"
            } active:opacity-70`}
          >
            <Ionicons name="options-outline" size={18} color="#374151" />
            {filterCount > 0 ? (
              <View className="bg-primary absolute -right-1 -top-1 h-4 min-w-4 items-center justify-center rounded-full px-1">
                <Text className="text-primary-foreground text-[10px] font-bold">
                  {filterCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        {showFilters ? (
          <View className="mt-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground text-xs font-semibold uppercase">
                Filters
              </Text>
              {filterCount > 0 ? (
                <Pressable
                  onPress={() =>
                    setActiveFilters({
                      courseName: new Set(),
                      state: new Set(),
                    })
                  }
                  testID="lessons-filter-clear"
                  hitSlop={8}
                >
                  <Text className="text-primary text-xs font-medium">
                    Clear
                  </Text>
                </Pressable>
              ) : null}
            </View>
            {FILTER_FIELDS.map((field) => {
              const values = valuesByField[field.id];
              if (values.length === 0) return null;
              return (
                <View key={field.id} className="mt-2">
                  <Text className="text-muted-foreground text-[11px] font-medium">
                    {field.label}
                  </Text>
                  <View className="mt-1 flex-row flex-wrap gap-2">
                    {values.map((v) => {
                      const active = activeFilters[field.id].has(v);
                      return (
                        <Pressable
                          key={v}
                          onPress={() => toggleFilter(field.id, v)}
                          testID={`lessons-filter-${field.id}-${v}`}
                          className={`rounded-full border px-3 py-1.5 active:opacity-70 ${
                            active
                              ? "bg-primary border-primary"
                              : "border-input bg-background"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              active
                                ? "text-primary-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {v}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}
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
                {search || filterCount > 0
                  ? "No matching lessons"
                  : "No lessons yet"}
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
