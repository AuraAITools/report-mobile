"use client";
import * as Progress from "@radix-ui/react-progress";
import { useProgress } from "./useProgress";

export default function ProgressBar() {
  const { progress, setProgress } = useProgress(10, 70, 30);
  return (
    <Progress.Root
      className='relative sm:h-[25px] sm:w-[300px] md:w-[640px] lg:w-[700px] overflow-hidden rounded-full bg-white shadow-lg'
      style={{
        transform: "translateZ(0)",
      }}
      value={progress}
    >
      <Progress.Indicator
        className='ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full bg-orange-300 transition-transform duration-[660ms]'
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
}
