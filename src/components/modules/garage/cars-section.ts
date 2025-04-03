import { PAGINATION_DEFAULT_PAGE } from '../../../const/pagination';
import type { CarEntity } from '../../../types/entity';
import type { PaginationResponse } from '../../../types/pagination';
import type { ComponentConfig } from '../../abstract';
import { Component } from '../../abstract';
import { div, h2, h3, header, li, ul } from '../../base';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';

import CarIcon from '../../../assets/car.svg?raw';
import FlagIcon from '../../../assets/flag.svg?raw';

export type CarsSectionConfig = Omit<ComponentConfig, 'tag' | 'textContent'> & {
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
  onSelectCarToDelete: (carId: number) => void;
};

export class CarsSection extends Component {
  public cars: { id: number; element: Component }[] = [];

  private onNextPageClick: () => void;
  private onPrevPageClick: () => void;
  private onSelectCarToDelete: (carId: number) => void;

  constructor(config: CarsSectionConfig) {
    const {
      onSelectCarToDelete,
      onNextPageClick,
      onPrevPageClick,
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
  }

  public render(response: PaginationResponse<CarEntity>): void {
    this.cleanSection();

    const list = this.getList(response.data);
    const header = this.getHeader(response.meta.page);
    const headerPagination = this.getPagination(
      response.meta.page,
      response.meta.totalPages
    );
    const footerPagination = this.getPagination(
      response.meta.page,
      response.meta.totalPages
    );

    header.append(headerPagination);
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
      const item = this.getCarItem(car);
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

  private getCarItem(car: CarEntity): Component {
    const item = li();

    const wrapper = header({ classNames: ['flex items-center gap-4'] });

    const select = new Button({
      textContent: 'Select',
      size: 'xs',
      color: 'dark',
    });
    const remove = new Button({
      textContent: 'Remove',
      size: 'xs',
      color: 'dark',
      onClick: (): void => this.onSelectCarToDelete(car.id),
    });
    const name = h3({
      textContent: car.name,
      classNames: ['text-lg font-medium'],
    });

    wrapper.append(select, remove, name);

    const track = div({
      classNames: ['pb-1 flex items-end justify-between border-b-2 pr-10'],
    });

    const carIcon = new Icon({ content: CarIcon });
    carIcon.element.style.color = car.color;
    const flagIcon = new Icon({
      content: FlagIcon,
    });

    flagIcon.addClasses(['[&>svg]:size-10']);

    track.append(carIcon, flagIcon);

    item.append(wrapper, track);

    return item;
  }
}
