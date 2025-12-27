import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@shared/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { useSearchContext } from "../contexts/search-context";

export const SearchProfiles = () => {
  const { search, setSearch } = useSearchContext();
  return (
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search profiles..."
      />
    </InputGroup>
  );
};
