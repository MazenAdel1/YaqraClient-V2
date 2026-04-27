import { FormProps } from "@/components/shared/form";
import z from "zod";

export const FINDER_SCHEMA = z.object({
  AuthorIds: z.array(z.coerce.number()).optional().default([]),
  GenreIds: z.array(z.coerce.number()).optional().default([]),
  MinimumRate: z.coerce.number().optional().default(0),
});

export const FINDER_INPUTS: FormProps<typeof FINDER_SCHEMA>["inputs"] = [
  {
    label: "كُتّاب",
    type: "search-select",
    name: "AuthorIds",
    placeholder: "ابحث عن كاتب",
    search: {
      endpoint: "/author/name",
      queryParam: "authorName",
      optionLabelKey: "name",
      optionValueKey: "id",
      minQueryLength: 2,
      multiple: true,
    },
  },
  {
    label: "تصنيفات",
    type: "search-select",
    name: "GenreIds",
    placeholder: "ابحث عن تصنيف",
    search: {
      endpoint: "/genre/name",
      queryParam: "genreName",
      optionLabelKey: "genreName",
      optionValueKey: "genreId",
      minQueryLength: 2,
      multiple: true,
    },
  },
  {
    label: "التقييم",
    type: "range",
    name: "MinimumRate",
    placeholder: "أقل تقييم",
    min: 0,
    max: 10,
    step: 0.5,
  },
];

export const FINDER_DEFAULT_VALUES = {
  MinimumRate: 0,
};
