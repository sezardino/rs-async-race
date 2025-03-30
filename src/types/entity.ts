export type CarEntity = {
  id: number;
  name: string;
  color: string;
};

export type WinnerEntity = {
  id: number;
  wins: number;
  time: number;
};

export type WinnerWithCar = WinnerEntity & {
  car: CarEntity | null;
};
