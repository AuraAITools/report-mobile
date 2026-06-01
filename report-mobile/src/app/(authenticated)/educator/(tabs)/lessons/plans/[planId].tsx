import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { useInstitutionsContext } from "@/components/providers/InstitutionsProvider";
import { useGetLessonById } from "@/features/lessons";

export default function EducatorLessonPlanDetail() {
  const router = useRouter();
  const { lessonId, planId } = useLocalSearchParams<{
    lessonId: string;
    planId: string;
  }>();
  const { currentInstitution } = useInstitutionsContext();
  const { data: lesson } = useGetLessonById(currentInstitution?.id, lessonId);
  const plan = lesson?.lessonPlans.find((p) => p.id === planId);

  return (
    <SafeAreaView
      className="bg-background flex-1"
      edges={["top", "left", "right"]}
    >
      <View className="h-12 flex-row items-center px-2 pt-2">
        <Pressable
          onPress={() => router.back()}
          testID="lesson-plan-detail-back"
          hitSlop={12}
          className="rounded-md p-2 active:opacity-60"
        >
          <Ionicons name="chevron-back" size={22} color="#374151" />
        </Pressable>
        <Text
          className="flex-1 pr-10 text-center text-lg font-bold"
          numberOfLines={1}
          testID="lesson-plan-detail-title"
        >
          Lesson plan
        </Text>
      </View>

      <ScrollView contentContainerClassName="px-4 pt-4 pb-8 gap-4">
        {plan ? (
          <>
            <View className="flex-row">
              <LessonPlanStatePill state={plan.state} />
            </View>
            <Text className="text-foreground text-base">{plan.plan}</Text>
          </>
        ) : (
          <Text className="text-muted-foreground text-sm">
            Lesson plan not found
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
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
