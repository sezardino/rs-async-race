import type { ApplicationUrls } from '../const/router';
import type { Layout } from '../layouts/abstract';
import type { Page } from '../pages/abstract';
import { Signal } from '../utils/signal';

type Routes = Record<
  ApplicationUrls,
  { page: typeof Page; layout?: typeof Layout }
>;

type RouterConfig = {
  root: HTMLElement;
  routes: Routes;
  notFoundRoute: typeof Page;
  defaultLayout?: typeof Layout;
};

export class Router {
  public root: HTMLElement;
  public currentPath = new Signal<ApplicationUrls>(
    window.location.pathname as ApplicationUrls,
    [(path): void => this.handleRoute(path)]
  );

  private routes: Routes;
  private notFoundRoute: typeof Page;
  private defaultLayout?: typeof Layout;
  private currentPage = new Signal<Page | null>(null);
  private currentLayout: Layout | null = null;

  constructor(config: RouterConfig) {
    this.routes = config.routes;
    this.notFoundRoute = config.notFoundRoute;
    this.defaultLayout = config.defaultLayout;
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

    this.attachLinkClickHandler();
    this.handleRoute(window.location.pathname as ApplicationUrls);
  }

  private attachLinkClickHandler(): void {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const link = target.closest('a');
      if (link && link.origin === window.location.origin) {
        event.preventDefault();
        this.navigate(link.pathname as ApplicationUrls);
      }
    });
  }

  private handleRoute(path: ApplicationUrls): void {
    const routeConfig = this.routes[path];
    if (!routeConfig) {
      this.renderNotFoundPage();
      return;
    }

    const PageClass = routeConfig.page;
    const LayoutClass = routeConfig.layout || this.defaultLayout;

    const pageInstance = new PageClass({ router: this });
    this.renderNewPage(pageInstance, LayoutClass);
  }

  private renderNotFoundPage(): void {
    const NotFoundPage = new this.notFoundRoute({ router: this });
    this.renderNewPage(NotFoundPage);
  }

  private renderNewPage(page: Page, LayoutClass?: typeof Layout): void {
    if (this.currentPage.get() === page) return;
    this.currentPage.set(page);

    if (LayoutClass) {
      this.renderWithLayout(page, LayoutClass);
    } else {
      this.renderWithoutLayout(page);
    }
  }

  private renderWithLayout(page: Page, LayoutClass: typeof Layout): void {
    this.currentLayout = new LayoutClass({ router: this });
    this.root.innerHTML = '';
    this.root.appendChild(this.currentLayout.root.element);
    this.currentLayout.render(page);
    page.render();
  }

  private renderWithoutLayout(page: Page): void {
    this.currentLayout = null;
    this.root.innerHTML = '';
    this.root.appendChild(page.root.element);
    page.render();
  }
}
