import type { AxiosResponse } from 'axios';
import type { PaginationResponse } from '../types/pagination';

type Props<T> = {
  response: AxiosResponse<T[]>;
  page: number;
  limit: number;
};

const TOTAL_COUNT_HEADER_NAME = 'x-total-count';

export const generatePaginationResponse = <T>(
  props: Props<T>
): PaginationResponse<T> => {
  const { response, limit, page } = props;

  const totalCountHeader = Number(response.headers[TOTAL_COUNT_HEADER_NAME]);
  const totalCount = Number.isNaN(totalCountHeader) ? 0 : totalCountHeader;

  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

  return {
    data: response.data,
    meta: {
      limit,
      page,
      totalCount,
      totalPages,
    },
  };
};
