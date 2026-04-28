import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mockear localStorage
const mockLocalStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mockear sessionStorage
const mockSessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Mockear fetch global
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as ReturnType<typeof vi.fn>;