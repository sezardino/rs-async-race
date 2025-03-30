import type { SORT_ORDER } from '../const/sort-order';

export type SortOrder = (typeof SORT_ORDER)[number];

export const isSortOrder = (value: unknown): value is SortOrder => {
  return value === 'ASC' || value === 'DESC' || value === null;
};
