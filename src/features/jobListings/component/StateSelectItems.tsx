import { SelectItem } from "@/components/ui/select";
import states from "@/data/state.json";

export default function StateSelectItems() {
  return Object.entries(states).map(([abbreviation, name]) => (
    <SelectItem key={abbreviation} value={abbreviation}>
      {name}
    </SelectItem>
  ));
}
