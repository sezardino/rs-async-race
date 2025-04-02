import { WinnersApiService } from '../../bll/winners';
import type { WinnersRequest } from '../../bll/winners/types';
import type { WinnerWithCar } from '../../types/entity';
import type { PaginationResponse } from '../../types/pagination';
import type { QueryConfig } from '../query';
import { Query } from '../query';

type Response = PaginationResponse<WinnerWithCar>;

type WinnersQueryConfig = Omit<
  QueryConfig<Response, WinnersRequest>,
  'callback'
>;

export const useWinnersQuery = (
  config: WinnersQueryConfig
): Query<Response, WinnersRequest> =>
  new Query({
    callback: (arguments_): Promise<Response> =>
      WinnersApiService.winners(arguments_),
    ...config,
  });
