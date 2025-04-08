import type { WinnerWithCar } from '../../../types/entity';
import type { ComponentConfig } from '../../abstract';
import { Component } from '../../abstract';
import { footer, h2, header } from '../../base';
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
  onSortChange: (sort: TableSort | null) => void;
  initialSort?: TableSort;
};

export class WinnersSection extends Component {
  public winners: { id: number; element: Component }[] = [];

  private title = h2({
    textContent: this.getPageTitle(),
    classNames: ['text-xl font-medium'],
  });

  private winnersTable: Table<WinnerWithCar>;
  private previousPageButton: Button;
  private nextPageButton: Button;

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

    this.previousPageButton = new Button({
      textContent: `Prev`,
      color: 'alt',
      size: 'sm',
      disabled: true,
      onClick: onNextPageClick,
    });

    this.nextPageButton = new Button({
      textContent: 'Next',
      color: 'alt',
      size: 'sm',
      disabled: true,
      onClick: onPrevPageClick,
    });

    this.init();
  }

  public update(data: { winners: WinnerWithCar[]; currentPage: number }): void {
    const { winners, currentPage } = data;

    this.winnersTable.cleanBody();
    this.winnersTable.setData(winners);

    this.updateTitle(currentPage);
  }

  public updateTitle(currentPage: number): void {
    this.title.setText(this.getPageTitle(currentPage));
  }

  private init(): void {
    const headerWrapper = header({ classNames: ['flex flex-col gap-2'] });

    headerWrapper.append(this.title);

    const footerWrapper = footer({
      classNames: ['flex items-center gap-4 flex-wrap'],
    });

    footerWrapper.append(this.previousPageButton, this.nextPageButton);

    this.append(headerWrapper, this.winnersTable, footerWrapper);
  }

  private getTable(
    onSortChange: (sort: TableSort | null) => void,
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
          console.log(original.car);

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

  private getPageTitle(currentPage = 1): string {
    return `Page: ${currentPage}`;
  }
}
