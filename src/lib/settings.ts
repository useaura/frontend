import { api } from './api';

export type Profile = {
  displayName: string;
  email: string;
  cardLimits: {
    dailyLimit: number;
    monthlyLimit: number;
    currentLimit: number;
  } | null;
  controls: {
    panicMode: boolean;
    reversePinEnabled: boolean;
  };
};

export const settingsApi = {
  getProfile: () => api.get<Profile>('/api/settings'),
  updateDisplayName: (displayName: string) => api.put<{ message: string; displayName: string }>(
    '/api/settings/display-name',
    { displayName }
  ),
  updateCardLimits: (dailyLimit?: number, monthlyLimit?: number) => api.put<{ message: string }>(
    '/api/settings/card-limits',
    {
      ...(dailyLimit !== undefined ? { dailyLimit } : {}),
      ...(monthlyLimit !== undefined ? { monthlyLimit } : {}),
    }
  ),
  togglePanicMode: (enabled: boolean) => api.put<{ message: string; panicMode: boolean }>(
    '/api/settings/panic-mode',
    { enabled }
  ),
  toggleReversePin: (enabled: boolean) => api.put<{ message: string; reversePinEnabled: boolean }>(
    '/api/settings/reverse-pin',
    { enabled }
  ),
  changePin: (currentPin: string, newPin: string) => api.put<{ message: string }>(
    '/api/settings/change-pin',
    { currentPin, newPin }
  ),
  verifyPin: (pin: string) => api.post<{ valid: boolean; panicMode: boolean; message?: string }>(
    '/api/settings/verify-pin',
    { pin }
  ),
};
