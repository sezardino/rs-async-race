import { GarageApiService } from '../../bll/garage';
import type { DeleteCarRequest } from '../../bll/garage/types';
import type { MutationConfig } from '../mutation';
import { Mutation } from '../mutation';

type Response = void;

type DeleteCarMutationConfig = Omit<
  MutationConfig<Response, DeleteCarRequest>,
  'mutateFn'
>;

export const useDeleteCarMutation = (
  config: DeleteCarMutationConfig
): Mutation<Response, DeleteCarRequest> =>
  new Mutation({
    mutateFn: (dto: DeleteCarRequest) => GarageApiService.deleteCar(dto),
    ...config,
  });
