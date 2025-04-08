import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
} from '../../const/pagination';
import type { WinnerWithCar } from '../../types/entity';
import type { PaginationResponse } from '../../types/pagination';
import { generatePaginationResponse } from '../../utils/generate-pagination-response';
import { msToSeconds } from '../../utils/ms-to-seconds';
import type { FetchAcceptedData, FetchResponse } from '../../utils/request';
import { fetchInstance } from '../../utils/request';
import { GarageApiService } from '../garage';
import type {
  CreateWinnerRequest,
  CreateWinnerResponse,
  EditWinnerRequest,
  EditWinnerResponse,
  SaveWinnerRequest,
  WinnerManipulationRequest,
  WinnerResponse,
  WinnersRequest,
  WinnersResponse,
} from './types';

export class WinnersApiService {
  public static winners(
    dto: WinnersRequest
  ): Promise<PaginationResponse<WinnerWithCar>> {
    const {
      limit = PAGINATION_DEFAULT_LIMIT,
      page = PAGINATION_DEFAULT_PAGE,
      sort,
    } = dto;

    const parameters: FetchAcceptedData = { _page: page, _limit: limit };

    if (sort && sort.order && sort.field) {
      parameters._sort = sort.field;
      parameters._order = sort.order;
    }

    return fetchInstance
      .get<WinnersResponse>('/winners', { params: parameters })
      .then(async (response) => {
        const cars = await Promise.all(
          response.data.map(async (winner) => {
            try {
              const car = await GarageApiService.car({ carId: winner.id });

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

  public static winner({
    carId,
  }: WinnerManipulationRequest): Promise<FetchResponse<WinnerResponse>> {
    return fetchInstance.get<WinnerResponse>(`/winners/${carId}`);
  }

  public static createWinner(
    dto: CreateWinnerRequest
  ): Promise<FetchResponse<CreateWinnerResponse>> {
    return fetchInstance.post<CreateWinnerResponse>('/winners', { body: dto });
  }

  public static updateWinner({
    carId,
    ...dto
  }: EditWinnerRequest): Promise<FetchResponse<EditWinnerResponse>> {
    return fetchInstance.put<EditWinnerResponse>(`/winners/${carId}`, {
      body: dto,
    });
  }

  public static deleteWinner({
    carId,
  }: WinnerManipulationRequest): Promise<FetchResponse<void>> {
    return fetchInstance.delete<void>(`/winners/${carId}`);
  }

  public static async saveWinner(dto: SaveWinnerRequest): Promise<void> {
    const { carId, time } = dto;

    const timeSeconds = msToSeconds(time);

    try {
      const winnerResponse = await WinnersApiService.winner({ carId });

      const { data } = winnerResponse;

      const dataToSave = {
        time: timeSeconds < data.time ? timeSeconds : undefined,
        wins: data.wins + 1,
      };

      await WinnersApiService.updateWinner({ carId, ...dataToSave });
    } catch (error) {
      console.log(error);
      await WinnersApiService.createWinner({
        wins: 1,
        id: carId,
        time: timeSeconds,
      });
    }
  }
}
