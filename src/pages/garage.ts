import { Component } from '../components/abstract';
import { header } from '../components/base';
import { CarFormDialog } from '../components/modules/garage/car-form-dialog';
import { CarsSection } from '../components/modules/garage/cars-section';
import { Button } from '../components/ui/button';
import { ConfirmDialog } from '../components/ui/confirm-dialog';
import { LS_GARAGE_LAST_PAGE } from '../const/local-storage';
import { PAGINATION_DEFAULT_PAGE } from '../const/pagination';
import { useCreateCarMutation } from '../reactivity/mutations/create-car';
import { useDeleteCarMutation } from '../reactivity/mutations/delete-car';
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

  private garageQuery = useGarageQuery({
    defaultArgs: { page: this.page.get() },
    onSuccess: (response): void => {
      this.carsSection.render(response);
      this.title.setText(this.getTitleCopy(response.meta.totalCount));
    },
  });

  private createCarMutation = useCreateCarMutation({
    onSuccess: () => this.garageQuery.refetch(),
  });
  private deleteCarMutation = useDeleteCarMutation({
    onSuccess: () => {
      this.garageQuery.refetch();
      this.carToDelete.set(null);
    },
  });

  private carToDelete = new Signal<number | null>(null, [
    (value): void =>
      typeof value === 'number'
        ? this.deleteCarDialog.openDialog()
        : this.deleteCarDialog.closeDialog(),
  ]);

  private deleteCarDialog = new ConfirmDialog({
    cancelText: 'Cancel',
    confirmText: 'Delete',
    confirmColor: 'red',
    title: 'Are you sure?',
    description: 'This action cant be undone',
    onConfirm: async (): Promise<void> => {
      const carId = this.carToDelete.get();

      if (!carId) return this.deleteCarDialog.closeDialog();

      await this.deleteCarMutation.mutate({ carId });
    },
  });

  private title = new Component({
    tag: 'h1',
    textContent: this.getTitleCopy(),
    classNames: ['text-2xl font-bold'],
  });

  private carFormDialog = new CarFormDialog({
    submitCopy: 'Create Car',
    onFormSubmit: (values): Promise<void> =>
      this.createCarMutation.mutate(values),
  });

  private carsSection = new CarsSection({
    onSelectCarToDelete: (carId): void => this.carToDelete.set(carId),
    onPrevPageClick: (): void => this.page.set(this.page.get() - 1),
    onNextPageClick: (): void => this.page.set(this.page.get() + 1),
  });

  constructor(config: PageConfig) {
    super(config);

    this.page.subscribe((page) => this.garageQuery.refetch({ page }));
  }

  public render(): void {
    this.root.addClasses('py-10');

    const addCarButton = new Button({
      textContent: '+ Add car',
      size: 'xs',
      onClick: (): void => this.carFormDialog.openDialog(),
    });

    const headerWrapper = header({
      classNames: ['flex items-center flex-wrap justify-between'],
    });

    headerWrapper.append(this.title, addCarButton);

    this.root.append(headerWrapper, this.carsSection);
  }

  private getTitleCopy(totalCount?: number): string {
    return `Garage ${totalCount ? `(${totalCount})` : ''}`;
  }
}
