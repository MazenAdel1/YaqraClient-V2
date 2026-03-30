"use client";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Option, SearchSelectProps } from "./types";
import { useDebounce } from "@/hooks";

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
  const isMultiple = config.multiple ?? false;

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Option | Option[] | null>(
    isMultiple ? (config.defaultOptions ?? []) : (config.defaultOption ?? null),
  );

  const minLength = config.minQueryLength ?? 2;
  const canSearch = query.trim().length >= minLength;
  const debouncedQuery = useDebounce(query, 300) as string;

  const { data: options = [], isFetching } = useQuery({
    queryKey: [
      "search-select",
      config.endpoint,
      debouncedQuery.trim().toLowerCase(),
    ],
    queryFn: async () => {
      const { data } = await axios.get(config.endpoint, {
        params: { [config.queryParam]: debouncedQuery },
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

  const handleSelect = (opt: Option | Option[] | null) => {
    setSelected(opt);

    if (isMultiple) {
      const arr = (opt as Option[] | null) ?? [];
      onChange(arr.map((o) => o.value));
    } else {
      const single = opt as Option | null;
      setQuery(single?.label ?? "");
      onChange(single?.value);
    }
  };

  const displayValue = isMultiple
    ? query
    : query || ((selected as Option | null)?.label ?? "");

  return (
    <Combobox
      items={canSearch ? options : []}
      itemToStringValue={(item) => (item as Option)?.label ?? ""}
      inputValue={displayValue}
      onInputValueChange={setQuery}
      multiple={isMultiple}
      value={selected}
      onValueChange={handleSelect}
    >
      {isMultiple ? (
        <ComboboxChips aria-invalid={ariaInvalid}>
          <ComboboxValue>
            {(selected as Option[]).map((o) => (
              <ComboboxChip key={String(o.value)}>{o.label}</ComboboxChip>
            ))}
          </ComboboxValue>
          <ComboboxChipsInput
            id={id}
            placeholder={placeholder}
            aria-label={ariaLabel}
            aria-invalid={ariaInvalid}
            autoFocus={autoFocus}
            disabled={disabled}
            onBlur={onBlur}
          />
        </ComboboxChips>
      ) : (
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
      )}

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
