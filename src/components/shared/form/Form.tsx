"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AnyObjectSchema, FormProps } from "./types";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Form<S extends AnyObjectSchema>({
  schema,
  inputs,
  defaultValues,
  onSubmit,
  submitLabel = "ارسال",
}: FormProps<S>) {
  const form = useForm<z.input<S>, unknown, z.output<S>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (e) => {
        try {
          await onSubmit(e);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          form.setError("root", {
            message: error.response?.data?.message || error.response?.message,
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
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel htmlFor={String(input.name)}>
                {input.label}
              </FieldLabel>
              <Input
                {...field}
                id={String(input.name)}
                type={input.type}
                placeholder={input.placeholder}
                aria-label={input.ariaLabel ?? input.label}
                aria-invalid={fieldState.invalid}
                value={
                  typeof field.value === "string" ||
                  typeof field.value === "number"
                    ? field.value
                    : ""
                }
                autoFocus={input.autoFocus}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
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
