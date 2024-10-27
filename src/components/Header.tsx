import { Calculator } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Calculator className="w-10 h-10 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900">A/B Test Calculator</h1>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Calculate statistical significance, conversion rates, and plan your A/B tests with confidence
      </p>
    </div>
  );
}