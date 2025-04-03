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
  onClick?: () => Promise<void> | void;
};

class AbstractButton extends Component {
  private color: ButtonColor;

  constructor(config: AbstractButtonConfig) {
    const {
      tag,
      color = 'default',
      size = 'base',
      onClick,
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

    this.color = color;

    if (onClick) this.on('click', () => void onClick());
  }

  public changeColor(color: ButtonColor): void {
    const currentClassNames = BUTTON_STYLES[this.color].split(' ');

    currentClassNames.forEach((className) => {
      if (className) this.element.classList.remove(className);
    });

    this.addClasses(BUTTON_STYLES[color]);
  }
}

export type ButtonConfig = Omit<AbstractButtonConfig, 'tag'> & {
  type?: 'submit' | 'button' | 'reset';
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
  public href: string;

  constructor({ href, ...config }: ButtonLinkConfig) {
    super({
      tag: 'a',
      ...config,
    });

    this.href = href;
    this.setAttribute('href', href);
  }
}
