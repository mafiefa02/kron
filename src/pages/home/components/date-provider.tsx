import { useMemo, useState } from "react";
import { DateContext } from "../contexts/date-context";

export const DateProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [date, setDate] = useState(() => new Date());
  const value = useMemo(() => ({ date, setDate }), [date]);
  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
};
