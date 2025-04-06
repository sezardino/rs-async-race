import { Component } from '../components/abstract';
import { div, header } from '../components/base';
import { CarFormDialog } from '../components/modules/garage/car-form-dialog';
import { CarItem } from '../components/modules/garage/car-item';
import { CarsSection } from '../components/modules/garage/cars-section';
import { Button } from '../components/ui/button';
import { ConfirmDialog } from '../components/ui/confirm-dialog';
import { LS_GARAGE_LAST_PAGE } from '../const/local-storage';
import { PAGINATION_DEFAULT_PAGE } from '../const/pagination';
import { useCarDriveMutation } from '../reactivity/mutations/car-drive';
import { useCreateCarMutation } from '../reactivity/mutations/create-car';
import { useDeleteCarMutation } from '../reactivity/mutations/delete-car';
import { useGenerateCarsMutation } from '../reactivity/mutations/generate-cars';
import { useStartEngineMutation } from '../reactivity/mutations/start-engine';
import { useStopEngineMutation } from '../reactivity/mutations/stop-engine';
import { useUpdateCarMutation } from '../reactivity/mutations/update-car';
import { useGarageQuery } from '../reactivity/queries/garage';
import { Signal } from '../reactivity/signal';
import { LocalStorageService } from '../services/local-storage';
import type { CarEntity } from '../types/entity';
import type { PageConfig } from './abstract';
import { Page } from './abstract';

export class GaragePage extends Page {
  private currentPageCarItems: CarItem[] = [];

  private page = new Signal(() => {
    const page = LocalStorageService.get(LS_GARAGE_LAST_PAGE);

    return Number.isNaN(Number(page)) ? PAGINATION_DEFAULT_PAGE : Number(page);
  }, [(value): void => LocalStorageService.set(LS_GARAGE_LAST_PAGE, value)]);

  private garageQuery = useGarageQuery({
    defaultArgs: { page: this.page.get() },
    onSuccess: (response): void => {
      const pageItems = this.generateCarItems(response.data);

      this.carsSection.update({
        currentPage: response.meta.page,
        totalPages: response.meta.totalPages,
        items: pageItems,
      });

      this.currentPageCarItems = pageItems;

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
  private startEngine = useStartEngineMutation({
    onMutate: ({ carId }) => {
      const neededCar = this.currentPageCarItems.find(
        (item) => item.car.id === carId
      );
      if (!neededCar) return;

      neededCar.setEngineButtonDisabled('start', true);
      neededCar.setEngineButtonDisabled('start', true);
    },
    onSettled: ({ carId }) => {
      const neededCar = this.currentPageCarItems.find(
        (item) => item.car.id === carId
      );
      if (!neededCar) return;

      neededCar.setEngineButtonDisabled('start', true);
      neededCar.setEngineButtonDisabled('stop', false);
    },
    onSuccess: (data, { carId }): void => {
      const neededCar = this.currentPageCarItems.find(
        (item) => item.car.id === carId
      );
      if (!neededCar) return;

      neededCar.driveToEnd(data.distance / data.velocity);
      void this.drive.mutate({ carId });
    },
  });
  private stopEngine = useStopEngineMutation({
    onSuccess: (_, { carId }) => {
      const neededCar = this.currentPageCarItems.find(
        (item) => item.car.id === carId
      );
      if (!neededCar) return;

      neededCar.resetRace();
      neededCar.setEngineButtonDisabled('start', false);
      neededCar.setEngineButtonDisabled('stop', true);
    },
  });
  private drive = useCarDriveMutation({
    onError: (_, { carId }) => {
      const neededCar = this.currentPageCarItems.find(
        (item) => item.car.id === carId
      );
      if (!neededCar) return;

      neededCar.breakDown();
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

  private generateCarItems(cars: CarEntity[]): CarItem[] {
    const items: CarItem[] = [];

    cars.forEach((car) => {
      const item = new CarItem({
        car,
        onCarDeleteClick: (): void => this.carToDelete.set(car.id),
        onCarEditClick: (): void => this.carToEdit.set(car.id),
        onStartEngineClick: (): void =>
          void this.startEngine.mutate({ carId: car.id }),
        onStopEngineClick: (): void =>
          void this.stopEngine.mutate({ carId: car.id }),
      });

      items.push(item);
    });

    return items;
  }
}
