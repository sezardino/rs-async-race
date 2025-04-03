import { Signal } from '../../../reactivity/signal';
import { div, h2 } from '../../base';
import type { CarFormValues } from '../../forms/car';
import { CarForm } from '../../forms/car';
import { Button } from '../../ui/button';
import { Dialog } from '../../ui/dialog';

export type CarFormDialogConfig = {
  initialValues?: CarFormValues;
  submitCopy: string;
  onFormSubmit: (values: CarFormValues) => Promise<void>;
  onCancelClick?: () => void;
};

export class CarFormDialog extends Dialog {
  private isFormDisabled = new Signal(false);
  private formId = crypto.randomUUID();
  private form: CarForm;

  private cancelButton: Button;
  private submitButton: Button;

  constructor(config: CarFormDialogConfig) {
    const { initialValues, onFormSubmit, onCancelClick, submitCopy, ...rest } =
      config;
    super(rest);

    this.form = new CarForm({
      onSubmit: async (values): Promise<void> => {
        await onFormSubmit(values);
        this.closeDialog();
      },
      classNames: ['max-w-md'],
      attributes: { id: this.formId },
      initialValues,
    });

    this.cancelButton = new Button({
      type: 'reset',
      textContent: 'Cancel',
      color: 'alt',
      attributes: { form: this.formId },
      onClick: (): void => {
        this.closeDialog();
        if (onCancelClick) onCancelClick();
      },
    });

    this.submitButton = new Button({
      type: 'submit',
      textContent: submitCopy,
      attributes: { form: this.formId },
    });

    this.render(submitCopy);

    this.isFormDisabled.subscribe((value) => this.toggleFormDisabled(value));
  }

  public setFormDisabled(value: boolean): void {
    this.isFormDisabled.set(value);
  }

  private render(submitCopy: string): void {
    const title = h2({
      textContent: submitCopy,
      classNames: ['text-2xl text-center'],
    });
    const wrapper = div({
      classNames: ['mt-4 flex flex-wrap items-center gap-4'],
    });

    wrapper.append(this.cancelButton, this.submitButton);

    const content = div();
    content.append(title, this.form, wrapper);

    this.setDialogContent(content.element);
  }

  private toggleFormDisabled(value: boolean): void {
    this.cancelButton.setAttribute('disabled', value ? 'true' : '');
    this.submitButton.setAttribute('disabled', value ? 'true' : '');

    this.form.toggleDisabled(value);
  }
}
