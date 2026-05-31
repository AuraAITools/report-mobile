import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useAccountContext } from "@/components/providers/AccountProvider";
import { useInstitutionsContext } from "@/components/providers/InstitutionsProvider";
import { InstitutionAccountCard } from "@/components/account/InstitutionAccountCard";

export default function AccountsPage() {
  const { institutions } = useInstitutionsContext();
  const { accountsByInstitutionId, isLoading } = useAccountContext();

  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-8"
      >
        <View className="mb-5">
          <Text className="text-2xl font-bold">Welcome to Aura</Text>
          <Text className="text-muted-foreground text-sm">
            Select an account to begin
          </Text>
        </View>

        {isLoading && (
          <View className="items-center py-10">
            <ActivityIndicator />
          </View>
        )}

        {!isLoading &&
          institutions.map((institution) => (
            <InstitutionAccountCard
              key={institution.id}
              institution={institution}
              account={accountsByInstitutionId[institution.id]}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
