import type { ClassValue } from 'clsx';
import { Component } from '../abstract';
import type { InputConfig } from './input';
import { Input } from './input';

type InputFieldConfig = InputConfig & {
  variant: 'input';
};

export type FormFieldConfig = {
  label?: string;
  name: string;
  description?: string;
} & InputFieldConfig;

export class FormField extends Component {
  public name: string;
  public field: Input | null = null;
  private error: Component | null = null;
  private fieldId: string = crypto.randomUUID();
  private descriptionId = `${this.fieldId}-description`;
  private errorId = `${this.fieldId}-error`;

  constructor(config: FormFieldConfig) {
    const { name, classNames, ...rest } = config;

    super({
      tag: 'div',
      classNames,
    });

    this.name = name;
    this.render(rest);
  }

  public setAttribute(attribute: string, value: string): void {
    this.field?.setAttribute(attribute, value);
  }

  public setValue(value: string): void {
    this.field?.setValue(value);
  }

  public on(event: string, callback: EventListenerOrEventListenerObject): void {
    this.field?.element.addEventListener(event, callback);
  }

  public addErrorMessage(message: string, classNames: ClassValue[] = []): void {
    this.removeErrorMessage();

    this.error = new Component({
      tag: 'p',
      textContent: message,
      classNames: [
        'mt-2 text-sm text-red-600 dark:text-red-500',
        ...classNames,
      ],
    });

    this.error.appendTo(this.element);
    this.field?.setAttribute('aria-invalid', 'true');
    this.field?.setAttribute('aria-errormessage', this.errorId);
  }

  public removeErrorMessage(): void {
    if (!this.error) return;

    this.error.clean();

    this.field?.setAttribute('aria-invalid', '');
    this.field?.setAttribute('aria-errormessage', '');
  }

  private renderLabel(text: string): void {
    const labelComponent = new Component({
      tag: 'label',
      textContent: text,
      classNames: [
        'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
      ],
    });

    labelComponent.setAttribute('for', this.fieldId);
    labelComponent.appendTo(this.element);
  }

  private renderDescription(text: string): void {
    const labelComponent = new Component({
      tag: 'p',
      textContent: text,
      classNames: ['mt-2 text-sm text-gray-500 dark:text-gray-400'],
    });

    labelComponent.setAttribute('id', this.fieldId);
    labelComponent.appendTo(this.element);
    this.field?.setAttribute('aria-describedby', this.descriptionId);
  }

  private renderInput({
    ...config
  }: Omit<FormFieldConfig, 'name' | 'label' | 'description'>): void {
    const initialConfig = {
      ...config,
      name: this.name,
      attributes: { id: this.fieldId, ...config.attributes },
    };

    this.field = new Input(initialConfig);

    this.field.appendTo(this.element);
  }

  private render(config: Omit<FormFieldConfig, 'name' | 'className'>): void {
    const { description, label, ...inputConfig } = config;

    if (label) this.renderLabel(label);

    this.renderInput(inputConfig);

    if (description && this.field) this.renderDescription(description);
  }
}
