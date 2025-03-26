import type { ComponentConfig } from '../abstract';
import { Component } from '../abstract';
import type { ButtonConfig } from './button';
import { Button } from './button';

export type DialogConfig = {
  dialog?: Omit<ComponentConfig, 'tag'>;
  trigger?: ButtonConfig;
};

const OVERFLOW_HIDDEN_CLASS_NAME = 'overflow-hidden';

export class Dialog extends Component {
  private trigger?: Button;

  constructor({ ...config }: DialogConfig) {
    super({
      ...config.dialog,
      tag: 'dialog',
      classNames: [
        'p-4 bg-white dark:bg-gray-900 rounded min-w-[450px] m-auto text-black dark:text-white backdrop:bg-black/50',
      ],
    });

    this.trigger = config.trigger ? new Button(config.trigger) : undefined;
    this.initEvents();
  }

  public openDialog(): void {
    if (!(this.element instanceof HTMLDialogElement)) return;

    document.body.append(this.element);
    this.element.showModal();
    document.body.classList.add(OVERFLOW_HIDDEN_CLASS_NAME);
  }

  public closeDialog(): void {
    if (!(this.element instanceof HTMLDialogElement)) return;

    this.element.close();
    this.element.remove();
    document.body.classList.remove(OVERFLOW_HIDDEN_CLASS_NAME);
  }

  public setOnOpen(callback: () => void): void {
    this.on('open', callback);
  }

  public setOnClose(callback: () => void): void {
    this.on('close', callback);
  }

  public setDialogContent(content: HTMLElement): void {
    this.element.innerHTML = '';
    this.element.appendChild(content);
  }

  public appendTo(parent: HTMLElement): void {
    if (this.trigger) {
      parent.appendChild(this.trigger.element);

      this.trigger.on('click', () => this.openDialog());

      return;
    }
  }

  private initEvents(): void {
    if (!(this.element instanceof HTMLDialogElement)) return;

    this.element.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.closeDialog();
    });

    this.element.addEventListener('click', (event) => {
      if (event.target === this.element) this.closeDialog();
    });
  }
}
