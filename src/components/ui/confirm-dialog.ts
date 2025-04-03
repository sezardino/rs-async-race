import { div, h2, header, p } from '../base';
import { Button } from './button';
import type { ButtonColor } from './button/button.types';
import type { DialogConfig } from './dialog';
import { Dialog } from './dialog';

type RenderProps = {
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
  confirmColor?: ButtonColor;
  onConfirm: () => Promise<void>;
};

export type ConfirmDialogProps = RenderProps & DialogConfig;

export class ConfirmDialog extends Dialog {
  constructor({
    title,
    description,
    cancelText,
    confirmText,
    confirmColor,
    onConfirm,
    ...config
  }: ConfirmDialogProps) {
    super(config);

    this.render({
      title,
      description,
      cancelText,
      confirmText,
      confirmColor,
      onConfirm,
    });
  }

  private render(props: RenderProps): void {
    const {
      cancelText,
      confirmText,
      description,
      onConfirm,
      title,
      confirmColor,
    } = props;

    const headerWrapper = header({ classNames: ['text-center'] });
    const titleElement = h2({ textContent: title, classNames: ['text-2xl'] });
    const descriptionElement = p({
      textContent: description,
      classNames: ['mt-2'],
    });

    const footerWrapper = div({
      classNames: ['mt-10 flex justify-between gap-2'],
    });

    const cancelButton = new Button({
      textContent: cancelText,
      classNames: ['px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded'],
      onClick: (): void => this.closeDialog(),
    });

    const confirmButton = new Button({
      textContent: confirmText,
      color: confirmColor,
      onClick: async (): Promise<void> => {
        await onConfirm();
        this.closeDialog();
      },
    });

    headerWrapper.append(titleElement, descriptionElement);
    footerWrapper.append(cancelButton, confirmButton);

    const content = div({ classNames: ['m-4'] });
    content.append(headerWrapper, footerWrapper);

    this.setDialogContent(content.element);
  }
}
