import type { FetchResponse } from '../../utils/request';
import { fetchInstance } from '../../utils/request';
import type {
  SwitchEngineToDriveRequest,
  SwitchEngineToDriveResponse,
  ToggleEngineStatusRequest,
  ToggleEngineStatusResponse,
} from './types';

export class EngineApiService {
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
    return fetchInstance.post<SwitchEngineToDriveResponse>(`/races`, {
      body: {
        ...dto,
        status: 'drive',
      },
    });
  }
}
