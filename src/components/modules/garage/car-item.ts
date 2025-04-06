import type { CarEntity } from '../../../types/entity';
import type { ComponentConfig } from '../../abstract';
import { Component } from '../../abstract';
import { div, h3, header } from '../../base';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';

import CarIcon from '../../../assets/car.svg?raw';
import FlagIcon from '../../../assets/flag.svg?raw';

export type CarItemConfig = Omit<ComponentConfig, 'tag'> & {
  car: CarEntity;
  onCarDeleteClick: () => void;
  onCarEditClick: () => void;
  onStartEngineClick: () => void;
  onStopEngineClick: () => void;
};

export class CarItem extends Component {
  public car: CarEntity;

  private carComponent: Component | undefined;
  private onCarDeleteClick: () => void;
  private onCarEditClick: () => void;
  private onStartEngineClick: () => void;
  private onStopEngineClick: () => void;

  private startEngineButton = new Button({
    textContent: 'A',
    size: 'xs',
    color: 'alt',
    onClick: (): void => void this.onStartEngineClick(),
  });

  private stopEngineButton = new Button({
    textContent: 'B',
    size: 'xs',
    color: 'alt',
    onClick: (): void => void this.onStopEngineClick(),
    attributes: { disabled: 'true' },
  });

  constructor(config: CarItemConfig) {
    const {
      car,
      onCarDeleteClick,
      onCarEditClick,
      onStartEngineClick,
      onStopEngineClick,
      classNames = [],
      ...rest
    } = config;

    super({
      ...rest,
      classNames: [...classNames, 'flex flex-col gap-1'],
      tag: 'div',
    });

    this.car = car;
    this.onCarDeleteClick = onCarDeleteClick;
    this.onCarEditClick = onCarEditClick;
    this.onStartEngineClick = onStartEngineClick;
    this.onStopEngineClick = onStopEngineClick;

    this.render();
  }

  public setEngineButtonDisabled(type: 'start' | 'stop', value: boolean): void {
    if (type === 'start') this.startEngineButton.setDisabled(value);
    else this.stopEngineButton.setDisabled(value);
  }

  private render(): void {
    const header = this.getHeader();
    const track = this.getTrack();

    this.append(header, track);
  }

  private getTrack(): Component {
    const trackWrapper = div({ classNames: ['flex w-full gap-2'] });
    const buttonsWrapper = div({ classNames: ['flex flex-col gap-2'] });

    buttonsWrapper.append(this.startEngineButton, this.stopEngineButton);

    const track = div({
      classNames: ['flex-1 pb-1 flex items-end border-b-2 pr-10'],
    });

    this.carComponent = new Icon({
      content: CarIcon,
      classNames: ['absolute'],
    });
    this.carComponent.element.style.color = this.car.color;

    const flagIcon = new Icon({ content: FlagIcon });

    flagIcon.addClasses(['ml-auto [&>svg]:size-10']);

    track.append(this.carComponent, flagIcon);

    trackWrapper.append(buttonsWrapper, track);

    return trackWrapper;
  }

  private getHeader(): Component {
    const head = header({ classNames: ['flex items-center gap-2'] });

    const edit = new Button({
      textContent: 'Edit',
      size: 'xs',
      color: 'dark',
      onClick: (): void => this.onCarEditClick(),
    });
    const remove = new Button({
      textContent: 'Remove',
      size: 'xs',
      color: 'dark',
      onClick: (): void => this.onCarDeleteClick(),
    });

    const name = h3({
      textContent: this.car.name,
      classNames: ['text-lg font-medium'],
    });

    head.append(edit, remove, name);

    return head;
  }
}
