/* eslint-disable @typescript-eslint/no-explicit-any */
export const pickPagination = <T extends Record<string, any>>(query: T) => {
  const { limit = 10, order = "desc", page = 1, sortBy = "createdAt", cursor, ...rest } = query;

  return {
    take: Number(limit) + 1,                                    // ✅ always +1
    order: order as "asc" | "desc",
    page: Number(page),
    sortBy: sortBy as string,
    skip: cursor ? 1 : (Number(page) - 1) * Number(limit),     // ✅ Number() cast
    cursor: cursor as string | undefined,
    rest,
  };
};