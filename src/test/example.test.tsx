import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CartProvider } from '../components/CartContext';

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debería renderizar children correctamente', () => {
    const TestComponent = () => <div data-testid="test">Test</div>;
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('test')).toBeInTheDocument();
  });
});

describe('Exchange Rate Utils', () => {
  it('debería formatear precio en CUP', () => {
    // Test de utilidad de formateo
    const formatPrice = (value: number) => `${value.toLocaleString('es-CU')} CUP`;
    
    expect(formatPrice(100)).toBe('100 CUP');
    expect(formatPrice(1000)).toBe('1,000 CUP');
  });

  it('debería calcular precio en CUP correctamente', () => {
    const calculatePriceCUP = (priceUSD: number, rate: number) => 
      Math.round(priceUSD * rate);
    
    expect(calculatePriceCUP(10, 385)).toBe(3850);
    expect(calculatePriceCUP(25, 400)).toBe(10000);
  });
});