import * as z from "zod";
import { DefaultValues, Path, SubmitHandler } from "react-hook-form";
import { HTMLInputTypeAttribute, Ref } from "react";

export type AnyObjectSchema = z.ZodObject<z.ZodRawShape>;

export type FormInput<S extends AnyObjectSchema> = {
  name: Path<z.input<S>>;
  label: string;
  type?: HTMLInputTypeAttribute;
  ariaLabel?: string;
  placeholder?: string;
  autoFocus?: boolean;
  accept?: string;
};

export type FormProps<S extends AnyObjectSchema> = {
  schema: S;
  inputs: FormInput<S>[];
  defaultValues?: DefaultValues<z.input<S>>;
  onSubmit: SubmitHandler<z.output<S>>;
  submitLabel?: string;
  ref?: Ref<HTMLFormElement>;
};

export type ImagePickerProps = {
  id: string;
  name: string;
  accept?: string;
  ariaLabel?: string;
  value?: File | string;
  disabled?: boolean;
  autoFocus?: boolean;
  invalid?: boolean;
  onBlur?: () => void;
  onChange: (file?: File) => void;
};
