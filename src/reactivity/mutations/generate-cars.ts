import { GarageApiService } from '../../bll/garage';
import type { MutationConfig } from '../mutation';
import { Mutation } from '../mutation';

type Response = void;

type GenerateCarsMutationConfig = Omit<
  MutationConfig<Response, object>,
  'mutateFn'
>;

export const useGenerateCarsMutation = (
  config: GenerateCarsMutationConfig
): Mutation<Response, object> =>
  new Mutation({
    mutateFn: () => GarageApiService.generateCars(),
    ...config,
  });
