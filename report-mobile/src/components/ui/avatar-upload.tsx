import { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  manipulateAsync,
  SaveFormat,
} from "expo-image-manipulator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export type PickedImage = {
  uri: string;
  mimeType: string;
  fileName?: string | null;
  fileSize?: number;
};

type Props = {
  value?: PickedImage | null;
  onChange?: (asset: PickedImage | null) => void;
  /** Image URL shown when there's no in-memory `value` yet (e.g. existing avatar). */
  previewUrl?: string | null;
  fallback?: React.ReactNode;
  /** Max accepted file size in bytes. Default 5MB. */
  maxSize?: number;
  /** Compression quality 0..1 passed to the image picker. Default 0.8. */
  quality?: number;
  onError?: (message: string) => void;
  disabled?: boolean;
  hideControls?: boolean;
  className?: string;
};

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp"];

export function AvatarUpload({
  value,
  onChange,
  previewUrl,
  fallback,
  maxSize = DEFAULT_MAX_SIZE,
  quality = 0.8,
  onError,
  disabled,
  hideControls,
  className,
}: Props) {
  const [picking, setPicking] = useState(false);

  const displayUri = value?.uri ?? previewUrl ?? undefined;

  const reportError = (message: string) => {
    if (onError) onError(message);
    else Alert.alert("Couldn't pick image", message);
  };

  const handlePick = async () => {
    if (disabled || picking) return;
    setPicking(true);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        reportError("Photo library permission is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality,
      });

      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset) return;

      const mimeType = asset.mimeType ?? "image/jpeg";
      if (!ALLOWED_MIME.includes(mimeType)) {
        reportError("Image must be PNG, JPEG or WebP.");
        return;
      }

      const cropped = await cropToSquare(asset, mimeType, quality);

      if (typeof cropped.fileSize === "number" && cropped.fileSize > maxSize) {
        const mb = (maxSize / (1024 * 1024)).toFixed(1);
        reportError(`Image is too large. Max ${mb} MB.`);
        return;
      }

      onChange?.(cropped);
    } catch (e) {
      reportError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setPicking(false);
    }
  };

  return (
    <View className={cn("items-center gap-2", className)}>
      <Pressable
        onPress={handlePick}
        disabled={disabled || picking}
        accessibilityRole="button"
        accessibilityLabel={displayUri ? "Change avatar" : "Upload avatar"}
        className={cn(
          "size-24 overflow-hidden rounded-full",
          disabled && "opacity-50",
        )}
      >
        <Avatar alt="Profile" className="size-24">
          {displayUri ? <AvatarImage source={{ uri: displayUri }} /> : null}
          <AvatarFallback>
            {fallback ?? (
              <Ionicons name="image-outline" size={32} color="#9CA3AF" />
            )}
          </AvatarFallback>
        </Avatar>
        <View className="absolute inset-0 items-center justify-center rounded-full bg-black/35">
          <Ionicons
            name={displayUri ? "camera" : "cloud-upload-outline"}
            size={22}
            color="#FFFFFF"
          />
        </View>
      </Pressable>

      {!hideControls && displayUri && !disabled ? (
        <Button
          variant="ghost"
          size="sm"
          onPress={() => onChange?.(null)}
        >
          <Ionicons name="close" size={14} color="#374151" />
          <Text>Remove</Text>
        </Button>
      ) : null}
    </View>
  );
}

async function cropToSquare(
  asset: ImagePicker.ImagePickerAsset,
  mimeType: string,
  quality: number,
): Promise<PickedImage> {
  const { width, height, uri, fileName } = asset;
  if (!width || !height || Math.abs(width - height) <= 1) {
    return { uri, mimeType, fileName, fileSize: asset.fileSize };
  }

  const side = Math.min(width, height);
  const originX = Math.floor((width - side) / 2);
  const originY = Math.floor((height - side) / 2);

  const format = mimeType === "image/png" ? SaveFormat.PNG : SaveFormat.JPEG;
  const outputMime = format === SaveFormat.PNG ? "image/png" : "image/jpeg";

  const result = await manipulateAsync(
    uri,
    [{ crop: { originX, originY, width: side, height: side } }],
    { compress: quality, format },
  );

  return { uri: result.uri, mimeType: outputMime, fileName };
}
