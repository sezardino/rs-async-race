import type { ApplicationUrls } from '../const/router';
import type { Page } from '../pages/abstract';
import { Signal } from '../utils/signal';

type RouterConfig = {
  root: HTMLElement;
  routes: Record<ApplicationUrls, typeof Page>;
  notFoundRoute: typeof Page;
};

export class Router {
  public root: HTMLElement;
  public currentPath = new Signal<ApplicationUrls>(
    window.location.pathname as ApplicationUrls,
    [(path): void => this.handleRoute(path)]
  );

  private routes: Record<ApplicationUrls, typeof Page>;
  private notFoundRoute: typeof Page;
  private currentPage = new Signal<Page | null>(null, [
    (page): void => this.renderNewPage(page),
  ]);

  constructor(config: RouterConfig) {
    this.routes = config.routes;
    this.notFoundRoute = config.notFoundRoute;
    this.root = config.root;

    this.init();
  }

  public navigate(path: ApplicationUrls): void {
    history.pushState({}, '', path);
    this.currentPath.set(path);
  }

  private init(): void {
    window.addEventListener('popstate', () =>
      this.currentPath.set(window.location.pathname as ApplicationUrls)
    );

    document.addEventListener('click', (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const link = target.closest('a');
      if (link && link.origin === window.location.origin) {
        event.preventDefault();
        this.navigate(link.pathname as ApplicationUrls);
      }
    });

    this.handleRoute(window.location.pathname as ApplicationUrls);
  }

  private handleRoute(path: ApplicationUrls): void {
    const PageClass = this.routes[path] || this.notFoundRoute;

    if (this.currentPage) this.currentPage.get()?.root.remove();

    this.currentPage.set(new PageClass({ router: this }));
  }

  private renderNewPage(page: Page | null): void {
    if (!page) return;

    this.root.appendChild(page.root.element);
    page.render();
  }
}
