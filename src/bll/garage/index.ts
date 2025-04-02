import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
} from '../../const/pagination';
import type { CarEntity } from '../../types/entity';
import type { PaginationResponse } from '../../types/pagination';
import { generatePaginationResponse } from '../../utils/generate-pagination-response';
import type { FetchResponse } from '../../utils/request';
import { fetchInstance } from '../../utils/request';
import type {
  CarResponse,
  CarsRequest,
  CarsResponse,
  CreateCarRequest,
  UpdateCarRequest,
  UpdateCarResponse,
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

  public static car(id: number): Promise<FetchResponse<CarResponse>> {
    return fetchInstance.get<CarResponse>(`/garage/${id}`);
  }

  public static createCar(dto: CreateCarRequest): Promise<FetchResponse<void>> {
    return fetchInstance.post<void>('/garage', { body: dto });
  }

  public static updateCar({
    carId,
    ...dto
  }: UpdateCarRequest): Promise<FetchResponse<UpdateCarResponse>> {
    return fetchInstance.put<UpdateCarResponse>(`/garage/${carId}`, {
      body: dto,
    });
  }

  public static deleteCar(carId: number): Promise<FetchResponse<void>> {
    return fetchInstance.delete<void>(`/garage/${carId}`);
  }
}
