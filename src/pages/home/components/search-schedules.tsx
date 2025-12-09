import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@shared/components/ui/input-group";
import { Kbd } from "@shared/components/ui/kbd";
import { SearchIcon } from "lucide-react";
import { useSearchContext } from "../contexts/search-context";

export const SearchSchedules = () => {
  const { search, setSearch } = useSearchContext();
  return (
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search schedules..."
      />
      <InputGroupAddon align="inline-end">
        <Kbd>/</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
};
