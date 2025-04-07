import type { Component } from '../abstract';
import { div, h2, header, p } from '../base';
import { Button } from './button';
import type { DialogConfig } from './dialog';
import { Dialog } from './dialog';

export type AlertDialogProps = DialogConfig & {
  confirmText: string;
  title: string;
  description: string;
};

export class AlertDialog extends Dialog {
  private title: Component;
  private description: Component;

  constructor({
    title,
    description,
    confirmText,
    ...config
  }: AlertDialogProps) {
    super(config);

    this.title = h2({ textContent: title, classNames: ['text-2xl'] });
    this.description = p({
      textContent: description,
      classNames: ['mt-2'],
    });

    this.render(confirmText);
  }

  public openAlertDialog(
    config: Pick<AlertDialogProps, 'title' | 'description'>
  ): void {
    this.title.setText(config.title);
    this.description.setText(config.description);

    super.openDialog();
  }

  private render(confirmText: string): void {
    const headerWrapper = header({ classNames: ['text-center'] });

    const footerWrapper = div({
      classNames: ['mt-10 flex justify-center gap-2'],
    });

    const confirmButton = new Button({
      textContent: confirmText,
      onClick: (): void => this.closeDialog(),
    });

    headerWrapper.append(this.title, this.description);
    footerWrapper.append(confirmButton);

    const content = div({ classNames: ['m-4'] });
    content.append(headerWrapper, footerWrapper);

    this.setDialogContent(content.element);
  }
}
