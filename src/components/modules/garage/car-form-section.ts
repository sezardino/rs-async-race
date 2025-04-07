import { Signal } from '../../../reactivity/signal';
import type { ComponentConfig } from '../../abstract';
import { Component } from '../../abstract';
import { div, h2 } from '../../base';
import type { CarFormValues } from '../../forms/car';
import { CarForm } from '../../forms/car';
import { Button } from '../../ui/button';

export type CarFormSectionConfig = Omit<
  ComponentConfig,
  'tag' | 'textContent'
> & {
  initialValues?: CarFormValues;
  submitCopy: string;
  onFormSubmit: (values: CarFormValues) => void;
};

export class CarFormSection extends Component {
  private isFormDisabled = new Signal(false);
  private formId = crypto.randomUUID();
  private form: CarForm;

  private cancelButton = new Button({
    type: 'reset',
    textContent: 'Cancel',
    color: 'alt',
    attributes: { form: this.formId },
  });

  private submitButton: Button;

  constructor(config: CarFormSectionConfig) {
    const {
      initialValues,
      onFormSubmit,
      submitCopy,
      classNames = [],
      ...rest
    } = config;
    super({
      ...rest,
      tag: 'section',
      classNames: [...classNames, 'flex flex-col gap-4'],
    });

    this.form = new CarForm({
      onSubmit: onFormSubmit,
      classNames: ['max-w-md'],
      attributes: { id: this.formId },
      initialValues,
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
      textContent: `Section with form where user can ${submitCopy}`,
      classNames: ['sr-only'],
    });
    const wrapper = div({
      classNames: ['flex flex-wrap items-center gap-4'],
    });

    wrapper.append(this.cancelButton, this.submitButton);

    this.append(title, this.form, wrapper);
  }

  private toggleFormDisabled(value: boolean): void {
    this.cancelButton.setAttribute('disabled', value ? 'true' : '');
    this.submitButton.setAttribute('disabled', value ? 'true' : '');

    this.form.toggleFieldDisabled(value);
  }
}
