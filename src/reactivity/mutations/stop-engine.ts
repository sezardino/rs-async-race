import { EngineApiService } from '../../bll/engine';
import type {
  EngineManipulationRequest,
  EngineManipulationResponse,
} from '../../bll/engine/types';
import type { MutationConfig } from '../mutation';
import { Mutation } from '../mutation';

type Response = EngineManipulationResponse;

type StopEngineMutationConfig = Omit<
  MutationConfig<Response, EngineManipulationRequest>,
  'mutateFn'
>;

export const useStopEngineMutation = (
  config: StopEngineMutationConfig
): Mutation<Response, EngineManipulationRequest> =>
  new Mutation({
    mutateFn: (props) => EngineApiService.stop(props),
    ...config,
  });
