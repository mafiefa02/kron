import { clsx, type ClassValue } from "clsx";
import { format, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

/** Merge classes value */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Parse given "yyyy-MM-dd" string to a `Date` object */
export const parseDate = (dateStr: string, ref: Date = new Date()) => {
  return parse(dateStr, "yyyy-MM-dd", ref);
};

/** Formats `Date` object to "yyyy-MM-dd" */
export const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

/** Minutes since midnight to "HH:mm" format */
export const formatTime = (totalMinutes: number) => {
  const date = new Date();
  date.setHours(0, totalMinutes, 0, 0);
  return format(date, "HH:mm");
};

/** Handles general error */
export const handleError = (e: unknown): never => {
  if (e instanceof Error) {
    throw new Error(e.message);
  }
  throw new Error("An unknown error occurred");
};
