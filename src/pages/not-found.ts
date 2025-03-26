import { Component } from '../components/abstract';
import { ButtonLink } from '../components/ui/button';
import { ApplicationUrls } from '../const/router';
import { Page } from './abstract';

export class NotFoundPage extends Page {
  public render(): void {
    this.root.addClasses('flex items-center justify-center');

    const section = new Component({
      tag: 'section',
      classNames: [
        'py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 text-center',
      ],
    });

    const h1 = new Component({
      tag: 'h1',
      classNames: [
        'mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500',
      ],
      textContent: '404',
    });

    const p = new Component({
      tag: 'p',
      classNames: [
        'mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white',
      ],
      textContent: "Something's missing.",
    });

    const button = new ButtonLink({
      textContent: 'Back to Main page',
      href: ApplicationUrls.home,
    });

    section.appendTo(this.root.element);
    h1.appendTo(section.element);
    p.appendTo(section.element);
    button.appendTo(section.element);
  }
}
