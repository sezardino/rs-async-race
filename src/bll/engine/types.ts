export type EngineStatus = 'started' | 'stopped';

export type EngineManipulationRequest = {
  carId: number;
};

export type EngineManipulationResponse = {
  velocity: number;
  distance: number;
};

export type ToggleEngineStatusRequest = EngineManipulationRequest & {
  status: EngineStatus;
};

export type ToggleEngineStatusResponse = EngineManipulationResponse;

export type SwitchEngineToDriveRequest = EngineManipulationRequest;

export type SwitchEngineToDriveResponse = {
  success: boolean;
};
