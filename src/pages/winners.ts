import { Component } from '../components/abstract';
import { Page } from './abstract';

export class WinnersPage extends Page {
  public render(): void {
    this.root.addClasses('py-10');

    const titleComponent = new Component({
      tag: 'h1',
      textContent: 'Winners',
      classNames: ['text-2xl text-center text-black dark:text-white'],
    });

    titleComponent.appendTo(this.root.element);
  }
}
