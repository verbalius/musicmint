import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);
export const trimAddress = (address?: string) => {
  if (!address) {
    return "";
  }
  return `${address.slice(0, 4)}....${address.slice(address.length - 4)}`;
};

export function getImageUrl(artistName: string) {
  const date = new Date();
  const baseURL = "https://noun-api.com/beta/pfp?name=";
  const imageFormat = ".png";

  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hour = date.getUTCHours().toString().padStart(2, "0");
  const minute = date.getUTCMinutes().toString().padStart(2, "0");

  return (
    baseURL + artistName + year + month + day + hour + minute + imageFormat
  );
}

export function isWithinLastMinute(timestamp: string, now: Dayjs): boolean {
  const timestampDate: Dayjs = dayjs(timestamp);

  const minuteAgo: Dayjs = now.subtract(1, "minute");
  const startOfCurrentMinute: Dayjs = now.startOf("minute");
  const endOfCurrentMinute: Dayjs = now.endOf("minute");

  return (
    (timestampDate.isSameOrAfter(startOfCurrentMinute) &&
      timestampDate.isBefore(endOfCurrentMinute)) ||
    (timestampDate.isSameOrAfter(minuteAgo) &&
      timestampDate.isBefore(startOfCurrentMinute))
  );
}
