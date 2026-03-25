"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AnyObjectSchema, FormProps } from "./types";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ImagePicker from "./ImagePicker";
import { Textarea } from "@/components/ui/textarea";
import SearchSelect from "./SearchSelect";
import { cn } from "@/lib/utils";

const DEFAULT_INVALID_MESSAGE = "البينات غير صالحة";

function formatValidationMessage(message?: string) {
  if (!message) return undefined;

  if (message.includes("received")) {
    return DEFAULT_INVALID_MESSAGE;
  }

  return message;
}

export default function Form<S extends AnyObjectSchema>({
  schema,
  inputs,
  defaultValues,
  onSubmit,
  submitLabel = "ارسال",
  ref,
}: FormProps<S>) {
  const form = useForm<z.input<S>, unknown, z.output<S>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form
      ref={ref}
      onSubmit={form.handleSubmit(async (e) => {
        try {
          await onSubmit(e);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          form.setError("root", {
            message:
              error.response?.data?.message ||
              error.response?.data.errorMessage,
          });
        }
      })}
      className="flex w-full flex-col gap-4"
    >
      {inputs.map((input) => (
        <Controller
          key={input.name}
          name={input.name}
          control={form.control}
          render={({ field, fieldState }) =>
            input.hidden ? (
              <input
                type="hidden"
                name={field.name}
                value={
                  typeof field.value === "string" ||
                  typeof field.value === "number"
                    ? field.value
                    : ""
                }
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            ) : (
              <Field data-invalid={fieldState.invalid} className={cn("w-full")}>
                <FieldLabel htmlFor={String(input.name)}>
                  {input.label}
                </FieldLabel>
                {"search" in input ? (
                  <SearchSelect
                    id={String(input.name)}
                    value={
                      typeof field.value === "string" ||
                      typeof field.value === "number"
                        ? field.value
                        : undefined
                    }
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={input.placeholder || input.label}
                    ariaLabel={input.label}
                    ariaInvalid={fieldState.invalid}
                    autoFocus={input.autoFocus}
                    config={input.search}
                  />
                ) : input.type === "file" ? (
                  <ImagePicker
                    id={String(input.name)}
                    name={field.name}
                    accept={"accept" in input ? input.accept : undefined}
                    ariaLabel={input.label}
                    value={
                      field.value instanceof File ||
                      typeof field.value === "string"
                        ? field.value
                        : undefined
                    }
                    autoFocus={input.autoFocus}
                    invalid={fieldState.invalid}
                    onBlur={field.onBlur}
                    onChange={(file) => field.onChange(file)}
                  />
                ) : input.type === "textarea" ? (
                  <Textarea
                    {...field}
                    id={String(input.name)}
                    placeholder={input.placeholder || input.label}
                    aria-label={input.label}
                    aria-invalid={fieldState.invalid}
                    autoFocus={input.autoFocus}
                    value={typeof field.value === "string" ? field.value : ""}
                    className={"field-sizing-content resize-none"}
                  />
                ) : (
                  <Input
                    {...field}
                    id={String(input.name)}
                    type={input.type}
                    placeholder={input.placeholder || input.label}
                    aria-label={input.label}
                    aria-invalid={fieldState.invalid}
                    value={
                      typeof field.value === "string" ||
                      typeof field.value === "number"
                        ? field.value
                        : ""
                    }
                    onChange={(event) => {
                      if (input.type === "number") {
                        const rawValue = event.target.value;
                        field.onChange(
                          rawValue === "" ? undefined : Number(rawValue),
                        );
                        return;
                      }

                      field.onChange(event);
                    }}
                    autoFocus={input.autoFocus}
                  />
                )}
                <FieldError>
                  {formatValidationMessage(fieldState.error?.message)}
                </FieldError>
              </Field>
            )
          }
        />
      ))}

      {form.formState.errors.root && (
        <div className="text-destructive text-sm">
          {form.formState.errors.root.message}
        </div>
      )}

      <Button
        type="submit"
        className={"w-full"}
        disabled={form.formState.isSubmitting}
      >
        {submitLabel}{" "}
        {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
      </Button>
    </form>
  );
}
