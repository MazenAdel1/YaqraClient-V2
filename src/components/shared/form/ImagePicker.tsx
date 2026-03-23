"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useRef } from "react";
import { ImagePickerProps } from "./types";

export default function ImagePicker({
  id,
  name,
  accept = "image/*",
  ariaLabel,
  value,
  disabled,
  autoFocus,
  invalid,
  onBlur,
  onChange,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(() => {
    if (typeof value === "string") return value;
    if (value instanceof File) return URL.createObjectURL(value);
    return null;
  }, [value]);

  useEffect(() => {
    if (value instanceof File && previewUrl) {
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [value, previewUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onChange(file);
  };

  const handleClear = () => {
    onChange(undefined);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        aria-label={ariaLabel}
        disabled={disabled}
        autoFocus={autoFocus}
        onBlur={onBlur}
        onChange={handleFileChange}
        className="sr-only"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className={cn(
          "border-input bg-background hover:bg-muted flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          invalid && "border-destructive",
        )}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            width={112}
            height={112}
            alt="Preview"
            className="h-full max-h-28 w-auto rounded-md object-cover"
          />
        ) : (
          <>
            <ImageIcon className="text-muted-foreground size-6" />
            <span className="text-muted-foreground">اختر صورة من جهازك</span>
          </>
        )}
      </button>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          تغيير الصورة <Upload />
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          onClick={handleClear}
          disabled={disabled || !value}
        >
          حذف <X />
        </Button>
      </div>
    </div>
  );
}
