import { PAGINATION_DEFAULT_PAGE } from '../../../const/pagination';
import type { CarEntity } from '../../../types/entity';
import type { PaginationResponse } from '../../../types/pagination';
import type { ComponentConfig } from '../../abstract';
import { Component } from '../../abstract';
import { div, h2, header, ul } from '../../base';
import { Button } from '../../ui/button';

import { CarItem } from './car-item';

export type CarsSectionConfig = Omit<ComponentConfig, 'tag' | 'textContent'> & {
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
  onSelectCarToDelete: (carId: number) => void;
  onSelectCarToEdit: (carId: number) => void;
  onSelectCarToStartEngine: (carId: number) => void;
  onSelectCarToStopEngine: (carId: number) => void;
};

export class CarsSection extends Component {
  public cars: { id: number; element: Component }[] = [];

  private onNextPageClick: () => void;
  private onPrevPageClick: () => void;
  private onSelectCarToDelete: (carId: number) => void;
  private onSelectCarToEdit: (carId: number) => void;
  private onSelectCarToStartEngine: (carId: number) => void;
  private onSelectCarToStopEngine: (carId: number) => void;

  constructor(config: CarsSectionConfig) {
    const {
      onSelectCarToDelete,
      onSelectCarToEdit,
      onNextPageClick,
      onPrevPageClick,
      onSelectCarToStartEngine,
      onSelectCarToStopEngine,
      classNames = [],
      ...rest
    } = config;
    super({
      ...rest,
      tag: 'section',
      classNames: [...classNames, 'flex flex-col gap-8'],
    });

    this.onNextPageClick = onNextPageClick;
    this.onPrevPageClick = onPrevPageClick;
    this.onSelectCarToDelete = onSelectCarToDelete;
    this.onSelectCarToEdit = onSelectCarToEdit;
    this.onSelectCarToStartEngine = onSelectCarToStartEngine;
    this.onSelectCarToStopEngine = onSelectCarToStopEngine;
  }

  public render(response: PaginationResponse<CarEntity>): void {
    this.cleanSection();

    const list = this.getList(response.data);
    const header = this.getHeader(response.meta.page);

    const footerPagination = this.getPagination(
      response.meta.page,
      response.meta.totalPages
    );

    this.append(header, list, footerPagination);
  }

  private cleanSection(): void {
    this.clean();
    this.cars.forEach((car) => car.element.clean());
  }

  private getHeader(pageNumber: number): Component {
    const wrapper = header({ classNames: ['flex flex-col gap-2'] });

    const title = h2({
      textContent: `Page: ${pageNumber}`,
      classNames: ['text-xl font-medium'],
    });

    wrapper.append(title);

    return wrapper;
  }

  private getList(cars: CarEntity[]): Component {
    const list = ul({ classNames: ['flex flex-col gap-10'] });

    cars.forEach((car) => {
      const item = new CarItem({
        car,
        onCarDeleteClick: (): void => this.onSelectCarToDelete(car.id),
        onCarEditClick: (): void => this.onSelectCarToEdit(car.id),
        onStartEngineClick: (): void => this.onSelectCarToStartEngine(car.id),
        onStopEngineClick: (): void => this.onSelectCarToStopEngine(car.id),
      });

      this.cars.push({ id: car.id, element: item });
      list.append(item);
    });

    return list;
  }

  private getPagination(currentPage: number, totalPages: number): Component {
    const wrapper = div({
      classNames: ['flex items-center gap-4 flex-wrap'],
    });

    const previous = new Button({
      textContent: `Prev`,
      color: 'alt',
      size: 'sm',
      attributes: {
        disabled: currentPage === PAGINATION_DEFAULT_PAGE ? 'true' : '',
      },
    });

    const next = new Button({
      textContent: 'Next',
      color: 'alt',
      size: 'sm',
      attributes: {
        disabled: currentPage === totalPages ? 'true' : '',
      },
    });

    next.on('click', () => this.onNextPageClick());
    previous.on('click', () => this.onPrevPageClick());

    wrapper.append(previous, next);

    return wrapper;
  }
}
