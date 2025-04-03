import type { WinnerEntity } from '../../types/entity';
import type { PaginationRequest } from '../../types/pagination';
import type { SortOrder } from '../../types/parameters';
import type { WINNERS_SORT_FIELDS } from './const';

export type WinnersSortableFields = (typeof WINNERS_SORT_FIELDS)[number];

export const isWinnersSortableFields = (
  value: unknown
): value is WinnersSortableFields => {
  return value === 'id' || value === 'wins' || value === 'time';
};

export type WinnersRequestSort = {
  field: WinnersSortableFields;
  order: SortOrder;
};

export type WinnersRequest = PaginationRequest & {
  sort: WinnersRequestSort | null;
};

export type WinnersResponse = WinnerEntity[];

export type WinnerResponse = WinnerEntity;

export type CreateWinnerRequest = Pick<WinnerEntity, 'id' | 'time' | 'wins'>;

export type CreateWinnerResponse = WinnerEntity;

export type EditWinnerRequest = Partial<Omit<CreateWinnerRequest, 'id'>> & {
  winnerId: number;
};

export type DeleteWinnerRequest = {
  winnerId: number;
};

export type EditWinnerResponse = WinnerEntity;
