import type { WinnerEntity } from '../../types/entity';
import type { PaginationRequest } from '../../types/pagination';
import type { SortOrder } from '../../types/parameters';

export type WinnersRequest = PaginationRequest & {
  sort?: 'id' | 'wins' | 'time';
  order?: SortOrder;
};

export type WinnersResponse = WinnerEntity[];

export type WinnerResponse = WinnerEntity;

export type CreateWinnerRequest = Pick<WinnerEntity, 'id' | 'time' | 'wins'>;

export type CreateWinnerResponse = WinnerEntity;

export type EditWinnerRequest = Partial<Omit<CreateWinnerRequest, 'id'>> & {
  winnerId: string;
};

export type EditWinnerResponse = WinnerEntity;
