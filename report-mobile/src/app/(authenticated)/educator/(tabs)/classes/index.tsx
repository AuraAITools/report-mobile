import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  View,
} from "react-native";
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
import { useInstitutionsContext } from "@/components/providers/InstitutionsProvider";
import { useGetCoursesAcrossOutlets } from "@/features/courses";

type Course = ReturnType<typeof useGetCoursesAcrossOutlets>["data"][number];

type LevelGroup = {
  levelId: string;
  levelName: string;
  courses: Course[];
};

export default function EducatorClassesList() {
  const router = useRouter();
  const { currentInstitution } = useInstitutionsContext();
  const outlets = currentInstitution?.outlets ?? [];

  // `undefined` = no chip selected → show classes across every branch.
  const [selectedOutletId, setSelectedOutletId] = useState<string | undefined>(
    undefined,
  );

  const outletIdsToFetch = useMemo(
    () =>
      selectedOutletId &&
      outlets.some((o) => o.id === selectedOutletId)
        ? [selectedOutletId]
        : outlets.map((o) => o.id),
    [selectedOutletId, outlets],
  );

  const { data: courses, isLoading, isError, refetch } =
    useGetCoursesAcrossOutlets(currentInstitution?.id, outletIdsToFetch);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeSubjectIds, setActiveSubjectIds] = useState<Set<string>>(
    new Set(),
  );

  const allSubjects = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of courses) {
      for (const s of c.subjects ?? []) {
        map.set(s.id, s.name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [courses]);

  const groupedByLevel = useMemo<LevelGroup[]>(() => {
    const q = search.trim().toLowerCase();
    const filtered = courses.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) {
        const subjectMatch = (c.subjects ?? []).some((s) =>
          s.name.toLowerCase().includes(q),
        );
        const levelMatch = c.level?.name?.toLowerCase().includes(q);
        if (!subjectMatch && !levelMatch) return false;
      }
      if (activeSubjectIds.size > 0) {
        const has = (c.subjects ?? []).some((s) => activeSubjectIds.has(s.id));
        if (!has) return false;
      }
      return true;
    });

    const byLevel = new Map<string, LevelGroup>();
    for (const c of filtered) {
      const levelId = c.level?.id ?? "_none";
      const levelName = c.level?.name ?? "Unassigned";
      if (!byLevel.has(levelId)) {
        byLevel.set(levelId, { levelId, levelName, courses: [] });
      }
      byLevel.get(levelId)!.courses.push(c);
    }
    const groups = Array.from(byLevel.values());
    groups.sort((a, b) => a.levelName.localeCompare(b.levelName));
    for (const g of groups) {
      g.courses.sort((a, b) => a.name.localeCompare(b.name));
    }
    return groups;
  }, [courses, search, activeSubjectIds]);

  const toggleSubject = (id: string) => {
    setActiveSubjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filterCount = activeSubjectIds.size;

  return (
    <SafeAreaView
      className="bg-background flex-1"
      edges={["top", "left", "right"]}
    >
      <View className="px-4 pt-2">
        <Text className="text-2xl font-bold">Classes</Text>
      </View>

      {/* Branch selector */}
      <View className="mt-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 gap-2"
          testID="classes-branch-scroll"
        >
          {outlets.length === 0 ? (
            <Text className="text-muted-foreground text-sm">No branches</Text>
          ) : (
            outlets.map((o) => {
              const active = o.id === selectedOutletId;
              return (
                <Pressable
                  key={o.id}
                  onPress={() =>
                    setSelectedOutletId(active ? undefined : o.id)
                  }
                  testID={`classes-branch-${o.id}`}
                  className={`rounded-full border px-4 py-2 active:opacity-70 ${
                    active
                      ? "bg-primary border-primary"
                      : "border-input bg-background"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      active ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {o.name}
                  </Text>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* Search + filter row */}
      <View className="mt-3 flex-row items-center gap-2 px-4">
        <View className="border-input bg-background flex-1 flex-row items-center rounded-md border px-3">
          <Ionicons name="search" size={16} color="#6B7280" />
          <Input
            testID="classes-search"
            value={search}
            onChangeText={setSearch}
            placeholder="Search classes"
            autoCapitalize="none"
            autoCorrect={false}
            className="ml-2 flex-1 border-0 bg-transparent shadow-none"
          />
        </View>
        <Pressable
          onPress={() => setShowFilters((v) => !v)}
          testID="classes-filter-toggle"
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

      {/* Filter chips */}
      {showFilters ? (
        <View className="mt-3 px-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground text-xs font-semibold uppercase">
              Subjects
            </Text>
            {filterCount > 0 ? (
              <Pressable
                onPress={() => setActiveSubjectIds(new Set())}
                testID="classes-filter-clear"
                hitSlop={8}
              >
                <Text className="text-primary text-xs font-medium">
                  Clear
                </Text>
              </Pressable>
            ) : null}
          </View>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {allSubjects.length === 0 ? (
              <Text className="text-muted-foreground text-sm">
                No subjects to filter
              </Text>
            ) : (
              allSubjects.map((s) => {
                const active = activeSubjectIds.has(s.id);
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => toggleSubject(s.id)}
                    testID={`classes-filter-subject-${s.id}`}
                    className={`rounded-full border px-3 py-1.5 active:opacity-70 ${
                      active
                        ? "bg-primary border-primary"
                        : "border-input bg-background"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        active ? "text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {s.name}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </View>
        </View>
      ) : null}

      {/* Body */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground text-center">
            Couldn't load classes.
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
          testID="classes-level-list"
          data={groupedByLevel}
          keyExtractor={(g) => g.levelId}
          contentContainerClassName="px-4 pb-8 pt-4"
          ItemSeparatorComponent={() => <View className="h-5" />}
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text className="text-muted-foreground text-sm">
                {search || filterCount > 0
                  ? "No matching classes"
                  : "No classes yet"}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View>
              <View className="mb-2 flex-row items-center gap-2">
                <Text className="text-lg font-semibold">{item.levelName}</Text>
                <View className="bg-muted rounded-full px-2 py-0.5">
                  <Text className="text-muted-foreground text-[10px] font-semibold">
                    {item.courses.length}
                  </Text>
                </View>
              </View>
              <View className="gap-2">
                {item.courses.map((c) => (
                  <ClassRow
                    key={c.id}
                    course={c}
                    onPress={() =>
                      router.push({
                        pathname:
                          "/(authenticated)/educator/(tabs)/classes/[classId]",
                        params: { classId: c.id },
                      } as unknown as Href)
                    }
                  />
                ))}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function ClassRow({
  course,
  onPress,
}: {
  course: Course;
  onPress: () => void;
}) {
  const subjects = course.subjects ?? [];
  return (
    <Pressable
      onPress={onPress}
      testID={`class-card-${course.id}`}
      className="active:opacity-70"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{course.name}</CardTitle>
          {subjects.length > 0 ? (
            <CardDescription>
              {subjects.map((s) => s.name).join(" • ")}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <Ionicons name="people-outline" size={14} color="#6B7280" />
              <Text className="text-muted-foreground text-xs">
                Max {course.maxSize}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
