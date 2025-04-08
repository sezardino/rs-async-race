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

export type TableSort = { field: string; order: SortOrder };

export type TableConfig<T> = {
  data: T[];
  columns: ColumnConfig<T>[];
  onSort?: (sort: TableSort | null) => void;
  initialSort?: TableSort;
};

export class Table<T> extends Component<HTMLTableElement> {
  public data: T[];
  private columns: ColumnConfig<T>[];
  private sorting: TableSort | null;
  private onSort?: (sort: TableSort | null) => void;
  private tbody?: HTMLTableSectionElement;
  private thead?: HTMLTableSectionElement;

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
    this.sorting = initialSort || null;
    this.render();
  }

  public setData(data: T[]): void {
    this.data = data;
    this.renderBody();
  }

  public cleanBody(): void {
    if (!this.tbody) return;

    this.tbody.innerHTML = '';
  }

  private handleSort(columnName: string): void {
    const currentOrder =
      this.sorting?.field === columnName ? this.sorting.order : null;
    const newOrder: SortOrder | null =
      currentOrder === 'ASC' ? 'DESC' : currentOrder === 'DESC' ? null : 'ASC';

    this.sorting =
      newOrder === null ? null : { field: columnName, order: newOrder };

    if (this.onSort) this.onSort(this.sorting);
    this.renderHeader();
  }

  private createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    classNames: string,
    content?: string
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    element.className = classNames;
    if (content) element.textContent = content;
    return element;
  }

  private renderHeader(): void {
    if (this.thead) this.thead.remove();
    this.thead = this.createElement(
      'thead',
      'text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'
    );
    const headerRow = this.createElement('tr', '');

    this.columns.forEach(({ name, header, sortable }) => {
      const th = this.createElement('th', 'px-6 py-3', '');
      th.scope = 'col';

      const head = header({
        name,
        sorting: this.sorting?.field === name ? this.sorting.order : null,
      });

      th.append(head instanceof Component ? head.element : head);

      if (sortable) {
        th.classList.add('cursor-pointer');
        th.addEventListener('click', () => this.handleSort(name));
      }

      if (this.sorting?.field === name) {
        const icon = new Icon({
          content: this.sorting.order === 'ASC' ? ArrowDown : ArrowUp,
        });
        icon.addClasses(['[&>svg]:size-4 [&>svg]:inline']);
        th.append(icon.element);
      }

      headerRow.appendChild(th);
    });

    this.thead.appendChild(headerRow);
    this.append(this.thead);
  }

  private renderBody(): void {
    if (this.tbody) this.tbody.remove();
    this.tbody = this.createElement('tbody', '');

    this.data.forEach((row) => {
      if (!this.tbody) return;

      const tr = this.createElement(
        'tr',
        'odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 select-none'
      );

      this.columns.forEach(({ name, column }, colIndex) => {
        const td = this.createElement('td', 'px-6 py-4', '');

        const col = column({ name, index: colIndex, original: row });

        td.append(col instanceof Component ? col.element : col);
        tr.appendChild(td);
      });

      this.tbody.appendChild(tr);
    });
    this.append(this.tbody);
  }

  private render(): void {
    this.renderHeader();
    this.renderBody();
  }
}
