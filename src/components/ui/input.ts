import type { ComponentConfig } from '../abstract';
import { Component } from '../abstract';

export type InputSize = 'sm' | 'base' | 'lg';
type PickedComponentProps = Pick<ComponentConfig, 'classNames' | 'attributes'>;

export type InputConfig = PickedComponentProps & {
  size?: InputSize;
  type?: 'text' | 'color';
  placeholder?: string;
  name: string;
};

export class Input extends Component {
  public name: string;

  constructor(config: InputConfig) {
    const {
      size = 'base',
      type = 'text',
      placeholder = '',
      attributes = {},
      name,
      classNames = [],
      ...restConfig
    } = config;

    super({
      ...restConfig,
      tag: 'input',
      classNames: [
        DEFAULT_INPUT_STYLES,
        INPUT_SIZES[size],
        type === 'color' && 'h-10 p-0.5',
        ...classNames,
      ],
      attributes: { ...attributes, name, type, placeholder },
    });

    this.name = name;
  }
}

export const DEFAULT_INPUT_STYLES =
  'block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:dark:text-gray-400 readonly:bg-gray-100 read-only:cursor-not-allowed readonly:dark:text-gray-400';

export const INPUT_SIZES: Record<InputSize, string> = {
  lg: 'p-4 text-base',
  base: 'text-sm p-2.5',
  sm: 'p-2 text-xs',
};
