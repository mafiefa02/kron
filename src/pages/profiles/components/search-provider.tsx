import { useState } from "react";
import { SearchContext } from "../contexts/search-context";

export const SearchProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [search, setSearch] = useState("");
  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};
