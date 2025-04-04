import { Signal } from '../../../reactivity/signal';
import { div, h2 } from '../../base';
import type { CarFormValues } from '../../forms/car';
import { CarForm } from '../../forms/car';
import { Button } from '../../ui/button';
import type { DialogConfig } from '../../ui/dialog';
import { Dialog } from '../../ui/dialog';

export type CarFormDialogConfig = Pick<DialogConfig, 'onClose'> & {
  initialValues?: CarFormValues;
  submitCopy: string;
  onFormSubmit: (values: CarFormValues) => Promise<void>;
  onCancelClick?: () => void;
};

export class CarFormDialog extends Dialog {
  private isFormDisabled = new Signal(false);
  private formId = crypto.randomUUID();
  private formWrapper = div();
  private form?: CarForm;
  private onFormSubmit: (values: CarFormValues) => Promise<void>;
  private initialValues?: CarFormValues;

  private cancelButton: Button;
  private submitButton: Button;

  constructor(config: CarFormDialogConfig) {
    const { initialValues, onFormSubmit, onCancelClick, submitCopy, ...rest } =
      config;
    super(rest);

    this.onFormSubmit = onFormSubmit;
    this.initialValues = initialValues;
    this.form = this.renderForm(initialValues);

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

  public openDialog(initialValues?: Partial<CarFormValues>): void {
    super.openDialog();

    if (!initialValues) return;

    this.renderForm(initialValues);
  }

  public closeDialog(): void {
    super.closeDialog();

    this.renderForm(this.initialValues);
  }

  public setFormDisabled(value: boolean): void {
    this.isFormDisabled.set(value);
  }

  private renderForm(initialValues?: Partial<CarFormValues>): CarForm {
    this.formWrapper?.clean();
    const form = new CarForm({
      onSubmit: async (values): Promise<void> => {
        await this.onFormSubmit(values);
        this.closeDialog();
      },
      classNames: ['max-w-md'],
      attributes: { id: this.formId },
      initialValues,
    });

    this.formWrapper.append(form);

    this.form = form;

    return form;
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

    content.append(title, this.formWrapper, wrapper);

    this.setDialogContent(content.element);
  }

  private toggleFormDisabled(value: boolean): void {
    this.cancelButton.setAttribute('disabled', value ? 'true' : '');
    this.submitButton.setAttribute('disabled', value ? 'true' : '');

    this.form?.toggleDisabled(value);
  }
}
