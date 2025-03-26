import type { ComponentConfig } from '../abstract';
import { Component } from '../abstract';
import type { FormFieldConfig } from '../ui/form-field';
import { FormField } from '../ui/form-field';

export type FormConfiguration<Values extends object> = Omit<
  ComponentConfig,
  'tag'
> & {
  initialValues?: Values;
  onSubmit: (values: Values) => void;
  onUpdateField?: () => void;
};

export class Form<Values extends object> extends Component {
  protected values: Values = {} as Values;
  protected fields: Record<string, FormField> = {};
  private onSubmit: (values: Values) => void;
  // private onUpdateField?: () => void;
  private error: Component | null = null;

  constructor(config: FormConfiguration<Values>) {
    const {
      initialValues,
      onSubmit,
      // onUpdateField,
      ...restConfig
    } = config;

    super({
      tag: 'form',
      ...restConfig,
    });

    if (initialValues) this.values = initialValues;

    this.onSubmit = onSubmit;
    // this.onUpdateField = onUpdateField;

    this.on('submit', (event) => this.submitHandler(event));
  }

  public validate(values: Values): boolean {
    throw new Error(`Method should be implemented, ${JSON.stringify(values)}`);
  }

  public getValues(): Values {
    return this.values;
  }

  // TODO: refactor this method
  // protected setFieldValue(name: string, value: string): void {
  //   // editObjectFieldByPath(this.values, name, value);

  //   this.onUpdateField?.();
  // }

  // TODO: refactor this method
  protected registerField(
    config: FormFieldConfig,
    initialValue: string
  ): FormField {
    const field = new FormField(config);

    this.fields[field.name] = field;
    // editObjectFieldByPath(this.values, field.name, initialValue);
    field.setValue(initialValue);
    field.on('input', (event) => {
      const currentTarget = event.currentTarget;

      if (
        !(currentTarget instanceof HTMLInputElement) &&
        !(currentTarget instanceof HTMLTextAreaElement)
      )
        return;

      // this.setFieldValue(field.name, currentTarget?.value);
    });

    return field;
  }

  // TODO: refactor this method
  // protected deleteValue(name: string): void {
  //   // deleteObjectFieldByPath(this.values, name);
  // }

  // TODO: refactor this method
  // protected unregisterField(name: string): void {
  //   // deleteObjectFieldByPath(this.fields, name);
  //   // deleteObjectFieldByPath(this.values, name);
  // }

  protected setFormError(error: string): void {
    if (this.error) this.error.element.remove();

    this.error = new Component({
      tag: 'p',
      textContent: error,
      classNames: ['mt-2 text-sm text-red-600 dark:text-red-500 text-center'],
    });

    this.error.appendTo(this.element);
  }

  protected setFieldError(name: string, error: string): void {
    const field = this.fields[name];

    if (!field) return;

    field.addErrorMessage(error);
  }

  protected clearErrors(): void {
    Object.values(this.fields).forEach((f) => f.removeErrorMessage());
  }

  private submitHandler(event: Event): void {
    event.preventDefault();

    const values = this.values;

    this.clearErrors();
    const validationResponse = this.validate(values);

    if (!validationResponse) return;

    this.onSubmit(values);
  }
}
