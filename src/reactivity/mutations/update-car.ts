import { GarageApiService } from '../../bll/garage';
import type { UpdateCarRequest } from '../../bll/garage/types';
import type { FetchResponse } from '../../utils/request';
import type { MutationConfig } from '../mutation';
import { Mutation } from '../mutation';

type Response = FetchResponse<void>;

type UpdateCarMutationConfig = Omit<
  MutationConfig<Response, UpdateCarRequest>,
  'mutateFn'
>;

export const useUpdateCarMutation = (
  config: UpdateCarMutationConfig
): Mutation<Response, UpdateCarRequest> =>
  new Mutation({
    mutateFn: (props) => GarageApiService.updateCar(props),
    ...config,
  });
