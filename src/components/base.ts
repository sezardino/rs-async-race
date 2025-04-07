import type { ComponentConfig } from './abstract';
import { Component } from './abstract';

type BaseConfig = Pick<
  ComponentConfig,
  'attributes' | 'classNames' | 'textContent'
>;

export const div = (config?: BaseConfig): Component => new Component(config);
export const header = (config?: BaseConfig): Component =>
  new Component({ ...config, tag: 'header' });
export const section = (config?: BaseConfig): Component =>
  new Component({ ...config, tag: 'section' });

export const ul = (config?: BaseConfig): Component =>
  new Component({ ...config, tag: 'ul' });
export const li = (config?: BaseConfig): Component =>
  new Component({ ...config, tag: 'li' });

export const h1 = (config?: BaseConfig): Component =>
  new Component<HTMLHeadingElement>({ ...config, tag: 'h1' });
export const h2 = (config?: BaseConfig): Component =>
  new Component<HTMLHeadingElement>({ ...config, tag: 'h2' });
export const h3 = (config?: BaseConfig): Component =>
  new Component<HTMLHeadingElement>({ ...config, tag: 'h3' });
export const p = (config?: BaseConfig): Component =>
  new Component<HTMLParagraphElement>({ ...config, tag: 'p' });
export const span = (config?: BaseConfig): Component =>
  new Component<HTMLSpanElement>({ ...config, tag: 'span' });
export const skeleton = (config?: BaseConfig): Component =>
  new Component({
    ...config,
    classNames: ['animate-pulse rounded-md bg-gray/10', config?.classNames],
  });
