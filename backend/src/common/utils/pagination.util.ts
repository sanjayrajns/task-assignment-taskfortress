export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Parses and sanitizes pagination query params with safe defaults.
 * Caps limit at 100 to prevent abuse.
 */
export const parsePagination = (
  query: { page?: string; limit?: string }
): PaginationQuery => {
  const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
