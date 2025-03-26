import type { ApplicationUrls } from '../const/router';
import type { Page } from '../pages/abstract';

type RouterConfig = {
  root: HTMLElement;
  routes: Record<ApplicationUrls, typeof Page>;
  notFoundRoute: typeof Page;
};

class Router {
  public root: HTMLElement;
  private routes: Record<ApplicationUrls, typeof Page>;
  private notFoundRoute: typeof Page;
  private currentPage: Page | null;

  constructor(config: RouterConfig) {
    this.routes = config.routes;
    this.notFoundRoute = config.notFoundRoute;
    this.root = config.root;
    this.currentPage = null;

    this.init();
  }

  public navigate(path: string): void {
    history.pushState({}, '', path);
    this.handleRoute();
  }

  private init(): void {
    window.addEventListener('popstate', () => this.handleRoute());

    document.addEventListener('click', (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const link = target.closest('a');
      if (link && link.origin === window.location.origin) {
        event.preventDefault();
        this.navigate(link.pathname);
      }
    });

    this.handleRoute();
  }

  private handleRoute(): void {
    const path = window.location.pathname as ApplicationUrls;
    const PageClass = this.routes[path] || this.notFoundRoute;

    if (this.currentPage) {
      this.currentPage.root.remove();
    }

    this.currentPage = new PageClass({ router: this });
    this.root.appendChild(this.currentPage.root.element);
    this.currentPage.render();
  }
}

export default Router;
