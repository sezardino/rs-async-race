import type { ClassValue } from 'clsx';
import { cn } from '../utils/cn';

export type ComponentConfig = {
  tag?: keyof HTMLElementTagNameMap;
  classNames?: ClassValue[];
  textContent?: string;
  attributes?: Record<string, string>;
};

export class Component<T extends HTMLElement = HTMLElement> {
  public element: T;

  constructor(config?: ComponentConfig) {
    this.element = document.createElement(config?.tag || 'div') as T;
    if (config?.classNames?.length) this.setClasses(config.classNames);
    if (config?.textContent) this.setText(config.textContent);
    if (config?.attributes)
      Object.entries(config.attributes).forEach(([key, value]) =>
        this.setAttribute(key, value)
      );
  }

  public on(event: string, callback: EventListenerOrEventListenerObject): void {
    this.element.addEventListener(event, callback);
  }

  public setText(text: string): void {
    this.element.textContent = text;
  }

  public setAttribute(attribute: string, value: string): void {
    if (value) this.element.setAttribute(attribute, value);
    if (!value) this.element.removeAttribute(attribute);
  }

  public addClasses(...classNames: ClassValue[]): void {
    const presentStyles = Array.from(this.element.classList);

    this.element.className = cn(presentStyles, classNames);
  }

  public removeClass(className: string): void {
    this.element.classList.remove(className);
  }

  public setClasses(...classNames: ClassValue[]): void {
    this.element.className = cn(classNames);
  }

  public appendTo(parent: HTMLElement | Component): void {
    if (parent instanceof Component) return parent.element.append(this.element);

    parent.appendChild(this.element);
  }

  public append(...children: (HTMLElement | Component<HTMLElement>)[]): void {
    children.forEach((child) => {
      if (child instanceof Component)
        return this.element.appendChild(child.element);

      this.element.appendChild(child);
    });
  }

  public getValue(): string | void {
    if (!(this.element instanceof HTMLInputElement)) return;

    return this.element.value;
  }

  public setValue(value: string): void {
    if (!(this.element instanceof HTMLInputElement)) return;

    this.element.value = value;
  }

  public destroy(): void {
    if (!this.element) return;

    this.element.remove();
  }

  public clean(): void {
    if (!this.element) return;

    this.element.innerHTML = '';
  }

  public setDisabled(value: boolean): void {
    this.setAttribute('disabled', value ? 'true' : '');
  }

  public toggleDisabled(): void {
    const current = this.element.getAttribute('disabled');

    this.setDisabled(!current);
  }
}
