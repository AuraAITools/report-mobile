import { useEffect, useState } from "react";

/**
 * Progress bar will first fill to startnumber
 * after secondProgresstime, it will fille to secondProgress
 * @param startProgress
 * @param secondProgress
 * @returns
 */
export function useProgress(
  startProgress: number,
  secondProgress: number,
  secondProgressDuration: number,
) {
  const [progress, setProgress] = useState(startProgress);

  useEffect(() => {
    const timer = setTimeout(
      () => setProgress(secondProgress),
      secondProgressDuration,
    );
    return () => clearTimeout(timer);
  }, []);

  return { progress, setProgress };
}
