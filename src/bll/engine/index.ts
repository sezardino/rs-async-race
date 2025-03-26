import type { AxiosResponse } from 'axios';
import { axiosInstance } from '../../libs/axios';
import type {
  SwitchEngineToDriveRequest,
  SwitchEngineToDriveResponse,
  ToggleEngineStatusRequest,
  ToggleEngineStatusResponse,
} from './types';

export class EngineApiService {
  public static toggleStatus(
    dto: ToggleEngineStatusRequest
  ): Promise<AxiosResponse<ToggleEngineStatusResponse>> {
    return axiosInstance.patch<ToggleEngineStatusResponse>(`engine`, dto);
  }

  public static switchToDrive(
    dto: SwitchEngineToDriveRequest
  ): Promise<AxiosResponse<SwitchEngineToDriveResponse>> {
    return axiosInstance.post<SwitchEngineToDriveResponse>(`/races`, {
      ...dto,
      status: 'drive',
    });
  }
}
