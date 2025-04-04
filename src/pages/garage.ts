import { Component } from '../components/abstract';
import { div, header } from '../components/base';
import { CarFormDialog } from '../components/modules/garage/car-form-dialog';
import { CarsSection } from '../components/modules/garage/cars-section';
import { Button } from '../components/ui/button';
import { ConfirmDialog } from '../components/ui/confirm-dialog';
import { LS_GARAGE_LAST_PAGE } from '../const/local-storage';
import { PAGINATION_DEFAULT_PAGE } from '../const/pagination';
import { useCreateCarMutation } from '../reactivity/mutations/create-car';
import { useDeleteCarMutation } from '../reactivity/mutations/delete-car';
import { useGenerateCarsMutation } from '../reactivity/mutations/generate-cars';
import { useUpdateCarMutation } from '../reactivity/mutations/update-car';
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
  private updateCarMutation = useUpdateCarMutation({
    onSuccess: () => this.garageQuery.refetch(),
  });
  private generateCars = useGenerateCarsMutation({
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

  private carToEdit = new Signal<number | null>(null, [
    (carId): void => {
      const neededCar = this.garageQuery.data
        .get()
        ?.data.find((car) => car.id === carId);

      if (!neededCar) return;

      this.carFormDialog.openDialog({
        color: neededCar.color,
        name: neededCar.name,
      });
    },
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
    onFormSubmit: async (values): Promise<void> => {
      const carToEdit = this.carToEdit.get();

      if (!carToEdit) await this.createCarMutation.mutate(values);
      else {
        await this.updateCarMutation.mutate({ ...values, carId: carToEdit });
        this.carToEdit.set(null);
      }
    },
    onClose: (): void => this.carToEdit.set(null),
  });

  private carsSection = new CarsSection({
    onSelectCarToEdit: (carId): void => this.carToEdit.set(carId),
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

    const buttonsWrapper = div({ classNames: ['flex items-center gap-2'] });

    const generateCarsButton = new Button({
      textContent: 'Generate cars',
      size: 'xs',
      onClick: (): void => void this.generateCars.mutate({}),
    });

    const addCarButton = new Button({
      textContent: '+ Add car',
      size: 'xs',
      onClick: (): void => this.carFormDialog.openDialog(),
    });

    const headerWrapper = header({
      classNames: ['flex items-center flex-wrap justify-between'],
    });

    buttonsWrapper.append(generateCarsButton, addCarButton);

    headerWrapper.append(this.title, buttonsWrapper);

    this.root.append(headerWrapper, this.carsSection);
  }

  private getTitleCopy(totalCount?: number): string {
    return `Garage ${totalCount ? `(${totalCount})` : ''}`;
  }
}
