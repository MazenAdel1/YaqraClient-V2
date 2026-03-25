"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Option, SearchSelectProps } from "./types";

export default function SearchSelect({
  id,
  onChange,
  onBlur,
  placeholder,
  ariaLabel,
  ariaInvalid,
  autoFocus,
  disabled,
  config,
}: SearchSelectProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Option | null>(
    config.defaultOption ?? null,
  );

  const minLength = config.minQueryLength ?? 2;
  const canSearch = query.trim().length >= minLength;

  const { data: options = [], isFetching } = useQuery({
    queryKey: ["search-select", config.endpoint, query.trim().toLowerCase()],
    queryFn: async () => {
      const { data } = await axios.get(config.endpoint, {
        params: { [config.queryParam]: query },
      });

      const items = data?.result?.data ?? data?.result ?? [];
      return items.map((item: Record<string, unknown>) => ({
        value: item[config.optionValueKey ?? "id"],
        label: item[config.optionLabelKey ?? "title"],
      })) as Option[];
    },
    enabled: !disabled && canSearch,
    staleTime: 60_000,
  });

  const handleSelect = (opt: Option | null) => {
    setSelected(opt);
    setQuery(opt?.label ?? "");
    onChange(opt?.value);
  };

  return (
    <Combobox
      items={canSearch ? options : []}
      itemToStringValue={(item) => (item as Option)?.label ?? ""}
      inputValue={!query && selected ? selected.label : query}
      onInputValueChange={setQuery}
      value={selected}
      onValueChange={handleSelect}
    >
      <div className="relative">
        <ComboboxInput
          id={id}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-invalid={ariaInvalid}
          autoFocus={autoFocus}
          disabled={disabled}
          onBlur={onBlur}
          showClear
        />
        {isFetching && (
          <Loader2 className="text-muted-foreground pointer-events-none absolute inset-e-8 top-1/2 size-4 -translate-y-1/2 animate-spin" />
        )}
      </div>

      <ComboboxContent>
        {!canSearch ? (
          <p className="text-muted-foreground px-3 py-2 text-sm">
            اكتب حرفين على الأقل للبحث
          </p>
        ) : isFetching ? (
          <div className="text-muted-foreground flex items-center gap-2 px-3 py-2 text-sm">
            <Loader2 className="size-4 animate-spin" />
            جاري البحث...
          </div>
        ) : (
          <>
            <ComboboxEmpty>
              {config.noResultsText ?? "لا توجد نتائج"}
            </ComboboxEmpty>
            <ComboboxList>
              {(option) => (
                <ComboboxItem key={String(option.value)} value={option}>
                  {option.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </>
        )}
      </ComboboxContent>
    </Combobox>
  );
}
