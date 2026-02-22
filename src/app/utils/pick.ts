/* eslint-disable @typescript-eslint/no-explicit-any */


export const pickPagination = <T extends Record<string, any>>(query: T) => {
  const { limit, order, page, sortBy, ...rest } = query;

  return {
    take: Number(limit),
    order: order as "asc" | "desc",
    page: Number(page),
    sortBy: sortBy ,
    skip: (page - 1) * limit,
    rest,
  };
};
