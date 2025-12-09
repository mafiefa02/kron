import { Button, ButtonProps } from "@shared/components/ui/button";
import { Calendar } from "@shared/components/ui/calendar";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { addDays, format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDateContext } from "../contexts/date-context";

export const DateSelector = () => {
  const [open, setOpen] = useState(false);
  const { date, setDate } = useDateContext();

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        setDate(date);
      }
      setOpen(false);
    },
    [setDate],
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex items-center gap-1">
        <StepDateButton stepAmount={-1}>
          <ChevronLeftIcon />
        </StepDateButton>
        <PopoverTrigger render={<Button variant="outline" />}>
          <CalendarIcon className="size-4" />
          <p>{date ? format(date, "PP") : "Select date"}</p>
        </PopoverTrigger>
        <StepDateButton stepAmount={1}>
          <ChevronRightIcon />
        </StepDateButton>
      </div>
      <PopoverPopup>
        <Calendar
          className="bg-popover p-0"
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
        />
      </PopoverPopup>
    </Popover>
  );
};

const StepDateButton = ({
  stepAmount,
  ...props
}: ButtonProps & { stepAmount: number }) => {
  const { setDate } = useDateContext();

  const handleStep = useCallback(
    () => setDate((prev) => addDays(prev, stepAmount)),
    [setDate, stepAmount],
  );

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={handleStep}
      {...props}
    />
  );
};
