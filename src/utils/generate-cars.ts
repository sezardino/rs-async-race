import type { CreateCarRequest } from '../bll/garage/types';
import { CAR_BRANDS, CAR_MODELS } from '../const/cars';

const getRandomHexColor = (): string =>
  '#' +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');

export const generateCars = (count: number): CreateCarRequest[] => {
  return Array.from({ length: count }, (_, index) => {
    const name = CAR_BRANDS[index % CAR_BRANDS.length];
    const model = CAR_MODELS[index % CAR_MODELS.length];

    return {
      name: `${name} ${model}`,
      color: getRandomHexColor(),
    };
  });
};
