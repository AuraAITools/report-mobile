//Outputs date in the format: 4 April 2024, 02:15 PM
export const formatTimestampToDateString = (timestamp: number): string => {
  const date = new Date(timestamp)

  const day = date.getDate()
  const month = date.toLocaleString("default", { month: "long" })
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"

  const hours12 = hours % 12 || 12

  return `${day} ${month} ${year}, ${hours12}:${minutes} ${ampm}`
}
