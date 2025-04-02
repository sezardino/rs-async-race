import { GarageApiService } from '../../bll/garage';
import type { CreateCarRequest } from '../../bll/garage/types';
import type { FetchResponse } from '../../utils/request';
import type { MutationConfig } from '../mutation';
import { Mutation } from '../mutation';

type Response = FetchResponse<void>;

type CreateCarMutationConfig = Omit<
  MutationConfig<Response, CreateCarRequest>,
  'mutateFn'
>;

export const useCreateCarMutation = (
  config: CreateCarMutationConfig
): Mutation<Response, CreateCarRequest> =>
  new Mutation({
    mutateFn: (props) => GarageApiService.createCar(props),
    ...config,
  });
