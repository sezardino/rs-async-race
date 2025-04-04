import type { CarEntity } from '../../types/entity';
import type { PaginationRequest } from '../../types/pagination';

export type CarsRequest = PaginationRequest;

export type CarsResponse = CarEntity[];

export type CarDetailsRequest = {
  carId: number;
};

export type CarDetailsResponse = CarEntity;

export type CreateCarRequest = Pick<CarEntity, 'name' | 'color'>;

export type CreateCarResponse = CarEntity;

export type UpdateCarRequest = Partial<CreateCarRequest> & {
  carId: number;
};

export type DeleteCarRequest = {
  carId: number;
};
