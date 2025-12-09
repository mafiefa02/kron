import { createContext, useContext } from "react";

type DateContextType = {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
};

export const DateContext = createContext<DateContextType | undefined>(
  undefined,
);

export const useDateContext = () => {
  const context = useContext(DateContext);

  if (!context) {
    throw new Error("useDateContext must be used within DateProvider");
  }

  return context;
};
