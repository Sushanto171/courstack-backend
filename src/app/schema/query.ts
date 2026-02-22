
import z from "zod";

const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().min(1).optional(),
})

export const sortOrderQuery = <
  T extends readonly [string, ...string[]]
>(
  sortFields: T,
  defaultSort: T[number],
  defaultOrder: "asc" | "desc" = "asc"
) => {
  return z.object({
    sortBy: z.enum(sortFields).default(defaultSort),
    order: z.enum(["asc", "desc"]).default(defaultOrder),
  });
};


export const buildQuerySchema = <
  TSort extends readonly [string, ...string[]],
  TFilters extends z.ZodObject
>(config: {
  sortFields: TSort;
  defaultSort: TSort[number];
  defaultOrder?: "asc" | "desc";
  filters: TFilters;
}) => {
  const { sortFields, defaultSort, defaultOrder = "desc", filters } = config;

  return paginationQuery
    .merge(sortOrderQuery(sortFields, defaultSort, defaultOrder))
    .merge(filters);
};

export type IPaginationQuery = z.infer<typeof paginationQuery>