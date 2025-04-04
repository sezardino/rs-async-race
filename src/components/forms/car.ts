import type { FormConfig } from './abstract';
import { Form } from './abstract';

const MIN_NAME_LENGTH = 3;

const COLOR_HEX_REGEXP = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
const INITIAL_COLOR = '#000000';

export type CarFormValues = {
  color: string;
  name: string;
};

export type CarFormConfig = FormConfig<CarFormValues> & {
  initialValues?: Partial<CarFormValues>;
};

export class CarForm extends Form<CarFormValues> {
  constructor({ initialValues, ...config }: CarFormConfig) {
    super({
      ...config,
      initialValues: {
        ...initialValues,
        color: initialValues?.color ? initialValues.color : INITIAL_COLOR,
      },
      classNames: [...(config.classNames || []), 'flex flex-col gap-4'],
    });

    this.init();
  }

  public validate(values: CarFormValues): boolean {
    this.clearErrors();

    const isNameValid = values.name.trim().length > MIN_NAME_LENGTH;
    const isColorValid = COLOR_HEX_REGEXP.test(values.color);

    if (!isNameValid)
      this.setFieldError(
        'name',
        `Name should have min ${MIN_NAME_LENGTH} characters`
      );
    if (!isColorValid) this.setFieldError('color', 'Invalid color');

    const isFormValid = isNameValid && isColorValid;

    if (!isFormValid)
      this.setFormError("Can't submit form, some field has errors");

    return isFormValid;
  }

  private init(): void {
    const nameField = this.registerField('name', {
      variant: 'input',
      label: 'Name',
      placeholder: 'Tesla',
      description: `Min ${MIN_NAME_LENGTH} characters`,
      type: 'text',
    });
    const colorField = this.registerField('color', {
      variant: 'input',
      label: 'Color',
      placeholder: 'Tesla',
      type: 'color',
    });

    this.append(nameField, colorField);
  }
}
