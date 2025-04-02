import { GarageApiService } from '../../bll/garage';
import type { CarEntity } from '../../types/entity';
import type {
  PaginationRequest,
  PaginationResponse,
} from '../../types/pagination';
import type { QueryConfig } from '../query';
import { Query } from '../query';

type Response = PaginationResponse<CarEntity>;

type GarageQueryConfig = Omit<
  QueryConfig<Response, PaginationRequest>,
  'callback'
>;

export const useGarageQuery = (
  config: GarageQueryConfig
): Query<Response, PaginationRequest> =>
  new Query({
    callback: (arguments_): Promise<Response> =>
      GarageApiService.cars(arguments_),
    ...config,
  });
