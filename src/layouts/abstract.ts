import type { Component } from '../components/abstract';
import { div } from '../components/base';
import type { Page } from '../pages/abstract';
import type { Router } from '../router';

export type LayoutConfig = {
  router: Router;
};

export class Layout {
  public root: Component;
  public router: Router;

  constructor(config: LayoutConfig) {
    this.root = div();
    this.router = config.router;
  }

  public render(page: Page): void {
    console.log(page);
    throw new Error('Method should be implemented');
  }
}
