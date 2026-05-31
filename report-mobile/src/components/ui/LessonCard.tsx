import { GestureResponderEvent } from "react-native";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { SubjectLesson } from "@/types/models/Subject";
import { formatTimestampToDateString } from "@/utils/DateTimeUtil";

type Theme = "blue" | "gray";

type Props = {
  title: string;
  lesson: SubjectLesson;
  theme: Theme;
  handleLessonOnPress: (event: GestureResponderEvent) => void;
  buttonText: string;
  testID?: string;
};

const LessonCard: React.FC<Props> = ({
  title,
  lesson,
  theme,
  handleLessonOnPress,
  buttonText,
  testID,
}) => {
  const isBlue = theme === "blue";
  return (
    <Card
      className={cn(
        "mb-2 mr-3 w-64",
        isBlue ? "bg-[#004E89] border-[#004E89]" : "bg-muted border-muted",
      )}
      testID={testID}
    >
      <CardHeader>
        <CardDescription className={isBlue ? "text-white/80" : undefined}>
          {title}
        </CardDescription>
        <CardTitle className={isBlue ? "text-white" : undefined}>
          {lesson.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Text className={cn("text-sm", isBlue ? "text-white/80" : undefined)}>
          {formatTimestampToDateString(lesson.timestamp)}
        </Text>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          onPress={handleLessonOnPress}
          className={cn(
            "rounded-full",
            isBlue && "border-white bg-transparent",
          )}
        >
          <Text className={isBlue ? "text-white" : undefined}>
            {buttonText}
          </Text>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LessonCard;
