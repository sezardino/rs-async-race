import { EngineApiService } from '../../bll/engine';
import type {
  SwitchEngineToDriveRequest,
  SwitchEngineToDriveResponse,
} from '../../bll/engine/types';
import type { FetchResponse } from '../../utils/request';
import type { MutationConfig } from '../mutation';
import { Mutation } from '../mutation';

type Response = FetchResponse<SwitchEngineToDriveResponse>;

type CarDriveMutationConfig = Omit<
  MutationConfig<Response, SwitchEngineToDriveRequest>,
  'mutateFn'
>;

export const useCarDriveMutation = (
  config: CarDriveMutationConfig
): Mutation<Response, SwitchEngineToDriveRequest> =>
  new Mutation({
    mutateFn: (props) => EngineApiService.switchToDrive(props),
    ...config,
  });
