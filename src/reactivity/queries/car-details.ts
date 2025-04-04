import { GarageApiService } from '../../bll/garage';
import type {
  CarDetailsRequest,
  CarDetailsResponse,
} from '../../bll/garage/types';
import type { FetchResponse } from '../../utils/request';
import type { QueryConfig } from '../query';
import { Query } from '../query';

type Response = FetchResponse<CarDetailsResponse>;

type CarDetailsQueryConfig = Omit<
  QueryConfig<Response, CarDetailsRequest>,
  'callback'
>;

export const useCarDetailsQuery = (
  config: CarDetailsQueryConfig
): Query<Response, CarDetailsRequest> =>
  new Query({
    callback: (arguments_): Promise<Response> =>
      GarageApiService.car(arguments_),
    ...config,
  });
