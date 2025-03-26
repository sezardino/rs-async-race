import type { ApplicationUrls } from '../../../const/router';
import type { ComponentConfig } from '../../abstract';
import { Component } from '../../abstract';
import {
  BUTTON_SIZES,
  BUTTON_STYLES,
  DEFAULT_BUTTON_STYLES,
} from './button.const';
import type { ButtonColor, ButtonSizes } from './button.types';

type AbstractButtonConfig = Pick<
  ComponentConfig,
  'attributes' | 'classNames' | 'textContent'
> & {
  tag: 'button' | 'a';
  color?: ButtonColor;
  size?: ButtonSizes;
};

class AbstractButton extends Component {
  constructor(config: AbstractButtonConfig) {
    const {
      tag,
      color = 'default',
      size = 'base',
      classNames,
      textContent,
      attributes,
    } = config;

    super({
      tag,
      classNames: [
        DEFAULT_BUTTON_STYLES,
        BUTTON_STYLES[color],
        BUTTON_SIZES[size],
        classNames,
      ],
      textContent,
      attributes,
    });
  }
}

export type ButtonConfig = Omit<AbstractButtonConfig, 'tag'> & {
  type?: 'submit' | 'button';
};

export class Button extends AbstractButton {
  constructor({ type = 'button', attributes, ...config }: ButtonConfig) {
    super({
      tag: 'button',
      ...config,
      attributes: { type, ...attributes },
    });
  }
}

type ButtonLinkConfig = Omit<AbstractButtonConfig, 'tag' | 'type'> & {
  href: ApplicationUrls;
};

export class ButtonLink extends AbstractButton {
  constructor({ href, ...config }: ButtonLinkConfig) {
    super({
      tag: 'a',
      ...config,
    });

    this.setAttribute('href', href);
  }
}
