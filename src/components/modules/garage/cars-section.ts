import { PAGINATION_DEFAULT_PAGE } from '../../../const/pagination';
import type { ComponentConfig } from '../../abstract';
import { Component } from '../../abstract';
import { div, h2, li, ul } from '../../base';
import { Button } from '../../ui/button';

import type { CarItem } from './car-item';

export type CarsSectionConfig = Omit<ComponentConfig, 'tag' | 'textContent'> & {
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
};

type UpdateSectionProps = {
  currentPage: number;
  totalPages: number;
  items: CarItem[];
};

export class CarsSection extends Component {
  public cars: { id: number; element: Component }[] = [];

  private onNextPageClick: () => void;
  private onPrevPageClick: () => void;

  private sectionTitle = h2({
    textContent: this.getSectionTitle(),
    classNames: ['text-xl font-medium'],
  });

  private carsList = ul({ classNames: ['flex flex-col gap-10'] });

  private previousPageButton = new Button({
    textContent: `Prev`,
    color: 'alt',
    size: 'sm',
  });

  private nextPageButton = new Button({
    textContent: 'Next',
    color: 'alt',
    size: 'sm',
  });

  constructor(config: CarsSectionConfig) {
    const {
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

    this.init();
  }

  public update(props: UpdateSectionProps): void {
    const { currentPage, items, totalPages } = props;
    this.carsList.clean();

    items.forEach((item) => {
      const listItem = li();

      listItem.append(item);

      this.carsList.append(listItem);
    });

    this.sectionTitle.setText(this.getSectionTitle(currentPage));

    this.previousPageButton.setDisabled(
      currentPage === PAGINATION_DEFAULT_PAGE
    );
    this.nextPageButton.setDisabled(currentPage === totalPages);
  }

  public setPaginationButtonsDisabled(value: boolean): void {
    this.nextPageButton.setDisabled(value);
    this.previousPageButton.setDisabled(value);
  }

  private init(): void {
    const wrapper = div({
      classNames: ['flex items-center gap-4 flex-wrap'],
    });

    wrapper.append(this.previousPageButton, this.nextPageButton);

    this.nextPageButton.on('click', () => this.onNextPageClick());
    this.previousPageButton.on('click', () => this.onPrevPageClick());

    this.append(this.sectionTitle, this.carsList, wrapper);
  }

  private getSectionTitle(currentPage = 1): string {
    return `Page: ${currentPage}`;
  }
}
