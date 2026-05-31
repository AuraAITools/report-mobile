export function convertTimestampToDateTime(timestamptz: string) {
  // Create a Date object from the timestamptz
  const date = new Date(timestamptz);

  // Extract date components
  const formattedDate = date.toISOString().split("T")[0];

  // Extract time in HH:MM format
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  return {
    date: formattedDate,
    time: formattedTime,
  };
}
