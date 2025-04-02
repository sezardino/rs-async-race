import { Component } from '../components/abstract';
import { CarFormSection } from '../components/modules/garage/car-form-section';
import { CarsSection } from '../components/modules/garage/cars-section';
import { LS_GARAGE_LAST_PAGE } from '../const/local-storage';
import { PAGINATION_DEFAULT_PAGE } from '../const/pagination';
import { useGarageQuery } from '../reactivity/queries/garage';
import { Signal } from '../reactivity/signal';
import { LocalStorageService } from '../services/local-storage';
import type { PageConfig } from './abstract';
import { Page } from './abstract';

export class GaragePage extends Page {
  private page = new Signal(() => {
    const page = LocalStorageService.get(LS_GARAGE_LAST_PAGE);

    return Number.isNaN(Number(page)) ? PAGINATION_DEFAULT_PAGE : Number(page);
  }, [(value): void => LocalStorageService.set(LS_GARAGE_LAST_PAGE, value)]);

  private title = new Component({
    tag: 'h1',
    textContent: this.getTitleCopy(),
    classNames: ['mt-10 text-2xl font-bold'],
  });

  private carFormSection = new CarFormSection({
    submitCopy: 'Create Car',
    onFormSubmit: console.log,
  });

  private carsSection = new CarsSection({
    onPrevPageClick: (): void => this.page.set(this.page.get() - 1),
    onNextPageClick: (): void => this.page.set(this.page.get() + 1),
  });

  private garageQuery = useGarageQuery({
    defaultArgs: { page: this.page.get() },
    onSuccess: (response): void => {
      this.carsSection.render(response);
      this.title.setText(this.getTitleCopy(response.meta.totalCount));
    },
  });

  constructor(config: PageConfig) {
    super(config);

    this.page.subscribe((page) => this.garageQuery.refetch({ page }));
  }

  public render(): void {
    this.root.addClasses('py-10');

    this.root.append(this.carFormSection, this.title, this.carsSection);
  }

  private getTitleCopy(totalCount?: number): string {
    return `Garage ${totalCount ? `(${totalCount})` : ''}`;
  }
}
