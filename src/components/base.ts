import type { ComponentConfig } from './abstract';
import { Component } from './abstract';

type BaseConfig = Pick<
  ComponentConfig,
  'attributes' | 'classNames' | 'textContent'
>;

export const div = (config?: BaseConfig): Component => new Component(config);
export const span = (config?: BaseConfig): Component =>
  new Component<HTMLSpanElement>({ ...config, tag: 'span' });
