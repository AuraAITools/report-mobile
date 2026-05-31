import { useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";

interface UseAppStateOptions {
  onForeground?: () => void;
  onBackground?: () => void;
}

export function useAppState(options: UseAppStateOptions = {}) {
  const { onForeground, onBackground } = options;
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );
  const previousAppState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        const prev = previousAppState.current;

        if (
          (prev === "inactive" || prev === "background") &&
          nextAppState === "active"
        ) {
          onForeground?.();
        }

        if (
          prev === "active" &&
          (nextAppState === "inactive" || nextAppState === "background")
        ) {
          onBackground?.();
        }

        previousAppState.current = nextAppState;
        setAppState(nextAppState);
      },
    );

    return () => {
      subscription.remove();
    };
  }, [onForeground, onBackground]);

  return {
    appState,
    previousAppState: previousAppState.current,
  };
}
