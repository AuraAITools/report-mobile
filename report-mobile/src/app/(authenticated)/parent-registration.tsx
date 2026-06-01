import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import {
  AvatarUpload,
  type PickedImage,
} from "@/components/ui/avatar-upload";
import { useInstitutionsContext } from "@/components/providers/InstitutionsProvider";
import { useAccountContext } from "@/components/providers/AccountProvider";
import {
  useUpdateParentById,
  useUpdateStudentById,
  useUploadParentProfileImage,
  useUploadStudentProfileImage,
} from "@/features/account";
import { Relationship } from "@/generated/graphql/graphql";

const pickedImageSchema: z.ZodType<PickedImage> = z.object({
  uri: z.string(),
  mimeType: z.string(),
  fileName: z.string().nullish(),
  fileSize: z.number().optional(),
});

const studentSchema = z.object({
  id: z.string(),
  avatar: pickedImageSchema.nullable(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  dateOfBirth: z.date().optional(),
});

const schema = z.object({
  parent: z.object({
    avatar: pickedImageSchema.nullable(),
    relationship: z.nativeEnum(Relationship),
  }),
  students: z.array(studentSchema),
});

type FormValues = z.infer<typeof schema>;

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISODate(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

function formatDisplayDate(d: Date | undefined): string {
  if (!d) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ParentRegistration() {
  const router = useRouter();
  const { currentInstitution } = useInstitutionsContext();
  const { currentAccount } = useAccountContext();

  const parent = currentAccount?.parent;
  const students = currentAccount?.students ?? [];

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      parent: {
        avatar: null,
        relationship: parent?.relationship ?? Relationship.Parent,
      },
      students: students.map((s) => ({
        id: s.id,
        avatar: null,
        name: s.name,
        email: s.email,
        dateOfBirth: parseISODate(s.dateOfBirth),
      })),
    },
  });

  const updateParent = useUpdateParentById();
  const updateStudent = useUpdateStudentById();
  const uploadParentAvatar = useUploadParentProfileImage();
  const uploadStudentAvatar = useUploadStudentProfileImage();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting =
    updateParent.isPending ||
    updateStudent.isPending ||
    uploadParentAvatar.isPending ||
    uploadStudentAvatar.isPending;

  const onSubmit = handleSubmit(
    async (values) => {
      if (!parent?.id || !currentInstitution) return;
      setSubmitError(null);
      try {
        await updateParent.mutateAsync({
          id: parent.id,
          institutionId: currentInstitution.id,
          relationship: values.parent.relationship,
        });
        if (values.parent.avatar) {
          await uploadParentAvatar.mutateAsync({
            parentId: parent.id,
            institutionId: currentInstitution.id,
            image: values.parent.avatar,
          });
        }

        for (const student of values.students) {
          await updateStudent.mutateAsync({
            id: student.id,
            institutionId: currentInstitution.id,
            name: student.name,
            email: student.email,
            ...(student.dateOfBirth
              ? { dateOfBirth: toISODate(student.dateOfBirth) }
              : {}),
          });
          if (student.avatar) {
            await uploadStudentAvatar.mutateAsync({
              studentId: student.id,
              institutionId: currentInstitution.id,
              image: student.avatar,
            });
          }
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

  if (!parent?.id || !currentInstitution) {
    return (
      <SafeAreaView className="bg-background flex-1 items-center justify-center px-6">
        <Text className="text-muted-foreground text-center">
          No parent record found on this account.
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
            <Text className="text-2xl font-bold">Parent registration</Text>
            <Text className="text-muted-foreground text-sm">
              Update your parent and student details
            </Text>
          </View>

          <SectionHeader title="Parent" />

          <View className="gap-4">
            <Controller
              control={control}
              name="parent.avatar"
              render={({ field }) => (
                <View className="items-center">
                  <AvatarUpload
                    value={field.value}
                    onChange={field.onChange}
                    previewUrl={parent.profileImageUrl}
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

            <Controller
              control={control}
              name="parent.relationship"
              render={({ field, fieldState }) => (
                <Field label="Relationship" error={fieldState.error?.message}>
                  <SegmentedControl
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { label: "Parent", value: Relationship.Parent },
                      { label: "Self", value: Relationship.Self },
                    ]}
                  />
                </Field>
              )}
            />
          </View>

          {students.length > 0 && (
            <View className="mt-6">
              <SectionHeader title="Students" />
            </View>
          )}

          {students.map((student, idx) => (
            <View key={student.id} className="mt-4 gap-4">
              {idx > 0 && <Separator className="mb-1" />}

              <Controller
                control={control}
                name={`students.${idx}.avatar`}
                render={({ field }) => (
                  <View className="items-center">
                    <AvatarUpload
                      value={field.value}
                      onChange={field.onChange}
                      previewUrl={student.profileImageUrl}
                      fallback={
                        <Text className="text-base font-semibold">
                          {studentInitials(student.name)}
                        </Text>
                      }
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name={`students.${idx}.name`}
                render={({ field, fieldState }) => (
                  <Field label="Name" error={fieldState.error?.message}>
                    <Input
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Student name"
                      autoCapitalize="words"
                    />
                  </Field>
                )}
              />

              <Controller
                control={control}
                name={`students.${idx}.email`}
                render={({ field, fieldState }) => (
                  <Field label="Email" error={fieldState.error?.message}>
                    <Input
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="student@example.com"
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </Field>
                )}
              />

              <Controller
                control={control}
                name={`students.${idx}.dateOfBirth`}
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
            </View>
          ))}

          {submitError && (
            <Text className="text-destructive mt-4 text-sm">{submitError}</Text>
          )}

          <Button
            onPress={onSubmit}
            disabled={isSubmitting || formState.isSubmitting}
            className="mt-6"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text>Save</Text>
            )}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="mb-2">
      <Text className="text-lg font-semibold">{title}</Text>
    </View>
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
            value
              ? "text-foreground text-base"
              : "text-muted-foreground text-base"
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
              className="bg-secondary active:bg-secondary/80 items-center rounded-md px-3 py-2"
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

function avatarInitials(first?: string, last?: string): string {
  const f = first?.[0] ?? "";
  const l = last?.[0] ?? "";
  const out = `${f}${l}`.toUpperCase();
  return out || "?";
}

function studentInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const f = parts[0]?.[0] ?? "";
  const l = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${f}${l}`.toUpperCase() || "?";
}
