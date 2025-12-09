import { useState } from "react";
import { DateContext } from "../contexts/date-context";

export const DateProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [date, setDate] = useState(new Date());
  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};
