import { type Variant } from '../types';

interface VariantCardProps {
  variant: Variant;
  onUpdate: (updates: Partial<Variant>) => void;
}

export function VariantCard({ variant, onUpdate }: VariantCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className={`w-8 h-8 rounded-full ${variant.colorClass} flex items-center justify-center`}>
          <span className={`${variant.textColorClass} font-semibold`}>{variant.id}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{variant.label}</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Visitors
          </label>
          <input
            type="number"
            value={variant.visitors || ''}
            onChange={(e) => onUpdate({ visitors: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter number of visitors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conversions
          </label>
          <input
            type="number"
            value={variant.conversions || ''}
            onChange={(e) => onUpdate({ conversions: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter number of conversions"
          />
        </div>
        <div className="pt-2">
          <p className="text-sm text-gray-600">
            Conversion Rate: {variant.visitors ? ((variant.conversions / variant.visitors) * 100).toFixed(2) : '0'}%
          </p>
        </div>
      </div>
    </div>
  );
}