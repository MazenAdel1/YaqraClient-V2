import * as z from "zod";
import { DefaultValues, Path, SubmitHandler } from "react-hook-form";
import { HTMLInputTypeAttribute, Ref } from "react";

export type AnyObjectSchema = z.ZodObject<z.ZodRawShape>;

export type SearchSelectConfig = {
  endpoint: string;
  queryParam: string;
  optionValueKey?: string;
  optionLabelKey?: string;
  defaultOption?: { value: string | number; label: string };
  minQueryLength?: number;
  noResultsText?: string;
};

type BaseFormInput<S extends AnyObjectSchema> = {
  name: Path<z.input<S>>;
  label: string;
  placeholder?: string;
  autoFocus?: boolean;
  hidden?: boolean;
  value?: string | number;
};

type RegularFormInput<S extends AnyObjectSchema> = BaseFormInput<S> & {
  type?: HTMLInputTypeAttribute | "textarea";
  accept?: string;
};

type SearchSelectFormInput<S extends AnyObjectSchema> = BaseFormInput<S> & {
  type: "search-select";
  search: SearchSelectConfig;
};

export type FormInput<S extends AnyObjectSchema> =
  | RegularFormInput<S>
  | SearchSelectFormInput<S>;

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

export type Option = { value: string | number; label: string };

export type SearchSelectProps = {
  id: string;
  value?: string | number;
  onChange: (value: string | number | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  ariaInvalid?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  config: {
    endpoint: string;
    queryParam: string;
    optionValueKey?: string;
    optionLabelKey?: string;
    defaultOption?: Option;
    minQueryLength?: number;
    noResultsText?: string;
  };
};
