import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold">{title}</Text>
        <Text className="text-muted-foreground mt-2 text-sm">Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
