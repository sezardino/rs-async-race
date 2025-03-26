import type { AxiosResponse } from 'axios';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
} from '../../const/pagination';
import { axiosInstance } from '../../libs/axios';
import type { CarEntity } from '../../types/entity';
import type { PaginationResponse } from '../../types/pagination';
import { generatePaginationResponse } from '../../utils/generate-pagination-response';
import type {
  CarResponse,
  CarsRequest,
  CarsResponse,
  CreateCarRequest,
  CreateCarResponse,
  UpdateCarRequest,
  UpdateCarResponse,
} from './types';

export class GarageApiService {
  public static cars(dto: CarsRequest): Promise<PaginationResponse<CarEntity>> {
    const { limit = PAGINATION_DEFAULT_LIMIT, page = PAGINATION_DEFAULT_PAGE } =
      dto;

    return axiosInstance
      .get<CarsResponse>('/garage', {
        params: { _page: page, _limit: limit },
      })
      .then((response) =>
        generatePaginationResponse({ response, page, limit })
      );
  }

  public static car(id: string): Promise<AxiosResponse<CarResponse>> {
    return axiosInstance.get<CarResponse>(`/garage/${id}`);
  }

  public static createCar(
    dto: CreateCarRequest
  ): Promise<AxiosResponse<CreateCarResponse>> {
    return axiosInstance.post<CreateCarResponse>('/garage', dto);
  }

  public static updateCar({
    carId,
    ...dto
  }: UpdateCarRequest): Promise<AxiosResponse<UpdateCarResponse>> {
    return axiosInstance.put<UpdateCarResponse>(`/garage/${carId}`, dto);
  }

  public static deleteCar(carId: number): Promise<AxiosResponse<void>> {
    return axiosInstance.delete<void>(`/garage/${carId}`);
  }
}
