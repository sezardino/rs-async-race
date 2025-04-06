import type { FetchResponse } from '../../utils/request';
import { fetchInstance } from '../../utils/request';
import type {
  EngineManipulationRequest,
  SwitchEngineToDriveRequest,
  SwitchEngineToDriveResponse,
  ToggleEngineStatusRequest,
  ToggleEngineStatusResponse,
} from './types';

export class EngineApiService {
  public static start(
    dto: EngineManipulationRequest
  ): Promise<ToggleEngineStatusResponse> {
    return fetchInstance
      .patch<ToggleEngineStatusResponse>(`engine`, {
        params: {
          id: dto.carId,
          status: 'started',
        },
      })
      .then((response) => response.data);
  }

  public static stop(
    dto: EngineManipulationRequest
  ): Promise<ToggleEngineStatusResponse> {
    return fetchInstance
      .patch<ToggleEngineStatusResponse>(`engine`, {
        params: {
          id: dto.carId,
          status: 'stopped',
        },
      })
      .then((response) => response.data);
  }

  public static toggleStatus(
    dto: ToggleEngineStatusRequest
  ): Promise<FetchResponse<ToggleEngineStatusResponse>> {
    return fetchInstance.patch<ToggleEngineStatusResponse>(`engine`, {
      body: dto,
    });
  }

  public static switchToDrive(
    dto: SwitchEngineToDriveRequest
  ): Promise<FetchResponse<SwitchEngineToDriveResponse>> {
    return fetchInstance.patch<SwitchEngineToDriveResponse>(`engine`, {
      params: {
        id: dto.carId,
        status: 'drive',
      },
    });
  }
}
