import type { AxiosResponse } from 'axios';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
} from '../../const/pagination';
import { axiosInstance } from '../../libs/axios';
import type { WinnerWithCar } from '../../types/entity';
import type { PaginationResponse } from '../../types/pagination';
import { generatePaginationResponse } from '../../utils/generate-pagination-response';
import { GarageApiService } from '../garage';
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
  ): Promise<PaginationResponse<WinnerWithCar>> {
    const { limit = PAGINATION_DEFAULT_LIMIT, page = PAGINATION_DEFAULT_PAGE } =
      dto;

    return axiosInstance
      .get<WinnersResponse>('/winners', {
        params: { _page: page, _limit: limit },
      })
      .then(async (response) => {
        const cars = await Promise.all(
          response.data.map(async (w) => {
            try {
              const car = await GarageApiService.car(w.id);

              return car.data;
            } catch {
              return null;
            }
          })
        );

        return {
          ...response,
          data: response.data.map((winner) => ({
            ...winner,
            car: cars.find((car) => car?.id === winner.id) || null,
          })),
        };
      })
      .then((response) =>
        generatePaginationResponse({ response, page, limit })
      );
  }

  public static winner(id: string): Promise<AxiosResponse<WinnerResponse>> {
    return axiosInstance.get<WinnerResponse>(`/winners/${id}`);
  }

  public static createWinner(
    dto: CreateWinnerRequest
  ): Promise<AxiosResponse<CreateWinnerResponse>> {
    return axiosInstance.post<CreateWinnerResponse>('/winners', dto);
  }

  public static updateWinner({
    winnerId,
    ...dto
  }: EditWinnerRequest): Promise<AxiosResponse<EditWinnerResponse>> {
    return axiosInstance.put<EditWinnerResponse>(`/winners/${winnerId}`, dto);
  }

  public static deleteWinner(winnerId: number): Promise<AxiosResponse<void>> {
    return axiosInstance.delete<void>(`/winners/${winnerId}`);
  }
}
