import { PAGINATION_DEFAULT_PAGE } from '../../../const/pagination';
import type { WinnerEntity } from '../../../types/entity';
import type { PaginationResponse } from '../../../types/pagination';
import type { ComponentConfig } from '../../abstract';
import { Component } from '../../abstract';
import { div, h2, header } from '../../base';
import { Button } from '../../ui/button';

export type WinnersSectionConfig = Omit<
  ComponentConfig,
  'tag' | 'textContent'
> & {
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
};

export class WinnersSection extends Component {
  public winners: { id: number; element: Component }[] = [];

  private onNextPageClick: () => void;
  private onPrevPageClick: () => void;

  constructor(config: WinnersSectionConfig) {
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
  }

  public render(response: PaginationResponse<WinnerEntity>): void {
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

    header.append(headerPagination);
    this.append(header, footerPagination);
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
}
