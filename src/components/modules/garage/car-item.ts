import type { CarEntity } from '../../../types/entity';
import type { ComponentConfig } from '../../abstract';
import { Component } from '../../abstract';
import { div, h3, header } from '../../base';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';

import CarIcon from '../../../assets/car.svg?raw';
import FlagIcon from '../../../assets/flag.svg?raw';
import FlameIcon from '../../../assets/flame.svg?raw';

export type CarItemConfig = Omit<ComponentConfig, 'tag'> & {
  car: CarEntity;
  onCarDeleteClick: () => void;
  onCarEditClick: () => void;
  onStartEngineClick: () => void;
  onStopEngineClick: () => void;
};

export class CarItem extends Component {
  public car: CarEntity;

  private animationFrameId: number | null = null;

  private carWrapper = div({
    classNames: ['absolute grid'],
  });
  private carIcon: Icon;
  private flameIcon = new Icon({
    content: FlameIcon,
    classNames: ['absolute animate-ping hidden'],
    style: 'color: red',
  });

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

    this.carIcon = new Icon({
      content: CarIcon,
      style: `color: ${car.color}`,
    });

    this.render();
  }

  public setEngineButtonDisabled(type: 'start' | 'stop', value: boolean): void {
    if (type === 'start') this.startEngineButton.setDisabled(value);
    else this.stopEngineButton.setDisabled(value);
  }

  public startAnimation(config: { duration: number; stopAfter: number }): void {
    if (!this.carWrapper) return;

    const car = this.carWrapper.element;
    const container = car.parentElement;
    if (!container) return;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    const { duration, stopAfter } = config;
    const distance = container.offsetWidth - car.offsetWidth;

    let startTimestamp: number | null = null;
    let stopped = false;

    this.flameIcon.addClasses(['hidden']);

    const step = (timestamp: number): void => {
      if (startTimestamp === null) startTimestamp = timestamp;

      const elapsed = timestamp - startTimestamp;

      if (elapsed >= duration) {
        car.style.transform = `translateX(${distance}px)`;
        this.animationFrameId = null;
        this.flameIcon.addClasses(['hidden']);
        return;
      }

      if (!stopped && elapsed >= stopAfter) {
        const progress = stopAfter / duration;
        const translateX = distance * progress;
        car.style.transform = `translateX(${translateX}px)`;

        this.flameIcon.removeClass('hidden');
        stopped = true;
        this.animationFrameId = null;
        return;
      }

      const progress = elapsed / duration;
      const translateX = distance * progress;
      car.style.transform = `translateX(${translateX}px)`;

      this.animationFrameId = requestAnimationFrame(step);
    };

    this.animationFrameId = requestAnimationFrame(step);
  }

  private resetState(): void {
    this.flameIcon.removeClass('block');
    this.carWrapper.element.style.transform = 'translateX(0)';
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
      classNames: ['flex-1 pb-1 flex items-end border-b-2 pr-2'],
    });

    this.carWrapper.append(this.carIcon, this.flameIcon);

    const flagIcon = new Icon({
      content: FlagIcon,
      classNames: ['ml-auto [&>svg]:size-10'],
    });

    track.append(this.carWrapper, flagIcon);

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
