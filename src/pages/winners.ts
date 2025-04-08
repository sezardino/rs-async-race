import type { WinnersRequestSort } from '../bll/winners/types';
import { isWinnersSortableFields } from '../bll/winners/types';
import { Component } from '../components/abstract';
import { WinnersSection } from '../components/modules/winners/winners-section';
import {
  LS_WINNERS_LAST_PAGE,
  LS_WINNERS_LAST_SORT,
} from '../const/local-storage';
import { PAGINATION_DEFAULT_PAGE } from '../const/pagination';
import { useWinnersQuery } from '../reactivity/queries/winners';
import { Signal } from '../reactivity/signal';
import { LocalStorageService } from '../services/local-storage';
import { isSortOrder } from '../types/parameters';
import type { PageConfig } from './abstract';
import { Page } from './abstract';

export class WinnersPage extends Page {
  private tableSort = new Signal<WinnersRequestSort | null>(
    () => this.getInitialSort(),
    [(sort): void => this.saveSort(sort)]
  );
  private page = new Signal(
    () => this.getInitialPage(),
    [(page): void => this.savePage(page)]
  );

  private title = new Component({
    tag: 'h1',
    textContent: this.getTitleCopy(),
    classNames: ['text-2xl font-bold'],
  });

  private winnersSection = new WinnersSection({
    onPrevPageClick: (): void => this.page.set(this.page.get() - 1),
    onNextPageClick: (): void => this.page.set(this.page.get() + 1),
    onSortChange: (sort): void => {
      if (sort === null) return this.tableSort.set(null);
      if (!isWinnersSortableFields(sort.field)) return;

      this.tableSort.set(sort);
    },
    initialSort: this.getInitialSort() || undefined,
  });

  private winnersQuery = useWinnersQuery({
    defaultArgs: { page: this.page.get(), sort: this.tableSort.get() },
    onSuccess: (response): void => {
      console.log(response);
      this.winnersSection.update(response);
      this.title.setText(this.getTitleCopy(response.meta.totalCount));
    },
  });

  constructor(config: PageConfig) {
    super(config);

    this.page.subscribe((page) =>
      this.winnersQuery.refetch({ page, sort: this.tableSort.get() })
    );
    this.tableSort.subscribe((sort) =>
      this.winnersQuery.refetch({ page: this.page.get(), sort })
    );
    console.log(this.getInitialSort());
  }

  public render(): void {
    this.root.addClasses('py-10');

    this.root.append(this.title, this.winnersSection);
  }

  private getTitleCopy(totalCount?: number): string {
    return `Winners ${totalCount ? `(${totalCount})` : ''}`;
  }

  private getInitialSort(): WinnersRequestSort | null {
    const lastSort = LocalStorageService.get(LS_WINNERS_LAST_SORT);

    if (typeof lastSort !== 'object') return null;
    if (lastSort === null) return null;
    if (!('field' in lastSort) || !('order' in lastSort)) return null;

    const order = isSortOrder(lastSort.order) ? lastSort.order : undefined;
    const field = isWinnersSortableFields(lastSort.field)
      ? lastSort.field
      : undefined;

    if (typeof field === 'undefined' || typeof order === 'undefined')
      return null;

    return { order, field };
  }

  private getInitialPage(): number {
    const page = LocalStorageService.get(LS_WINNERS_LAST_PAGE);

    return Number.isNaN(Number(page)) ? PAGINATION_DEFAULT_PAGE : Number(page);
  }

  private savePage(page: number): void {
    LocalStorageService.set(LS_WINNERS_LAST_PAGE, page);
  }

  private saveSort(sort: WinnersRequestSort | null): void {
    LocalStorageService.set(LS_WINNERS_LAST_SORT, sort);
  }
}
