import type { SortOrder } from '../../types/parameters';
import { Component } from '../abstract';
import { Icon } from './icon';

import ArrowDown from '../../assets/arrow-down.svg?raw';
import ArrowUp from '../../assets/arrow-up.svg?raw';

type CellType = Component | HTMLElement | string;

type HeaderParameter = (parameters: {
  name: string;
  sorting: SortOrder;
}) => CellType;
type ColumnParameter<T> = (parameters: {
  name: string;
  index: number;
  original: T;
}) => CellType;

export type ColumnConfig<T> = {
  name: string;
  header: HeaderParameter;
  column: ColumnParameter<T>;
  sortable?: boolean;
};

export type TableSort = { column: string; order: SortOrder };

export type TableConfig<T> = {
  data: T[];
  columns: ColumnConfig<T>[];
  onSort?: (sort: TableSort) => void;
  initialSort?: TableSort;
};

export class Table<T> extends Component<HTMLTableElement> {
  private data: T[];
  private columns: ColumnConfig<T>[];
  private sorting?: TableSort;
  private onSort?: (sort: TableSort) => void;

  constructor({ data, columns, onSort, initialSort }: TableConfig<T>) {
    super({
      tag: 'table',
      classNames: [
        'w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400',
      ],
    });
    this.data = data;
    this.columns = columns;
    this.onSort = onSort;
    this.sorting = initialSort;
    this.setData(data);
  }

  public setData(data: T[]): void {
    this.data = data;
    this.render();
  }

  private handleSort(columnName: string): void {
    const currentSort =
      this.sorting?.column === columnName ? this.sorting.order : null;
    const newSort: SortOrder =
      currentSort === 'ASC' ? 'DESC' : currentSort === 'DESC' ? null : 'ASC';

    const newSorting: TableSort | undefined = newSort
      ? { column: columnName, order: newSort }
      : undefined;

    this.sorting = newSorting;

    if (this.onSort && newSorting) {
      this.onSort(newSorting);
    } else {
      this.render();
    }
  }

  private render(): void {
    this.clean();

    const thead = document.createElement('thead');
    thead.className =
      'text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400';
    const headerRow = document.createElement('tr');
    this.columns.forEach(({ name, header, sortable }) => {
      const th = document.createElement('th');
      th.className = 'px-6 py-3';
      th.scope = 'col';

      const head = header({
        name,
        sorting: this.sorting?.column === name ? this.sorting.order : null,
      });

      th.append(head instanceof Component ? head.element : head);

      if (sortable && this.onSort) {
        th.classList.add('cursor-pointer');
        th.addEventListener('click', () => this.handleSort(name));
      }

      headerRow.appendChild(th);

      if (this.sorting && this.sorting.order && this.sorting.column === name) {
        const type = this.sorting.order;

        const icon = new Icon({
          content: type === 'ASC' ? ArrowDown : ArrowUp,
        });
        icon.addClasses(['[&>svg]:size-4 [&>svg]:inline']);
        th.append(icon.element);
      }
    });
    thead.appendChild(headerRow);
    this.append(thead);

    const tbody = document.createElement('tbody');
    this.data.forEach((row) => {
      const tr = document.createElement('tr');
      tr.className =
        'odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200';
      this.columns.forEach(({ name, column }, colIndex) => {
        const td = document.createElement('td');
        td.className = 'px-6 py-4';

        const col = column({ name, index: colIndex, original: row });
        td.append(col instanceof Component ? col.element : col);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    this.append(tbody);
  }
}
