import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";

export default function EducatorLessonDetail() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  return (
    <SafeAreaView className="bg-background flex-1" edges={["top", "left", "right"]}>
      <View className="flex-row items-center px-4 pt-2">
        <Pressable
          onPress={() => router.back()}
          testID="lesson-detail-back"
          hitSlop={12}
          className="flex-row items-center gap-1 rounded-md px-2 py-2 active:opacity-60"
        >
          <Ionicons name="chevron-back" size={22} color="#374151" />
          <Text className="text-base">Lessons</Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold">Lesson</Text>
        <Text className="text-muted-foreground mt-2 text-sm">
          Details for {lessonId} coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
