import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
} from '../../const/pagination';
import type { CarEntity } from '../../types/entity';
import type { PaginationResponse } from '../../types/pagination';
import { generateCars } from '../../utils/generate-cars';
import { generatePaginationResponse } from '../../utils/generate-pagination-response';
import type { FetchResponse } from '../../utils/request';
import { fetchInstance } from '../../utils/request';
import { WinnersApiService } from '../winners';
import type {
  CarDetailsRequest,
  CarDetailsResponse,
  CarsRequest,
  CarsResponse,
  CreateCarRequest,
  DeleteCarRequest,
  UpdateCarRequest,
} from './types';

export class GarageApiService {
  public static cars(dto: CarsRequest): Promise<PaginationResponse<CarEntity>> {
    const { limit = PAGINATION_DEFAULT_LIMIT, page = PAGINATION_DEFAULT_PAGE } =
      dto;

    return fetchInstance
      .get<CarsResponse>('/garage', {
        params: { _page: page, _limit: limit },
      })
      .then((response) =>
        generatePaginationResponse({ response, page, limit })
      );
  }

  public static car({
    carId,
  }: CarDetailsRequest): Promise<FetchResponse<CarDetailsResponse>> {
    return fetchInstance.get<CarDetailsResponse>(`/garage/${carId}`);
  }

  public static createCar(dto: CreateCarRequest): Promise<FetchResponse<void>> {
    return fetchInstance.post<void>('/garage', { body: dto });
  }

  public static async generateCars(): Promise<void> {
    const generatedCars = generateCars(100);

    await Promise.allSettled(
      generatedCars.map(
        async (car) => await fetchInstance.post<void>('/garage', { body: car })
      )
    );
  }

  public static updateCar({
    carId,
    ...dto
  }: UpdateCarRequest): Promise<FetchResponse<void>> {
    return fetchInstance.put<void>(`/garage/${carId}`, {
      body: dto,
    });
  }

  public static async deleteCar({ carId }: DeleteCarRequest): Promise<void> {
    try {
      await fetchInstance.delete<void>(`/garage/${carId}`);

      void WinnersApiService.deleteWinner({ carId });
    } catch (error) {
      console.log(error);
    }
  }
}
