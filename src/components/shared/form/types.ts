import * as z from "zod";
import { DefaultValues, Path, SubmitHandler } from "react-hook-form";
import { HTMLInputTypeAttribute } from "react";

export type AnyObjectSchema = z.ZodObject<z.ZodRawShape>;

export type FormInput<S extends AnyObjectSchema> = {
  name: Path<z.input<S>>;
  label: string;
  type?: HTMLInputTypeAttribute;
  ariaLabel?: string;
  placeholder?: string;
  autoFocus?: boolean;
};

export type FormProps<S extends AnyObjectSchema> = {
  schema: S;
  inputs: FormInput<S>[];
  defaultValues?: DefaultValues<z.input<S>>;
  onSubmit: SubmitHandler<z.output<S>>;
  submitLabel?: string;
};
