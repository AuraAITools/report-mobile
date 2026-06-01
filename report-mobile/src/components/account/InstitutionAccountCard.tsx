import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInstitutionsContext } from "@/components/providers/InstitutionsProvider";
import type {
  GetAccountByUserIdQuery,
  GetInstitutionsByIdsQuery,
} from "@/generated/graphql/graphql";

type Account = GetAccountByUserIdQuery["getAccountByUserId"];
type Institution = GetInstitutionsByIdsQuery["getInstitutionsByIds"][number];
type Educator = Account["educators"][number];
type Student = Account["students"][number];

type Props = {
  institution: Institution;
  account: Account | undefined;
};

export function InstitutionAccountCard({ institution, account }: Props) {
  const router = useRouter();
  const { changeCurrentInstitution } = useInstitutionsContext();

  const go = (target: "educator" | "parent") => {
    changeCurrentInstitution(institution);
    if (target === "educator") {
      router.push("/(authenticated)/educator/(tabs)");
    } else {
      router.push("/(authenticated)/parent-client/(tabs)");
    }
  };

  const hasEducator = !!account && account.educators.length > 0;
  const hasParent = !!account?.parent;

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader>
        <View className="flex-row items-center gap-3">
          <InstitutionAvatar
            name={institution.name}
            url={institution.profileImageUrl}
          />
          <View className="flex-1">
            <CardTitle className="text-base">{institution.name}</CardTitle>
            {account ? (
              <CardDescription>
                {account.firstName} {account.lastName}
              </CardDescription>
            ) : (
              <CardDescription>
                No accounts yet, request from your admin
              </CardDescription>
            )}
          </View>
        </View>
      </CardHeader>

      {hasEducator || hasParent ? (
        <CardContent className="gap-4">
          {hasEducator && (
            <>
              <Separator />
              <RoleSection
                icon="school-outline"
                label="Educator"
                count={account!.educators.length}
                ctaLabel="View as Educator"
                onPress={() => go("educator")}
                disabled={!account!.educatorFeatureEnabled}
              >
                {account!.educators.map((e) => (
                  <PersonRow
                    key={e.id}
                    name={e.name}
                    subtitle={formatEmployment(e.employmentType)}
                  />
                ))}
              </RoleSection>
            </>
          )}

          {hasParent && (
            <>
              <Separator />
              <RoleSection
                icon="people-outline"
                label="Parent"
                count={account!.students.length}
                countLabel="students"
                ctaLabel="View as Parent"
                onPress={() => go("parent")}
                disabled={!account!.parentFeatureEnabled}
              >
                <PersonRow
                  name={`${account!.firstName} ${account!.lastName}`}
                  subtitle={formatRelationship(account!.parent!.relationship)}
                  url={account!.parent!.profileImageUrl}
                />
                {account!.students.length > 0 && (
                  <View className="mt-3 gap-2">
                    <Text className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                      Students
                    </Text>
                    <View className="gap-2 pl-1">
                      {account!.students.map((s) => (
                        <StudentRow key={s.id} student={s} />
                      ))}
                    </View>
                  </View>
                )}
              </RoleSection>
            </>
          )}
        </CardContent>
      ) : null}
    </Card>
  );
}

function RoleSection({
  icon,
  label,
  count,
  countLabel,
  ctaLabel,
  onPress,
  disabled,
  children,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  count?: number;
  countLabel?: string;
  ctaLabel: string;
  onPress: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <Ionicons name={icon} size={16} color="#6B7280" />
        <Text className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </Text>
        {typeof count === "number" && count > 0 && (
          <Text className="text-muted-foreground text-[11px]">
            · {count}
            {countLabel ? ` ${countLabel}` : ""}
          </Text>
        )}
      </View>

      <View className="gap-2">{children}</View>

      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        className={`flex-row items-center justify-between rounded-md px-3 py-2.5 ${
          disabled
            ? "bg-muted opacity-60"
            : "bg-secondary active:bg-secondary/80"
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            disabled ? "text-muted-foreground" : "text-secondary-foreground"
          }`}
        >
          {disabled ? "Feature not enabled" : ctaLabel}
        </Text>
        <Ionicons
          name={disabled ? "lock-closed-outline" : "chevron-forward"}
          size={16}
          color="#6B7280"
        />
      </Pressable>
    </View>
  );
}

function PersonRow({
  name,
  subtitle,
  url,
}: {
  name: string;
  subtitle?: string;
  url?: string | null;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <PersonAvatar name={name} url={url} />
      <View className="flex-1">
        <Text className="text-sm font-medium">{name}</Text>
        {subtitle && (
          <Text className="text-muted-foreground text-xs">{subtitle}</Text>
        )}
      </View>
    </View>
  );
}

function StudentRow({ student }: { student: Student }) {
  return (
    <View className="flex-row items-center gap-3">
      <PersonAvatar name={student.name} url={student.profileImageUrl} />
      <View className="flex-1">
        <Text className="text-sm">{student.name}</Text>
        {student.email && (
          <Text className="text-muted-foreground text-xs">{student.email}</Text>
        )}
      </View>
    </View>
  );
}

function InstitutionAvatar({
  name,
  url,
}: {
  name: string;
  url: string | null | undefined;
}) {
  return (
    <Avatar alt={name} className="size-12 rounded-lg">
      {url ? <AvatarImage source={{ uri: url }} className="rounded-lg" /> : null}
      <AvatarFallback className="rounded-lg">
        <Text className="text-base font-semibold">{initials(name)}</Text>
      </AvatarFallback>
    </Avatar>
  );
}

function PersonAvatar({
  name,
  url,
}: {
  name: string;
  url: string | null | undefined;
}) {
  return (
    <Avatar alt={name} className="size-9">
      {url ? <AvatarImage source={{ uri: url }} /> : null}
      <AvatarFallback>
        <Text className="text-xs font-medium">{initials(name)}</Text>
      </AvatarFallback>
    </Avatar>
  );
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

function formatEmployment(type: Educator["employmentType"]): string {
  switch (type) {
    case "FULL_TIME":
      return "Full-time";
    case "PART_TIME":
      return "Part-time";
    default:
      return String(type).toLowerCase();
  }
}

function formatRelationship(rel: NonNullable<Account["parent"]>["relationship"]): string {
  const s = String(rel).toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
