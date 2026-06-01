import { Platform } from "react-native";
import Animated, { type AnimatedProps } from "react-native-reanimated";
import { View, type ViewProps } from "react-native";

type Props = AnimatedProps<ViewProps>;

export function NativeOnlyAnimatedView(props: Props) {
  if (Platform.OS === "web") {
    const { entering: _e, exiting: _x, ...rest } = props;
    return <View {...(rest as ViewProps)} />;
  }
  return <Animated.View {...props} />;
}
