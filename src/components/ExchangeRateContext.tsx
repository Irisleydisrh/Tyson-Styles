import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { fetchExchangeRate, setExchangeRate, getExchangeRate, ExchangeRate } from "@/lib/exchange-rate";

interface ExchangeRateContextType {
  rate: number;
  loading: boolean;
  updateRate: () => Promise<void>;
  isStale: boolean;
}

const ExchangeRateContext = createContext<ExchangeRateContextType | null>(null);

// Cache con TTL (5 minutos)
const CACHE_TTL = 5 * 60 * 1000;
let cachedRate: number | null = null;
let cacheTimestamp: number | null = null;

function getCachedRate(): number | null {
  if (!cachedRate || !cacheTimestamp) return null;
  if (Date.now() - cacheTimestamp > CACHE_TTL) {
    cachedRate = null;
    cacheTimestamp = null;
    return null;
  }
  return cachedRate;
}

function setCachedRate(rate: number) {
  cachedRate = rate;
  cacheTimestamp = Date.now();
}

export function ExchangeRateProvider({ children }: { children: ReactNode }) {
  const [rate, setRate] = useState(385);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);

  const updateRate = useCallback(async () => {
    try {
      // Check cache first
      const cached = getCachedRate();
      if (cached !== null) {
        setRate(cached);
        setExchangeRate(cached);
        return;
      }

      const data = await fetchExchangeRate();
      const numericRate = Number(data.rate);
      setRate(numericRate);
      setExchangeRate(numericRate);
      setCachedRate(numericRate);
      setIsStale(false);
    } catch (e) {
      console.error("Error fetching rate:", e);
      // Fallback to memory value
      const memRate = getExchangeRate();
      setRate(memRate);
    }
  }, []);

  useEffect(() => {
    // Load initial rate
    updateRate().finally(() => setLoading(false));

    // Check cache cada 30 segundos
    const interval = setInterval(() => {
      const cached = getCachedRate();
      setIsStale(cached === null);
    }, 30000);

    return () => clearInterval(interval);
  }, [updateRate]);

  return (
    <ExchangeRateContext.Provider value={{ rate, loading, updateRate, isStale }}>
      {children}
    </ExchangeRateContext.Provider>
  );
}

export function useExchangeRate() {
  const context = useContext(ExchangeRateContext);
  if (!context) {
    throw new Error("useExchangeRate must be used within ExchangeRateProvider");
  }
  return context;
}