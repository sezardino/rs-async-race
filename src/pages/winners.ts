import { WinnersApiService } from '../bll/winners';
import { Component } from '../components/abstract';
import { WinnersSection } from '../components/modules/winners/winners-section';
import { LS_WINNERS_LAST_PAGE } from '../const/local-storage';
import { PAGINATION_DEFAULT_PAGE } from '../const/pagination';
import { Query } from '../reactivity/query';
import { Signal } from '../reactivity/signal';
import { LocalStorageService } from '../services/local-storage';
import type { WinnerWithCar } from '../types/entity';
import type { PaginationResponse } from '../types/pagination';
import type { PageConfig } from './abstract';
import { Page } from './abstract';

export class WinnersPage extends Page {
  private page = new Signal(() => {
    const page = LocalStorageService.get(LS_WINNERS_LAST_PAGE);

    return Number.isNaN(Number(page)) ? PAGINATION_DEFAULT_PAGE : Number(page);
  }, [(value): void => LocalStorageService.set(LS_WINNERS_LAST_PAGE, value)]);

  private title = new Component({
    tag: 'h1',
    textContent: this.getTitleCopy(),
    classNames: ['text-2xl font-bold'],
  });

  private winnersSection = new WinnersSection({
    onPrevPageClick: (): void => this.page.set(this.page.get() - 1),
    onNextPageClick: (): void => this.page.set(this.page.get() + 1),
  });

  private winnersQuery = new Query({
    callback: (arguments_): Promise<PaginationResponse<WinnerWithCar>> =>
      WinnersApiService.winners(arguments_),
    defaultArgs: { page: this.page.get() },
    onSuccess: (response): void => {
      this.winnersSection.render(response);
      this.title.setText(this.getTitleCopy(response.meta.totalCount));
    },
  });

  constructor(config: PageConfig) {
    super(config);

    this.page.subscribe((page) => this.winnersQuery.refetch({ page }));
  }

  public render(): void {
    this.root.addClasses('py-10');

    this.root.append(this.title, this.winnersSection);
  }

  private getTitleCopy(totalCount?: number): string {
    return `Winners ${totalCount ? `(${totalCount})` : ''}`;
  }
}
