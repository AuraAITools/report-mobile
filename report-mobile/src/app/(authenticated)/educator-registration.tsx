import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AvatarUpload,
  type PickedImage,
} from "@/components/ui/avatar-upload";
import { useInstitutionsContext } from "@/components/providers/InstitutionsProvider";
import { useAccountContext } from "@/components/providers/AccountProvider";
import {
  useUpdateEducatorById,
  useUploadEducatorProfileImage,
} from "@/features/account";
import { useGetAllSubjectsInInstitution } from "@/features/subjects";
import { EmploymentType } from "@/generated/graphql/graphql";

const pickedImageSchema: z.ZodType<PickedImage> = z.object({
  uri: z.string(),
  mimeType: z.string(),
  fileName: z.string().nullish(),
  fileSize: z.number().optional(),
});

const schema = z.object({
  avatar: pickedImageSchema.nullable(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  startDate: z.date().optional(),
  dateOfBirth: z.date().optional(),
  employmentType: z.nativeEnum(EmploymentType),
  subjectIds: z.array(z.string()),
  contactNumber: z.string(),
});

type FormValues = z.infer<typeof schema>;

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDisplayDate(d: Date | undefined): string {
  if (!d) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function EducatorRegistration() {
  const router = useRouter();
  const { educatorId } = useLocalSearchParams<{ educatorId?: string }>();
  const { currentInstitution } = useInstitutionsContext();
  const { currentAccount } = useAccountContext();

  const educator = useMemo(
    () => currentAccount?.educators.find((e) => e.id === educatorId),
    [currentAccount, educatorId],
  );

  const { data: subjects = [] } = useGetAllSubjectsInInstitution(
    currentInstitution?.id,
  );

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      avatar: null,
      name: educator?.name ?? "",
      email: educator?.email ?? "",
      startDate: undefined as unknown as Date,
      dateOfBirth: undefined as unknown as Date,
      employmentType: educator?.employmentType ?? EmploymentType.FullTime,
      subjectIds: [],
      contactNumber: "",
    },
  });

  const updateMutation = useUpdateEducatorById();
  const uploadAvatar = useUploadEducatorProfileImage();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isSubmitting = updateMutation.isPending || uploadAvatar.isPending;

  const onSubmit = handleSubmit(
    async (values) => {
      if (!educatorId || !currentInstitution || !currentAccount) return;
      setSubmitError(null);
      try {
        await updateMutation.mutateAsync({
          id: educatorId,
          institutionId: currentInstitution.id,
          name: values.name,
          email: values.email,
          employmentType: values.employmentType,
          ...(values.startDate
            ? { startDate: toISODate(values.startDate) }
            : {}),
          ...(values.dateOfBirth
            ? { dateOfBirth: toISODate(values.dateOfBirth) }
            : {}),
        });
        if (values.avatar) {
          await uploadAvatar.mutateAsync({
            educatorId,
            institutionId: currentInstitution.id,
            image: values.avatar,
          });
        }
        router.back();
      } catch (e) {
        setSubmitError(e instanceof Error ? e.message : "Failed to save");
      }
    },
    () => {
      setSubmitError("Please fix the highlighted fields above.");
    },
  );

  if (!educatorId || !currentInstitution) {
    return (
      <SafeAreaView className="bg-background flex-1 items-center justify-center px-6">
        <Text className="text-muted-foreground text-center">
          Missing educator context.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="bg-background flex-1"
      edges={["top", "left", "right"]}
    >
      <View className="flex-row items-center px-4 pt-2">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          className="flex-row items-center gap-1 rounded-md px-2 py-2 active:opacity-60"
        >
          <Ionicons name="chevron-back" size={22} color="#374151" />
          <Text className="text-base">Back</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-4 pb-8 pt-2"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-5">
            <Text className="text-2xl font-bold">Educator registration</Text>
            <Text className="text-muted-foreground text-sm">
              Complete your educator profile
            </Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="avatar"
              render={({ field }) => (
                <View className="items-center">
                  <AvatarUpload
                    value={field.value}
                    onChange={field.onChange}
                    previewUrl={educator?.profileImageUrl}
                    fallback={
                      <Text className="text-base font-semibold">
                        {avatarInitials(
                          currentAccount?.firstName,
                          currentAccount?.lastName,
                        )}
                      </Text>
                    }
                  />
                </View>
              )}
            />

            <Field label="Institution">
              <Input
                value={currentInstitution.name}
                editable={false}
                selectTextOnFocus={false}
              />
            </Field>

            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field label="Name" error={fieldState.error?.message}>
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Jane Doe"
                    autoCapitalize="words"
                  />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Field label="Email" error={fieldState.error?.message}>
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="jane@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="contactNumber"
              render={({ field, fieldState }) => (
                <Field
                  label="Contact number"
                  error={fieldState.error?.message}
                  hint="Not saved yet — pending API support"
                >
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="+65 9123 4567"
                    keyboardType="phone-pad"
                  />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="startDate"
              render={({ field, fieldState }) => (
                <Field label="Start date" error={fieldState.error?.message}>
                  <DateInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a start date"
                  />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field, fieldState }) => (
                <Field
                  label="Date of birth"
                  error={fieldState.error?.message}
                >
                  <DateInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date of birth"
                    maximumDate={new Date()}
                  />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="employmentType"
              render={({ field, fieldState }) => (
                <Field
                  label="Employment type"
                  error={fieldState.error?.message}
                >
                  <SegmentedControl
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { label: "Full-time", value: EmploymentType.FullTime },
                      { label: "Part-time", value: EmploymentType.PartTime },
                    ]}
                  />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="subjectIds"
              render={({ field, fieldState }) => (
                <Field
                  label="Subjects"
                  error={fieldState.error?.message}
                  hint="Not saved yet — pending API support"
                >
                  <SubjectsMultiSelect
                    options={subjects}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </Field>
              )}
            />

            {submitError && (
              <Text className="text-destructive text-sm">{submitError}</Text>
            )}

            <Button
              onPress={onSubmit}
              disabled={isSubmitting || formState.isSubmitting}
              className="mt-2"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text>Save</Text>
              )}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? (
        <Text className="text-destructive text-xs">{error}</Text>
      ) : hint ? (
        <Text className="text-muted-foreground text-xs">{hint}</Text>
      ) : null}
    </View>
  );
}

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
}) {
  return (
    <View className="border-input flex-row overflow-hidden rounded-md border">
      {options.map((opt, idx) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={`flex-1 items-center justify-center px-3 py-2.5 ${
              selected ? "bg-primary" : "bg-background active:bg-accent"
            } ${idx > 0 ? "border-input border-l" : ""}`}
          >
            <Text
              className={`text-sm font-medium ${
                selected ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function DateInput({
  value,
  onChange,
  placeholder,
  maximumDate,
}: {
  value: Date | undefined;
  onChange: (d: Date) => void;
  placeholder: string;
  maximumDate?: Date;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="border-input bg-background h-10 flex-row items-center justify-between rounded-md border px-3"
      >
        <Text
          className={
            value ? "text-foreground text-base" : "text-muted-foreground text-base"
          }
        >
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={18} color="#6B7280" />
      </Pressable>

      {open && Platform.OS === "android" && (
        <DateTimePicker
          mode="date"
          value={value ?? new Date()}
          maximumDate={maximumDate}
          onValueChange={(_event, selected) => {
            setOpen(false);
            onChange(selected);
          }}
          onDismiss={() => setOpen(false)}
        />
      )}

      {Platform.OS === "ios" && open && (
        <View className="border-input bg-background mt-2 overflow-hidden rounded-md border">
          <DateTimePicker
            mode="date"
            display="inline"
            value={value ?? new Date()}
            maximumDate={maximumDate}
            onValueChange={(_event, selected) => onChange(selected)}
          />
          <View className="border-input border-t p-2">
            <Pressable
              onPress={() => setOpen(false)}
              className="bg-secondary items-center rounded-md px-3 py-2 active:bg-secondary/80"
            >
              <Text className="text-secondary-foreground text-sm font-medium">
                Done
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
}

function SubjectsMultiSelect({
  options,
  value,
  onChange,
}: {
  options: { id: string; name: string }[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const selected = useMemo(() => new Set(value), [value]);
  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  };

  const summary =
    value.length === 0
      ? "Select subjects"
      : options
          .filter((o) => selected.has(o.id))
          .map((o) => o.name)
          .join(", ");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Pressable className="border-input bg-background min-h-10 flex-row items-center justify-between rounded-md border px-3 py-2">
          <Text
            className={
              value.length
                ? "text-foreground flex-1 text-base"
                : "text-muted-foreground flex-1 text-base"
            }
            numberOfLines={2}
          >
            {summary}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        </Pressable>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        {options.length === 0 ? (
          <View className="px-3 py-4">
            <Text className="text-muted-foreground text-sm">
              No subjects available
            </Text>
          </View>
        ) : (
          <ScrollView className="max-h-72">
            {options.map((opt) => {
              const isSelected = selected.has(opt.id);
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => toggle(opt.id)}
                  className="flex-row items-center gap-3 px-3 py-2.5 active:bg-accent"
                >
                  <View
                    className={`size-5 items-center justify-center rounded border ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-input bg-background"
                    }`}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                  <Text className="text-foreground flex-1 text-sm">
                    {opt.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </PopoverContent>
    </Popover>
  );
}

function avatarInitials(first?: string, last?: string): string {
  const f = first?.[0] ?? "";
  const l = last?.[0] ?? "";
  const out = `${f}${l}`.toUpperCase();
  return out || "?";
}
