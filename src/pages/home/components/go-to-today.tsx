import { Button } from "@shared/components/ui/button";
import { isToday } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { useDateContext } from "../contexts/date-context";

export const GoToToday = () => {
  const { date, setDate } = useDateContext();
  const [today] = useState(new Date());

  const dateIsToday = useMemo(() => isToday(date), [date]);
  const handleToToday = useCallback(() => setDate(today), [setDate, today]);

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
