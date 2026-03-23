"use client";

import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { RadioGroup } from "@/components/ui/radio-group";
import { ChevronsRight } from "lucide-react";

export default function ItemLists({ data, selected, setSelected }: { data: any[], selected: string | null, setSelected: (value: string) => void }) {
  const handleSelect = (value: string) => {
    setSelected(value);
  };
  return (
    <RadioGroup defaultValue="plus" className="w-full">
      {data.map((item) => (
        <Item variant={selected === item.label ? 'muted' : 'default'} key={item.id} onClick={() => handleSelect(item.label)}>
          <ItemMedia variant="icon">
            <ChevronsRight/>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{item.label}</ItemTitle>
          </ItemContent>
        </Item>
      ))}
    </RadioGroup>
  );
}
