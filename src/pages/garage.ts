import { Component } from '../components/abstract';
import { Page } from './abstract';

export class GaragePage extends Page {
  public render(): void {
    this.root.addClasses('py-10');

    const titleComponent = new Component({
      tag: 'h1',
      textContent: 'Garage',
      classNames: ['text-2xl text-center text-black dark:text-white'],
    });

    this.root.append(titleComponent);
  }
}
