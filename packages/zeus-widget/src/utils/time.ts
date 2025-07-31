import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export const formatTime = (timestamp: number) =>
  dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");

export function toRelativeTime(timestamp: number) {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  // Less than 1 minute
  if (diffInSeconds < 60) {
    return `${diffInSeconds} ${diffInSeconds === 1 ? "second" : "seconds"} ago`;
  }
  // Less than 1 hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
  }
  // Less than 1 day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  return formatTime(timestamp);
}
