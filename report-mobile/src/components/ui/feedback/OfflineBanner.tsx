import Animated, { SlideInUp } from "react-native-reanimated";
import { CloudOff } from "lucide-react-native";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function OfflineBanner() {
  return (
    <Animated.View entering={SlideInUp.duration(400)}>
      <Alert
        icon={CloudOff}
        className="rounded-none border-x-0 border-t-0 border-b border-amber-200 bg-amber-100"
        iconClassName="text-amber-800"
      >
        <AlertDescription className="text-amber-800">
          You&apos;re offline — showing cached data
        </AlertDescription>
      </Alert>
    </Animated.View>
  );
}
