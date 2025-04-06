import { EngineApiService } from '../../bll/engine';
import type {
  EngineManipulationRequest,
  EngineManipulationResponse,
} from '../../bll/engine/types';
import type { FetchResponse } from '../../utils/request';
import type { MutationConfig } from '../mutation';
import { Mutation } from '../mutation';

type Response = FetchResponse<EngineManipulationResponse>;

type StartEngineMutationConfig = Omit<
  MutationConfig<Response, EngineManipulationRequest>,
  'mutateFn'
>;

export const useStartEngineMutation = (
  config: StartEngineMutationConfig
): Mutation<Response, EngineManipulationRequest> =>
  new Mutation({
    mutateFn: (props) => EngineApiService.start(props),
    ...config,
  });
