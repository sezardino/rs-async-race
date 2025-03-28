import { Component } from '../components/abstract';
import { ApplicationUrls } from '../const/router';
import type { Page } from '../pages/abstract';
import type { LayoutConfig } from './abstract';
import { Layout } from './abstract';

import Logo from '../assets/logo.svg?raw';
import { header, span } from '../components/base';
import { ButtonLink } from '../components/ui/button';
import type { ButtonColor } from '../components/ui/button/button.types';
import { Icon } from '../components/ui/icon';

const NAVIGATION_LINKS = [
  { label: 'Garage', href: ApplicationUrls.garage },
  { label: 'Winners', href: ApplicationUrls.winners },
];

const NAVIGATION_LINK_DEFAULT_COLOR: ButtonColor = 'alt';
const NAVIGATION_LINK_ACTIVE_COLOR: ButtonColor = 'purple';

export class DefaultLayout extends Layout {
  private navigationLinks: ButtonLink[] = [];

  constructor(config: LayoutConfig) {
    super(config);

    config.router.currentPath.subscribe((pathname) =>
      this.setActiveNavigation(pathname)
    );
  }

  public render(page: Page): void {
    const wrapper = header({
      classNames: [
        'container mx-auto px-4 py-2 flex items-center justify-between',
      ],
    });

    const logo = this.getLogo();
    const navigation = this.getNavigation();

    wrapper.append(logo.element, navigation);

    this.root.append(wrapper, page.root.element);
    this.setActiveNavigation(this.router.currentPath.get());
  }

  public setActiveNavigation(pathname: ApplicationUrls): void {
    this.navigationLinks.forEach((link) =>
      link.changeColor(
        link.href === pathname
          ? NAVIGATION_LINK_ACTIVE_COLOR
          : NAVIGATION_LINK_DEFAULT_COLOR
      )
    );
  }

  private getLogo(): Component {
    const link = new Component<HTMLLinkElement>({
      tag: 'a',
      classNames: [
        'text-blue-400 hover:text-blue-900 transition-colors flex items-center gap-2',
      ],
      attributes: { href: ApplicationUrls.garage },
    });

    const icon = new Icon({ content: Logo });

    const text = span({
      textContent: 'Async Race',
      classNames: ['text-xl text-black dark:text-white'],
    });

    link.append(icon, text);

    return link;
  }

  private getNavigation(): Component {
    const nav = new Component({ tag: 'nav' });
    const list = new Component({
      tag: 'ul',
      classNames: ['flex items-center flex-wrap gap-2'],
    });

    nav.append(list);

    NAVIGATION_LINKS.forEach(({ label, href }) =>
      this.createNavigationLink(label, href).appendTo(list)
    );

    return nav;
  }

  private createNavigationLink(
    label: string,
    href: ApplicationUrls
  ): ButtonLink {
    const link = new ButtonLink({
      href,
      color: NAVIGATION_LINK_DEFAULT_COLOR,
      size: 'xs',
      textContent: label,
    });

    this.navigationLinks.push(link);
    return link;
  }
}
