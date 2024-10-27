import { Users, Target } from 'lucide-react';
import { type SampleSizeParams } from '../types';

interface SampleSizeCalculatorProps {
  params: SampleSizeParams;
  onParamsChange: (updates: Partial<SampleSizeParams>) => void;
  requiredSampleSize: number;
  variantCount: number;
}

export function SampleSizeCalculator({ 
  params, 
  onParamsChange, 
  requiredSampleSize,
  variantCount 
}: SampleSizeCalculatorProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Pre-test Sample Size Calculator</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Baseline Conversion Rate (%)
            </label>
            <input
              type="number"
              value={params.baselineConversion}
              onChange={(e) => onParamsChange({ baselineConversion: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter baseline conversion rate"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Detectable Effect (%)
            </label>
            <input
              type="number"
              value={params.minimumDetectableEffect}
              onChange={(e) => onParamsChange({ minimumDetectableEffect: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter minimum detectable effect"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confidence Level (%)
            </label>
            <select
              value={params.confidenceLevel}
              onChange={(e) => onParamsChange({ confidenceLevel: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={90}>90%</option>
              <option value={95}>95%</option>
              <option value={99}>99%</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statistical Power (%)
            </label>
            <select
              value={params.statisticalPower}
              onChange={(e) => onParamsChange({ statisticalPower: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={80}>80%</option>
              <option value={90}>90%</option>
              <option value={95}>95%</option>
              <option value={99}>99%</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-700">Required Sample Size</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {requiredSampleSize.toLocaleString()} visitors per variant
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Total required: {(requiredSampleSize * variantCount).toLocaleString()} visitors
        </p>
      </div>
    </div>
  );
}