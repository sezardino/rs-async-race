export type PaginationRequest = {
  page: number;
  limit: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalCount: number;
};

export type PaginationResponse<T> = {
  meta: PaginationMeta;
  data: T[];
};
