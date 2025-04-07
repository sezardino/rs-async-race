import { CarItem } from '../../components/modules/garage/car-item';
import { LS_GARAGE_LAST_PAGE } from '../../const/local-storage';
import { PAGINATION_DEFAULT_PAGE } from '../../const/pagination';
import { useCarDriveMutation } from '../../reactivity/mutations/car-drive';
import { useCreateCarMutation } from '../../reactivity/mutations/create-car';
import { useDeleteCarMutation } from '../../reactivity/mutations/delete-car';
import { useGenerateCarsMutation } from '../../reactivity/mutations/generate-cars';
import { useStartEngineMutation } from '../../reactivity/mutations/start-engine';
import { useStopEngineMutation } from '../../reactivity/mutations/stop-engine';
import { useUpdateCarMutation } from '../../reactivity/mutations/update-car';
import { useGarageQuery } from '../../reactivity/queries/garage';
import { Signal } from '../../reactivity/signal';
import { LocalStorageService } from '../../services/local-storage';
import type { CarEntity } from '../../types/entity';
import type { PageConfig } from '../abstract';
import { Page } from '../abstract';
import { GaragePageUI } from './garage.ui';

export class GaragePage extends Page {
  private UI: GaragePageUI;
  private currentPageCarItems: CarItem[] = [];

  private isRaceStarted = new Signal(false, [
    (value): void => {
      if (!value) return this.resetRace();

      this.startRace();
    },
  ]);

  private page = new Signal(() => {
    const page = LocalStorageService.get(LS_GARAGE_LAST_PAGE);

    return Number.isNaN(Number(page)) ? PAGINATION_DEFAULT_PAGE : Number(page);
  }, [(value): void => LocalStorageService.set(LS_GARAGE_LAST_PAGE, value)]);
  private garageQuery = useGarageQuery({
    defaultArgs: { page: this.page.get() },
    onLoading: () => this.UI?.carsSection.showLoadingState(),
    onSuccess: (response): void => {
      const pageItems = this.generateCarItems(response.data);

      this.UI.carsSection.update({
        currentPage: response.meta.page,
        totalPages: response.meta.totalPages,
        items: pageItems,
      });

      this.currentPageCarItems = pageItems;

      this.UI.updateTitle(response.meta.totalCount);
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
      const neededCar = this.findCarById(carId);
      if (!neededCar) return;

      neededCar.setEngineButtonDisabled('all', true);
    },
    onSettled: ({ carId }) => {
      const neededCar = this.findCarById(carId);
      if (!neededCar) return;

      if (this.isRaceStarted.get()) return;

      neededCar.setEngineButtonDisabled('start', true);
      neededCar.setEngineButtonDisabled('stop', false);
    },
    onSuccess: (data, { carId }): void => {
      const neededCar = this.findCarById(carId);
      if (!neededCar) return;

      neededCar.driveToEnd(data.distance / data.velocity);
      void this.drive.mutate({ carId });
    },
  });
  private stopEngine = useStopEngineMutation({
    onSuccess: (_, { carId }) => {
      const neededCar = this.findCarById(carId);
      if (!neededCar) return;

      neededCar.resetRace();
      neededCar.setEngineButtonDisabled('start', false);
      neededCar.setEngineButtonDisabled('stop', true);
    },
  });
  private drive = useCarDriveMutation({
    onError: (_, { carId }) => {
      const neededCar = this.findCarById(carId);
      if (!neededCar) return;

      neededCar.breakDown();
    },
  });
  private carToDelete = new Signal<number | null>(null, [
    (value): void =>
      typeof value === 'number'
        ? this.UI.deleteCarDialog.openDialog()
        : this.UI.deleteCarDialog.closeDialog(),
  ]);
  private carToEdit = new Signal<number | null>(null, [
    (carId): void => {
      const neededCar = this.garageQuery.data
        .get()
        ?.data.find((car) => car.id === carId);

      if (!neededCar) return;

      this.UI.carFormDialog.openDialog({
        color: neededCar.color,
        name: neededCar.name,
      });
    },
  ]);

  constructor(config: PageConfig) {
    super(config);

    this.page.subscribe((page) => this.garageQuery.refetch({ page }));

    this.UI = new GaragePageUI({
      pageRoot: this.root,
      onCarFormSubmit: async (values): Promise<void> => {
        const carToEdit = this.carToEdit.get();

        if (!carToEdit) await this.createCarMutation.mutate(values);
        else {
          await this.updateCarMutation.mutate({ ...values, carId: carToEdit });
          this.carToEdit.set(null);
        }
      },
      onCloseCarFormDialog: (): void => this.carToEdit.set(null),
      onCarsPageChange: (type): void => {
        if (type === 'next') this.page.set(this.page.get() + 1);
        else this.page.set(this.page.get() - 1);
      },
      onDeleteCarConfirm: async (): Promise<void> => {
        const carId = this.carToDelete.get();

        if (!carId) return this.UI.deleteCarDialog.closeDialog();

        await this.deleteCarMutation.mutate({ carId });
      },
      onGenerateCarsClick: (): void => void this.generateCars.mutate({}),
      onRaceButtonClick: (type): void => {
        if (type === 'start') void this.isRaceStarted.set(true);
        else void this.isRaceStarted.set(false);
      },
    });
  }

  public render(): void {}

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

  private startRace(): void {
    this.currentPageCarItems.forEach((carItem) => {
      void this.startEngine.mutate({ carId: carItem.car.id });
      carItem.setEngineButtonDisabled('all', true);
      carItem.setManageButtonDisabled(true);
    });

    this.UI.raceButton.setDisabled(true);
    this.UI.resetRaceButton.setDisabled(false);
    this.UI.setManageButtonDisabled(true);
    this.UI.carsSection.setPaginationButtonsDisabled(true);
  }

  private resetRace(): void {
    this.currentPageCarItems.forEach((carItem) => {
      void this.stopEngine.mutate({ carId: carItem.car.id });
      carItem.setEngineButtonDisabled('all', true);
      carItem.setManageButtonDisabled(false);
    });

    this.UI.setManageButtonDisabled(false);
    this.UI.raceButton.setDisabled(false);
    this.UI.resetRaceButton.setDisabled(true);
    this.UI.carsSection.setPaginationButtonsDisabled(false);
  }

  private findCarById(carId: number): CarItem | undefined {
    return this.currentPageCarItems.find((item) => item.car.id === carId);
  }
}
