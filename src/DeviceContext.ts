import { createContext } from 'react';
import { Device } from './types';

export const deviceContextDefaultValue: Device = {
  isDesktop: false,
  orientation: 'portrait',
};
export const DeviceContext = createContext(deviceContextDefaultValue);
