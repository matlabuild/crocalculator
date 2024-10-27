export type TabType = 'pre-test' | 'calculator';

export interface Variant {
  id: string;
  label: string;
  visitors: number;
  conversions: number;
  colorClass: string;
  textColorClass: string;
}

export interface TestResult {
  variantId: string;
  conversionRate: number;
  confidenceInterval: [number, number];
  improvement: number;
  significanceLevel: number;
  zScore: number;
  isSignificant: boolean;
  isWinner: boolean;
  isLoser: boolean;
}

export interface SampleSizeParams {
  baselineConversion: number;
  minimumDetectableEffect: number;
  confidenceLevel: number;
  statisticalPower: number;
}