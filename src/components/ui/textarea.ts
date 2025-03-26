import type { ComponentConfig } from '../abstract';
import { Component } from '../abstract';

type PickedComponentProps = Pick<ComponentConfig, 'classNames' | 'attributes'>;

export type TextareaConfig = PickedComponentProps & {
  placeholder?: string;
  name: string;
};

export class Textarea extends Component {
  public name: string;

  constructor(config: TextareaConfig) {
    const {
      placeholder = '',
      attributes = {},
      name,
      classNames = [],
      ...restConfig
    } = config;

    super({
      ...restConfig,
      tag: 'textarea',
      classNames: [DEFAULT_TEXTAREA_STYLES, ...classNames],
      attributes: { ...attributes, name, placeholder },
    });

    this.name = name;
  }
}

export const DEFAULT_TEXTAREA_STYLES =
  'block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:dark:text-gray-400 readonly:bg-gray-100 read-only:cursor-not-allowed readonly:dark:text-gray-400';
