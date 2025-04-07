import { Component } from '../../components/abstract';
import { div, header } from '../../components/base';
import type { CarFormDialogConfig } from '../../components/modules/garage/car-form-dialog';
import { CarFormDialog } from '../../components/modules/garage/car-form-dialog';
import { CarsSection } from '../../components/modules/garage/cars-section';
import { AlertDialog } from '../../components/ui/alert-dialog';
import { Button } from '../../components/ui/button';
import type { ConfirmDialogProps } from '../../components/ui/confirm-dialog';
import { ConfirmDialog } from '../../components/ui/confirm-dialog';

type GaragePageUIConfig = {
  pageRoot: Component;
  onCarFormSubmit: CarFormDialogConfig['onFormSubmit'];
  onDeleteCarConfirm: ConfirmDialogProps['onConfirm'];
  onCloseCarFormDialog: CarFormDialogConfig['onClose'];
  onCarsPageChange: (type: 'next' | 'prev') => void;
  onRaceButtonClick: (type: 'start' | 'reset') => void;
  onGenerateCarsClick: () => void;
};

export class GaragePageUI {
  public pageRoot: Component;

  public deleteCarDialog: ConfirmDialog;
  public carFormDialog: CarFormDialog;
  public raceButton: Button;
  public resetRaceButton: Button;
  public generateCarsButton: Button;
  public carsSection: CarsSection;

  public addCarButton = new Button({
    textContent: '+ Add car',
    size: 'xs',
    onClick: (): void => this.carFormDialog.openDialog(),
  });

  public title = new Component({
    tag: 'h1',
    textContent: this.getTitleCopy(),
    classNames: ['text-2xl font-bold'],
  });

  public finishedRaceDialog = new AlertDialog({
    confirmText: 'Close',
    description: '',
    title: '',
  });

  constructor(config: GaragePageUIConfig) {
    const {
      onCarFormSubmit,
      onDeleteCarConfirm,
      onCloseCarFormDialog,
      onCarsPageChange,
      onGenerateCarsClick,
      onRaceButtonClick,
      pageRoot,
    } = config;

    this.pageRoot = pageRoot;

    this.deleteCarDialog = new ConfirmDialog({
      cancelText: 'Cancel',
      confirmText: 'Delete',
      confirmColor: 'red',
      title: 'Are you sure?',
      description: 'This action cant be undone',
      onConfirm: onDeleteCarConfirm,
    });

    this.carFormDialog = new CarFormDialog({
      submitCopy: 'Create Car',
      onFormSubmit: onCarFormSubmit,
      onClose: onCloseCarFormDialog,
    });

    this.carsSection = new CarsSection({
      onPrevPageClick: (): void => onCarsPageChange('prev'),
      onNextPageClick: (): void => onCarsPageChange('next'),
      classNames: ['mt-10'],
    });

    this.generateCarsButton = new Button({
      textContent: 'Generate cars',
      size: 'xs',
      onClick: onGenerateCarsClick,
    });

    this.raceButton = new Button({
      textContent: 'Race',
      color: 'alt',
      size: 'xs',
      onClick: (): void => onRaceButtonClick('start'),
    });

    this.resetRaceButton = new Button({
      textContent: 'Reset race',
      color: 'alt',
      size: 'xs',
      onClick: (): void => onRaceButtonClick('reset'),
      disabled: true,
    });

    this.renderUI();
  }

  public updateTitle(totalCount: number): void {
    this.title.setText(this.getTitleCopy(totalCount));
  }

  public setManageButtonDisabled(value: boolean): void {
    const buttons = [this.addCarButton, this.generateCarsButton];

    buttons.forEach((button) => button.setDisabled(value));
  }

  private renderUI(): void {
    this.pageRoot.addClasses('py-10');

    const headerWrapper = header({ classNames: ['flex flex-col gap-2'] });
    const buttonsWrapper = div({ classNames: ['flex items-center gap-2'] });

    const firstLine = div({
      classNames: ['flex items-center flex-wrap justify-between'],
    });
    const secondLine = div({
      classNames: ['flex items-center gap-2'],
    });

    buttonsWrapper.append(this.generateCarsButton, this.addCarButton);

    firstLine.append(this.title, buttonsWrapper);
    secondLine.append(this.raceButton, this.resetRaceButton);

    headerWrapper.append(firstLine, secondLine);

    this.pageRoot.append(headerWrapper, this.carsSection);
  }

  private getTitleCopy(totalCount?: number): string {
    return `Garage ${totalCount ? `(${totalCount})` : ''}`;
  }
}
