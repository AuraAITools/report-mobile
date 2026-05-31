import * as React from "react";
import { Pressable, TextInput, View } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = React.ComponentProps<typeof TextInput> & {
  containerClassName?: string;
};

function PasswordInput({
  containerClassName,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);
  return (
    <View className={cn("relative w-full", containerClassName)}>
      <Input
        secureTextEntry={!visible}
        autoCapitalize="none"
        className={cn("pr-10", className)}
        {...props}
      />
      <Pressable
        onPress={() => setVisible((v) => !v)}
        className="absolute right-2 top-0 h-full justify-center px-1"
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <EyeOff size={20} color="#6B7280" />
        ) : (
          <Eye size={20} color="#6B7280" />
        )}
      </Pressable>
    </View>
  );
}

export { PasswordInput };
