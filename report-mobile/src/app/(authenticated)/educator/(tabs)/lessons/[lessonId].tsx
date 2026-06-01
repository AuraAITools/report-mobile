import { FlatList, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useInstitutionsContext } from "@/components/providers/InstitutionsProvider";
import { useGetLessonById } from "@/features/lessons";

export default function EducatorLessonDetail() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { currentInstitution } = useInstitutionsContext();
  const { data: lesson } = useGetLessonById(currentInstitution?.id, lessonId);

  return (
    <SafeAreaView className="bg-background flex-1" edges={["top", "left", "right"]}>
      <View className="h-12 flex-row items-center px-2 pt-2">
        <Pressable
          onPress={() => router.back()}
          testID="lesson-detail-back"
          hitSlop={12}
          className="rounded-md p-2 active:opacity-60"
        >
          <Ionicons name="chevron-back" size={22} color="#374151" />
        </Pressable>
        <Text
          className="flex-1 pr-10 text-center text-lg font-bold"
          numberOfLines={1}
          testID="lesson-detail-title"
        >
          {lesson?.name ?? "Lesson"}
        </Text>
      </View>

      <ScrollView contentContainerClassName="pb-8">
        <View className="pt-4">
          <Text className="px-4 text-lg font-semibold">Lesson plans</Text>
          {lesson?.lessonPlans && lesson.lessonPlans.length > 0 ? (
            <FlatList
              testID="lesson-plans-list"
              data={lesson.lessonPlans}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-4 py-3 gap-3"
              renderItem={({ item }) => (
                <LessonPlanCard
                  id={item.id}
                  plan={item.plan}
                  state={item.state}
                  students={lesson.students ?? []}
                  educators={lesson.educators ?? []}
                  onPress={() =>
                    router.push({
                      pathname:
                        "/(authenticated)/educator/(tabs)/lessons/plans/[planId]",
                      params: { planId: item.id, lessonId },
                    } as unknown as Href)
                  }
                />
              )}
            />
          ) : (
            <Text className="text-muted-foreground px-4 pt-2 text-sm">
              No lesson plans yet
            </Text>
          )}
        </View>

        <Section title="Students">
          <PeopleAvatarGroup people={lesson?.students ?? []} />
        </Section>

        <Section title="Educators">
          <PeopleAvatarGroup people={lesson?.educators ?? []} />
        </Section>

        <Section title="Lesson attendance">
          <AttendanceSummary students={lesson?.students ?? []} />
        </Section>

        <View className="pt-6">
          <Text className="px-4 text-lg font-semibold">Lesson materials</Text>
          {lesson?.materials && lesson.materials.length > 0 ? (
            <FlatList
              testID="lesson-materials-list"
              data={lesson.materials}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-4 py-3 gap-3"
              renderItem={({ item }) => (
                <LessonMaterialCard
                  name={item.name}
                  description={item.description}
                  fileUrl={item.fileUrl}
                  topics={item.topics ?? []}
                />
              )}
            />
          ) : (
            <Text className="text-muted-foreground px-4 pt-3 text-sm">
              No materials yet
            </Text>
          )}
        </View>

        <Section title="Announcement">
          <Text className="text-muted-foreground text-sm">
            No announcement yet
          </Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function LessonPlanCard({
  id,
  plan,
  state,
  students,
  educators,
  onPress,
}: {
  id: string;
  plan: string;
  state: string;
  students: { id: string; name: string }[];
  educators: { id: string; name: string }[];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      testID={`lesson-plan-card-${id}`}
      className="active:opacity-70"
    >
      <Card className="w-64">
        <CardHeader className="gap-2">
          <CardTitle className="text-lg" numberOfLines={2}>
            {plan}
          </CardTitle>
          <View className="flex-row">
            <LessonPlanStatePill state={state} />
          </View>
        </CardHeader>
        <CardContent>
          <View className="flex-row gap-6">
            <PeopleAvatarGroup label="Students" people={students} />
            <PeopleAvatarGroup label="Educators" people={educators} />
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}

function PeopleAvatarGroup({
  label,
  people,
}: {
  label?: string;
  people: { id: string; name: string }[];
}) {
  return (
    <View className="flex-1 gap-1.5">
      {label ? (
        <Text className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </Text>
      ) : null}
      {people.length > 0 ? (
        <View className="flex-row items-center">
          {people.slice(0, 3).map((person, index) => (
            <Avatar
              key={person.id}
              alt={person.name}
              className={`border-card size-7 border-2 ${index > 0 ? "-ml-2" : ""}`}
            >
              <AvatarFallback>
                <Text className="text-foreground text-[10px] font-semibold">
                  {getInitials(person.name)}
                </Text>
              </AvatarFallback>
            </Avatar>
          ))}
          {people.length > 3 ? (
            <View className="bg-muted border-card -ml-2 size-7 items-center justify-center rounded-full border-2">
              <Text className="text-foreground text-[10px] font-semibold">
                +{people.length - 3}
              </Text>
            </View>
          ) : null}
        </View>
      ) : (
        <Text className="text-muted-foreground text-xs">None</Text>
      )}
    </View>
  );
}

function LessonPlanStatePill({ state }: { state: string }) {
  const upper = state.toUpperCase();
  const styles =
    upper === "PLANNED"
      ? { bg: "bg-green-100", text: "text-green-700" }
      : upper === "DRAFT"
        ? { bg: "bg-yellow-100", text: "text-yellow-800" }
        : upper === "UNPLANNED"
          ? { bg: "bg-red-100", text: "text-red-700" }
          : { bg: "bg-muted", text: "text-muted-foreground" };
  return (
    <View className={`rounded-full px-2 py-0.5 ${styles.bg}`}>
      <Text className={`text-[10px] font-semibold ${styles.text}`}>
        {upper}
      </Text>
    </View>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]![0] : "";
  return (first + last).toUpperCase();
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="px-4 pt-6">
      <Text className="text-lg font-semibold">{title}</Text>
      <View className="mt-3">{children}</View>
    </View>
  );
}

function AttendanceSummary({
  students,
}: {
  students: { id: string; name: string }[];
}) {
  if (students.length === 0) {
    return (
      <Text className="text-muted-foreground text-sm">No students enrolled</Text>
    );
  }
  return (
    <Card>
      <CardContent className="flex-row items-center justify-between pt-6">
        <View>
          <Text className="text-2xl font-bold">0/{students.length}</Text>
          <Text className="text-muted-foreground text-xs">Marked present</Text>
        </View>
        <Ionicons name="clipboard-outline" size={28} color="#6B7280" />
      </CardContent>
    </Card>
  );
}

function LessonMaterialCard({
  name,
  description,
  fileUrl,
  topics,
}: {
  name: string;
  description?: string | null;
  fileUrl?: string | null;
  topics: { id: string; name: string }[];
}) {
  const extension = getFileExtension(fileUrl);
  const hasPills = !!extension || topics.length > 0;
  return (
    <Card className="w-64">
      <CardHeader className="gap-2">
        <View className="flex-row items-center gap-2">
          <Ionicons name="document-outline" size={18} color="#374151" />
          <CardTitle className="flex-1 text-base" numberOfLines={1}>
            {name}
          </CardTitle>
        </View>
        {description ? (
          <Text className="text-muted-foreground text-xs" numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </CardHeader>
      {hasPills ? (
        <CardContent>
          <View className="flex-row flex-wrap gap-1.5">
            {extension ? (
              <Pill bg="bg-blue-100" text="text-blue-700">
                {extension.toUpperCase()}
              </Pill>
            ) : null}
            {topics.map((topic) => (
              <Pill
                key={topic.id}
                bg="bg-secondary"
                text="text-secondary-foreground"
              >
                {topic.name}
              </Pill>
            ))}
          </View>
        </CardContent>
      ) : null}
    </Card>
  );
}

function Pill({
  children,
  bg,
  text,
}: {
  children: React.ReactNode;
  bg: string;
  text: string;
}) {
  return (
    <View className={`rounded-full px-2 py-0.5 ${bg}`}>
      <Text className={`text-[10px] font-semibold ${text}`}>{children}</Text>
    </View>
  );
}

function getFileExtension(fileUrl?: string | null) {
  if (!fileUrl) return null;
  const withoutQuery = fileUrl.split("?")[0] ?? "";
  const lastSlash = withoutQuery.lastIndexOf("/");
  const filename = lastSlash >= 0 ? withoutQuery.slice(lastSlash + 1) : withoutQuery;
  const dot = filename.lastIndexOf(".");
  if (dot < 0 || dot === filename.length - 1) return null;
  return filename.slice(dot + 1);
}
