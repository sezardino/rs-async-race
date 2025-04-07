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
  onFinish: (time: number) => void;
};

export class CarItem extends Component {
  public car: CarEntity;

  private startEngineButton: Button;
  private stopEngineButton: Button;
  private editButton: Button;
  private removeButton: Button;
  private carIcon: Icon;
  private onFinish: (time: number) => void;

  private animationFrameId: number | null = null;

  private carWrapper = div({
    classNames: ['absolute grid'],
  });
  private flameIcon = new Icon({
    content: FlameIcon,
    classNames: ['absolute animate-ping hidden'],
    style: 'color: red',
  });

  constructor(config: CarItemConfig) {
    const {
      car,
      onCarDeleteClick,
      onCarEditClick,
      onStartEngineClick,
      onStopEngineClick,
      onFinish,
      classNames = [],
      ...rest
    } = config;

    super({
      ...rest,
      classNames: [...classNames, 'flex flex-col gap-1'],
      tag: 'div',
    });

    this.car = car;
    this.onFinish = onFinish;

    this.carIcon = new Icon({
      content: CarIcon,
      style: `color: ${car.color}`,
    });

    this.editButton = new Button({
      textContent: 'Edit',
      size: 'xs',
      color: 'dark',
      onClick: (): void => onCarEditClick(),
    });
    this.removeButton = new Button({
      textContent: 'Remove',
      size: 'xs',
      color: 'dark',
      onClick: (): void => onCarDeleteClick(),
    });
    this.startEngineButton = new Button({
      textContent: 'A',
      size: 'xs',
      color: 'alt',
      onClick: (): void => void onStartEngineClick(),
    });

    this.stopEngineButton = new Button({
      textContent: 'B',
      size: 'xs',
      color: 'alt',
      onClick: (): void => void onStopEngineClick(),
      attributes: { disabled: 'true' },
    });

    this.render();
  }

  public setEngineButtonDisabled(
    type: 'start' | 'stop' | 'all',
    value: boolean
  ): void {
    if (type === 'start') this.startEngineButton.setDisabled(value);
    else if (type === 'stop') this.stopEngineButton.setDisabled(value);
    else {
      this.startEngineButton.setDisabled(value);
      this.stopEngineButton.setDisabled(value);
    }
  }

  public setManageButtonDisabled(value: boolean): void {
    const buttons = [this.editButton, this.removeButton];

    buttons.forEach((button) => button.setDisabled(value));
  }

  public driveToEnd(duration: number): void {
    if (!this.carWrapper) return;

    const car = this.carWrapper.element;
    const container = car.parentElement;
    if (!container) return;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = null;
    this.flameIcon.addClasses(['hidden']);

    const distance = container.offsetWidth - car.offsetWidth;
    let startTimestamp: number | null = null;

    const step = (timestamp: number): void => {
      if (startTimestamp === null) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;

      const progress = Math.min(elapsed / duration, 1);
      const translateX = distance * progress;
      car.style.transform = `translateX(${translateX}px)`;

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(step);
      } else {
        this.animationFrameId = null;
        this.onFinish(elapsed);
      }
    };

    this.animationFrameId = requestAnimationFrame(step);
  }

  public breakDown(): void {
    if (this.animationFrameId === null) {
      return;
    }

    const car = this.carWrapper.element;
    const container = car.parentElement;
    if (!container) return;

    const currentTransform = car.style.transform;
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;

    car.style.transform = currentTransform;
    this.flameIcon.removeClass('hidden');
  }

  public resetRace(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.carWrapper.element.style.transform = 'translateX(0)';
    this.flameIcon.addClasses(['hidden']);
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

    const name = h3({
      textContent: this.car.name,
      classNames: ['text-lg font-medium'],
    });

    head.append(this.editButton, this.removeButton, name);

    return head;
  }
}
