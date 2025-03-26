import type { AxiosResponse } from 'axios';
import type { PaginationResponse } from '../types/pagination';

type Props<T> = {
  response: AxiosResponse<T[]>;
  page: number;
  limit: number;
};

const TOTAL_COUNT_HEADER_NAME = 'X-Total-Count';

export const generatePaginationResponse = <T>(
  props: Props<T>
): PaginationResponse<T> => {
  const { response, limit, page } = props;

  const totalCount =
    typeof response.headers[TOTAL_COUNT_HEADER_NAME] === 'number'
      ? response.headers[TOTAL_COUNT_HEADER_NAME]
      : 0;

  return {
    data: response.data,
    meta: {
      limit,
      page,
      totalCount,
    },
  };
};
