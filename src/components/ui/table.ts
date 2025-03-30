import type { SortOrder } from '../../types/parameters';
import { Component } from '../abstract';

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

export type TableConfig<T> = {
  data: T[];
  columns: ColumnConfig<T>[];
  onSort?: (column: string, order: SortOrder) => void;
};

export class Table<T> extends Component<HTMLTableElement> {
  private data: T[];
  private columns: ColumnConfig<T>[];
  private sorting: Record<string, SortOrder>;
  private onSort?: (column: string, order: SortOrder) => void;

  constructor({ data, columns, onSort }: TableConfig<T>) {
    super({
      tag: 'table',
      classNames: ['w-full border-collapse border border-gray-300'],
    });
    this.data = data;
    this.columns = columns;
    this.onSort = onSort;
    this.sorting = {};
    this.setData(data);
  }

  public setData(data: T[]): void {
    this.data = data;
    this.render();
  }

  private handleSort(columnName: string): void {
    const currentSort = this.sorting[columnName] || null;

    const newSort: SortOrder =
      currentSort === 'ASC' ? 'DESC' : currentSort === 'DESC' ? null : 'ASC';

    this.sorting = newSort ? { [columnName]: newSort } : {};

    if (this.onSort) {
      this.onSort(columnName, newSort);
    } else {
      this.render();
    }
  }

  private render(): void {
    this.clean();

    const thead = document.createElement('thead');
    thead.className = 'bg-gray-200 text-left';
    const headerRow = document.createElement('tr');
    this.columns.forEach(({ name, header, sortable }) => {
      const th = document.createElement('th');
      th.className = 'p-2 border border-gray-300 hover:bg-gray-300';

      const head = header({ name, sorting: this.sorting[name] || null });

      th.append(head instanceof Component ? head.element : head);

      if (sortable && this.onSort) {
        th.classList.add('cursor-pointer');
        th.addEventListener('click', () => this.handleSort(name));
      }
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    this.append(thead);

    const tbody = document.createElement('tbody');
    this.data.forEach((row) => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-gray-100';
      this.columns.forEach(({ name, column }, colIndex) => {
        const td = document.createElement('td');
        td.className = 'p-2 border border-gray-300';

        const col = column({ name, index: colIndex, original: row });

        td.append(col instanceof Component ? col.element : col);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    this.append(tbody);
  }
}
