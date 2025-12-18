import { Button } from "@shared/components/ui/button";
import { isToday } from "date-fns";
import { useCallback } from "react";
import { useDateContext } from "../contexts/date-context";

export const GoToToday = () => {
  const { date, setDate } = useDateContext();

  const dateIsToday = isToday(date);
  const handleToToday = useCallback(() => setDate(new Date()), [setDate]);

  if (dateIsToday) return null;

  return (
    <Button
      variant="link"
      className="-mb-1 text-sm leading-0 font-light"
      size="sm"
      onClick={handleToToday}
    >
      Go to Today
    </Button>
  );
};
