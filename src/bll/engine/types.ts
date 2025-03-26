export type EngineStatus = 'started' | 'stopped';

export type ToggleEngineStatusRequest = {
  id: number;
  status: EngineStatus;
};

export type ToggleEngineStatusResponse = {
  velocity: number;
  distance: number;
};

export type SwitchEngineToDriveRequest = {
  id: number;
};

export type SwitchEngineToDriveResponse = {
  success: boolean;
};
