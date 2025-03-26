import type { AxiosResponse } from 'axios';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
} from '../../const/pagination';
import { axiosInstance } from '../../libs/axios';
import type { PaginationResponse } from '../../types/pagination';
import { generatePaginationResponse } from '../../utils/generate-pagination-response';
import type { WinnerEntity } from './../../types/entity';
import type {
  CreateWinnerRequest,
  CreateWinnerResponse,
  EditWinnerRequest,
  EditWinnerResponse,
  WinnerResponse,
  WinnersRequest,
  WinnersResponse,
} from './types';

export class WinnersApiService {
  public static winners(
    dto: WinnersRequest
  ): Promise<PaginationResponse<WinnerEntity>> {
    const { limit = PAGINATION_DEFAULT_LIMIT, page = PAGINATION_DEFAULT_PAGE } =
      dto;

    return axiosInstance
      .get<WinnersResponse>('/winner', {
        params: { _page: page, _limit: limit },
      })
      .then((response) =>
        generatePaginationResponse({ response, page, limit })
      );
  }

  public static winner(id: string): Promise<AxiosResponse<WinnerResponse>> {
    return axiosInstance.get<WinnerResponse>(`/winner/${id}`);
  }

  public static createWinner(
    dto: CreateWinnerRequest
  ): Promise<AxiosResponse<CreateWinnerResponse>> {
    return axiosInstance.post<CreateWinnerResponse>('/winner', dto);
  }

  public static updateWinner({
    winnerId,
    ...dto
  }: EditWinnerRequest): Promise<AxiosResponse<EditWinnerResponse>> {
    return axiosInstance.put<EditWinnerResponse>(`/winner/${winnerId}`, dto);
  }

  public static deleteWinner(winnerId: number): Promise<AxiosResponse<void>> {
    return axiosInstance.delete<void>(`/winner/${winnerId}`);
  }
}
