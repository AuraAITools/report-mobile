import Image from "next/image";
import ProgressBar from "../progress-bar/ProgressBar";
type LoadingComponentProps = {
  image: {
    src: string;
    alt?: string;
    className?: string;
    width: number;
    height: number;
  };
  loadingMessage: string;
  className?: string;
};
export default function LoadingComponent(props: LoadingComponentProps) {
  return (
    <div
      className={`flex flex-col gap-4 w-full h-full justify-center items-center ${
        props.className && props.className
      }`}
    >
      <div className="animate-pulse duration-75">
        <div className="flex justify-center items-center gap-4">
          <Image
            src={props.image.src}
            alt={props.image.alt || ""}
            className={props.image.className || ""}
            width={props.image.width}
            height={props.image.height}
          />
          <p className="text-lg">{props.loadingMessage}</p>
        </div>
      </div>
      <ProgressBar />
    </div>
  );
}
