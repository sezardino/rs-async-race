import { PAGINATION_DEFAULT_PAGE } from '../../../const/pagination';
import type { WinnerWithCar } from '../../../types/entity';
import type { PaginationResponse } from '../../../types/pagination';
import type { ComponentConfig } from '../../abstract';
import { Component } from '../../abstract';
import { div, h2, header } from '../../base';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';
import type { ColumnConfig, TableSort } from '../../ui/table';
import { Table } from '../../ui/table';

import CarIcon from '../../../assets/car.svg?raw';

export type WinnersSectionConfig = Omit<
  ComponentConfig,
  'tag' | 'textContent'
> & {
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
  onSortChange: (sort: TableSort) => void;
  initialSort?: TableSort;
};

export class WinnersSection extends Component {
  public winners: { id: number; element: Component }[] = [];

  private onNextPageClick: () => void;
  private onPrevPageClick: () => void;

  private winnersTable: Table<WinnerWithCar>;

  constructor(config: WinnersSectionConfig) {
    const {
      onNextPageClick,
      onPrevPageClick,
      onSortChange,
      initialSort,
      classNames = [],
      ...rest
    } = config;
    super({
      ...rest,
      tag: 'section',
      classNames: [...classNames, 'flex flex-col gap-8'],
    });

    this.winnersTable = this.getTable(onSortChange, initialSort);

    this.onNextPageClick = onNextPageClick;
    this.onPrevPageClick = onPrevPageClick;
  }

  public render(response: PaginationResponse<WinnerWithCar>): void {
    this.cleanSection();

    const header = this.getHeader(response.meta.page);
    const headerPagination = this.getPagination(
      response.meta.page,
      response.meta.totalPages
    );
    const footerPagination = this.getPagination(
      response.meta.page,
      response.meta.totalPages
    );

    this.winnersTable.setData(response.data);

    header.append(headerPagination);
    this.append(header, this.winnersTable, footerPagination);
  }

  private cleanSection(): void {
    this.clean();
    this.winners.forEach((winner) => winner.element.clean());
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

  private getTable(
    onSortChange: (sort: TableSort) => void,
    initialSort?: TableSort
  ): Table<WinnerWithCar> {
    const columns: ColumnConfig<WinnerWithCar>[] = [
      {
        name: 'id',
        header: () => 'ID',
        column: ({ original }) => original.id.toString(),
        sortable: true,
      },
      {
        name: 'car',
        header: () => 'Car',
        column: ({ original }): string | Icon => {
          if (!original.car) return '-';

          const icon = new Icon({ content: CarIcon });
          icon.addClasses(['[&>svg]:size-10']);
          icon.element.style.color = original.car?.color;

          return icon;
        },
      },
      {
        name: 'name',
        header: () => 'Name',
        column: ({ original }) => original.car?.name || '-',
      },
      {
        name: 'wins',
        header: () => 'Wins',
        column: ({ original }) => original.wins.toString(),
        sortable: true,
      },
      {
        name: 'time',
        header: () => 'Best time (seconds)',
        column: ({ original }) => original.time.toString(),
        sortable: true,
      },
    ];

    return new Table({
      data: [],
      columns,
      onSort: onSortChange,
      initialSort,
    });
  }
}
