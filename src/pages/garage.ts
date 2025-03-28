import { GarageApiService } from '../bll/garage';
import { Component } from '../components/abstract';
import { CarsSection } from '../components/modules/garage/cars-section';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
} from '../const/pagination';
import { Query } from '../reactivity/query';
import { Signal } from '../reactivity/signal';
import type { CarEntity } from '../types/entity';
import type { PaginationResponse } from '../types/pagination';
import type { PageConfig } from './abstract';
import { Page } from './abstract';

export class GaragePage extends Page {
  private page = new Signal(PAGINATION_DEFAULT_PAGE);
  private limit = new Signal(PAGINATION_DEFAULT_LIMIT);
  private carsSection = new CarsSection({
    onPrevPageClick: (): void => this.page.set(this.page.get() - 1),
    onNextPageClick: (): void => this.page.set(this.page.get() + 1),
  });
  private title = new Component({
    tag: 'h1',
    textContent: this.getTitleCopy(),
    classNames: ['text-2xl font-bold'],
  });

  private garageQuery = new Query({
    callback: (arguments_): Promise<PaginationResponse<CarEntity>> =>
      GarageApiService.cars(arguments_),
    defaultArgs: { page: this.page.get(), limit: this.limit.get() },
    onSuccess: (response): void => {
      this.carsSection.render(response);
      this.title.setText(this.getTitleCopy(response.meta.totalCount));
    },
  });

  constructor(config: PageConfig) {
    super(config);

    this.page.subscribe((page) =>
      this.garageQuery.refetch({ page, limit: this.limit.get() })
    );
    this.limit.subscribe((limit) =>
      this.garageQuery.refetch({ page: this.page.get(), limit })
    );
  }

  public render(): void {
    this.root.addClasses('py-10');

    this.root.append(this.title, this.carsSection);
  }

  private getTitleCopy(totalCount?: number): string {
    return `Garage ${totalCount ? `(${totalCount})` : ''}`;
  }
}
