import { Button, ButtonProps } from "@shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@shared/components/ui/dialog";
import { PlusIcon } from "lucide-react";

export const AddNewScheduleButton = (props: ButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            size="icon"
            {...props}
          />
        }
      >
        <PlusIcon />
      </DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>New Schedule</DialogTitle>
          <DialogDescription>Add new schedule</DialogDescription>
        </DialogHeader>
        <DialogPanel>tes</DialogPanel>
        <DialogFooter className="flex items-center gap-2">
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <Button>Create</Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
};
