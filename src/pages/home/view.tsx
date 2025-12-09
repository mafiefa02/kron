import { AddNewScheduleButton } from "./components/add-new-schedule-button";
import { DateProvider } from "./components/date-provider";
import { DateSelector } from "./components/date-selector";
import { ScheduleList } from "./components/schedule-list";
import { SearchProvider } from "./components/search-provider";
import { SearchSchedules } from "./components/search-schedules";

export const Home = () => {
  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <DateProvider>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Schedules</h1>
          <DateSelector />
        </div>

        <SearchProvider>
          <div className="flex items-center gap-2">
            <SearchSchedules />
            <AddNewScheduleButton />
          </div>

          <ScheduleList />
        </SearchProvider>
      </DateProvider>
    </div>
  );
};
