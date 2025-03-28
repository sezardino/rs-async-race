import { Component } from '../components/abstract';
import type { Router } from '../router';

export type PageConfig = {
  router: Router;
};

export class Page {
  public root: Component;
  public router: Router;

  constructor(config: PageConfig) {
    this.router = config.router;
    this.root = new Component({
      tag: 'main',
      classNames: ['container mx-auto px-4 min-h-dvh'],
    });
  }

  public render(): void {
    throw new Error('Method should be implemented');
  }

  public navigate(path: string): void {
    history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  }
}
