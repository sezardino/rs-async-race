import { PAGINATION_DEFAULT_PAGE } from '../../../const/pagination';
import type { ComponentConfig } from '../../abstract';
import { Component } from '../../abstract';
import { div, h2, li, skeleton, ul } from '../../base';
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

  private isPrevButtonDisabledPreviously: boolean | undefined;
  private isNextButtonDisabledPreviously: boolean | undefined;

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

    const title =
      items.length === 0 && totalPages >= 1
        ? `No cars found for page: ${currentPage}`
        : this.getSectionTitle(currentPage);

    this.sectionTitle.setText(title);

    this.previousPageButton.setDisabled(currentPage <= PAGINATION_DEFAULT_PAGE);
    this.nextPageButton.setDisabled(currentPage >= totalPages);
  }

  public setPaginationButtonsDisabled(value: boolean): void {
    const previousButtonState =
      this.previousPageButton.element.getAttribute('disabled');
    const nextButtonState =
      this.nextPageButton.element.getAttribute('disabled');

    if (value) {
      this.isPrevButtonDisabledPreviously = previousButtonState === 'true';
      this.isNextButtonDisabledPreviously = nextButtonState === 'true';

      this.nextPageButton.setDisabled(true);
      this.previousPageButton.setDisabled(true);
    } else {
      this.nextPageButton.setDisabled(
        this.isNextButtonDisabledPreviously || false
      );
      this.previousPageButton.setDisabled(
        this.isPrevButtonDisabledPreviously || false
      );

      this.isPrevButtonDisabledPreviously = undefined;
      this.isNextButtonDisabledPreviously = undefined;
    }
  }

  public showLoadingState(): void {
    this.carsList.clean();
    new Array(7).fill(null).forEach(() => {
      const listItem = li();
      listItem.append(skeleton());
      this.carsList.append(listItem);
    });
    this.sectionTitle.setText('Loading...');
    this.previousPageButton.setDisabled(true);
    this.nextPageButton.setDisabled(true);
  }

  private init(): void {
    const wrapper = div({
      classNames: ['flex items-center gap-4 flex-wrap'],
    });

    wrapper.append(this.previousPageButton, this.nextPageButton);

    this.nextPageButton.on('click', () => this.onNextPageClick());
    this.previousPageButton.on('click', () => this.onPrevPageClick());

    this.append(this.sectionTitle, this.carsList, wrapper);
    this.showLoadingState();
  }

  private getSectionTitle(currentPage = 1): string {
    return `Page: ${currentPage}`;
  }
}
