import { Component } from '../components/abstract';
import { ButtonLink } from '../components/ui/button';
import { ApplicationUrls } from '../const/router';
import { Page } from './abstract';

export class WinnersPage extends Page {
  public render(): void {
    this.root.addClasses('py-10');

    const titleComponent = new Component({
      tag: 'h1',
      textContent: 'Winners',
      classNames: ['text-2xl text-center text-black dark:text-white'],
    });

    const homeLink = new ButtonLink({
      href: ApplicationUrls.garage,
      textContent: 'Home',
    });
    const winnersLink = new ButtonLink({
      href: ApplicationUrls.winners,
      textContent: 'Winners',
    });

    const linksWrapper = new Component({});

    linksWrapper.append(homeLink, winnersLink);

    this.root.append(titleComponent, linksWrapper);
  }
}
