import type { ComponentConfig } from '../abstract';
import { Component } from '../abstract';
import type { FormFieldConfig } from '../ui/form-field';
import { FormField } from '../ui/form-field';

export type FormConfig<Values extends object> = Omit<ComponentConfig, 'tag'> & {
  onSubmit: (values: Values) => void;
  initialValues?: Partial<Values>;
};

export class Form<Values extends Record<string, string>> extends Component {
  protected fields: Record<keyof Values, FormField> = {} as Record<
    keyof Values,
    FormField
  >;
  private initialValues?: Partial<Values>;
  private onSubmit: (values: Values) => void;
  private error: Component | null = null;

  constructor(config: FormConfig<Values>) {
    const { initialValues, onSubmit, ...restConfig } = config;

    super({
      tag: 'form',
      ...restConfig,
    });

    this.onSubmit = onSubmit;
    this.initialValues = initialValues;

    this.on('submit', (event) => this.submitHandler(event));
  }

  public validate(values: Values): boolean {
    throw new Error(`Method should be implemented, ${JSON.stringify(values)}`);
  }

  public toggleDisabled(value: boolean): void {
    Object.values(this.fields).forEach((field) =>
      field.setAttribute('disabled', value ? 'true' : '')
    );
  }

  protected registerField(
    name: Extract<keyof Values, string>,
    config: Omit<FormFieldConfig, 'name'>
  ): FormField {
    const field = new FormField({ ...config, name });

    this.fields[name] = field;
    const initialValue = this.initialValues?.[name];
    if (initialValue) field.setValue(initialValue);

    field.on('input', (event) => {
      const currentTarget = event.currentTarget;

      if (
        !(currentTarget instanceof HTMLInputElement) &&
        !(currentTarget instanceof HTMLTextAreaElement)
      )
        return;
    });

    return field;
  }

  protected unregisterField(name: Extract<keyof Values, string>): void {
    const field = this.fields[name];

    if (!field) return;

    field.destroy();
    delete this.fields[name];
  }

  protected setFormError(error: string): void {
    if (this.error) this.error.element.remove();

    this.error = new Component({
      tag: 'p',
      textContent: error,
      classNames: ['mt-2 text-sm text-red-600 dark:text-red-500 text-center'],
    });

    this.error.appendTo(this.element);
  }

  protected setFieldError(
    name: Extract<keyof Values, string>,
    error: string
  ): void {
    const field = this.fields[name];

    if (!field) return;

    field.addErrorMessage(error);
  }

  protected clearErrors(): void {
    Object.values(this.fields).forEach((f) => f.removeErrorMessage());
  }

  private submitHandler(event: Event): void {
    event.preventDefault();

    const currentTarget = event.currentTarget;

    if (!(currentTarget instanceof HTMLFormElement)) return;

    const formData = new FormData(currentTarget);
    const values: Partial<Values> = {};

    formData.forEach((value, key) => {
      values[key as keyof Values] = value as Values[keyof Values];
    });

    this.clearErrors();
    const validationResponse = this.validate(values as Values);

    if (!validationResponse) return;

    this.onSubmit(values as Values);
  }
}
