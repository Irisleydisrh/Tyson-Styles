import { api } from "@/lib/api-client";

export interface ExchangeRate {
  id: string;
  rate: number;
  updatedAt: string;
}

// Store exchange rate in memory
let currentRate = 385;
let listeners: Array<(rate: number) => void> = [];

export function setExchangeRate(rate: number) {
  currentRate = rate;
  // Notify all listeners
  listeners.forEach(fn => fn(rate));
}

export function getExchangeRate(): number {
  return currentRate;
}

// Subscribe to rate changes
export function subscribeToRateChanges(callback: (rate: number) => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(fn => fn !== callback);
  };
}

export async function fetchExchangeRate(): Promise<ExchangeRate> {
  const data = await api.get<ExchangeRate>('/api/exchange-rate');
  currentRate = Number(data.rate);
  // Notify listeners
  listeners.forEach(fn => fn(currentRate));
  return data;
}

export async function updateExchangeRate(rate: number): Promise<ExchangeRate> {
  const data = await api.patch<ExchangeRate>('/api/exchange-rate', { rate });
  currentRate = Number(data.rate);
  // Notify listeners
  listeners.forEach(fn => fn(currentRate));
  return data;
}

// Helper to calculate price in CUP
export function calculatePriceCUP(priceUSD: number, rate: number): number {
  return Math.round(priceUSD * rate);
}

// Format price with separators
export function formatPrice(value: number, currency: 'USD' | 'CUP'): string {
  if (currency === 'USD') {
    return `$${value.toFixed(2)} USD`;
  }
  return `${value.toLocaleString('es-CU')} CUP`;
}