import type { ComponentConfig } from '../abstract';
import { Component } from '../abstract';

export type IconConfig = Omit<ComponentConfig, 'tag' | 'textContent'> & {
  content: string;
};

export class Icon extends Component<HTMLSpanElement> {
  constructor(config: IconConfig) {
    super({ ...config, tag: 'span' });

    this.render(config.content);
  }

  private render(svg: string): void {
    this.addClasses(['[&>svg]:size-14']);

    this.element.innerHTML = svg;
  }
}
