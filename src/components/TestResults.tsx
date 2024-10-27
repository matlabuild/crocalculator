import { BarChart3, Info, Percent, ArrowRight, Trophy, XCircle } from 'lucide-react';
import { type TestResult, type Variant } from '../types';

interface TestResultsProps {
  stats: TestResult[];
  control: Variant;
  variants: Variant[];
}

export function TestResults({ stats, control, variants }: TestResultsProps) {
  const hasWinner = stats.some(stat => stat.isWinner);
  const hasSignificantResult = stats.some(stat => stat.isSignificant);

  return (
    <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Test Results</h2>
      </div>

      <div className="space-y-8">
        {stats.map((stat, index) => {
          const variant = variants[index];
          return (
            <div key={stat.variantId} className="border-b border-gray-100 pb-8 last:border-0">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-full ${variant.colorClass} flex items-center justify-center`}>
                  <span className={`${variant.textColorClass} font-semibold`}>{variant.id}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{variant.label} vs Control</h3>
                {stat.isWinner && (
                  <div className="ml-auto flex items-center gap-1 text-green-600">
                    <Trophy className="w-5 h-5" />
                    <span className="font-medium">Winner</span>
                  </div>
                )}
                {stat.isLoser && (
                  <div className="ml-auto flex items-center gap-1 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Underperforming</span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-700">Conversion Rate Difference</h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.conversionRate > 0 ? '+' : ''}{stat.conversionRate.toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      95% CI: [{stat.confidenceInterval[0].toFixed(2)}%, {stat.confidenceInterval[1].toFixed(2)}%]
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowRight className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-700">Relative Improvement</h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.improvement > 0 ? '+' : ''}{stat.improvement.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${stat.isSignificant ? (stat.isWinner ? 'bg-green-50' : 'bg-red-50') : 'bg-yellow-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Info className={`w-5 h-5 ${stat.isSignificant ? (stat.isWinner ? 'text-green-600' : 'text-red-600') : 'text-yellow-600'}`} />
                      <h4 className="font-semibold text-gray-700">Statistical Significance</h4>
                    </div>
                    <p className={`text-lg font-semibold ${
                      stat.isSignificant 
                        ? (stat.isWinner ? 'text-green-700' : 'text-red-700')
                        : 'text-yellow-700'
                    }`}>
                      {stat.isSignificant ? (stat.isWinner ? 'Significantly Better' : 'Significantly Worse') : 'Not Statistically Significant'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Z-Score: {Math.abs(stat.zScore).toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Conversion Rates</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Control: {((control.conversions / control.visitors) * 100).toFixed(2)}%
                        <span className="text-gray-400 ml-2">
                          ({control.conversions.toLocaleString()} / {control.visitors.toLocaleString()})
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {variant.label}: {((variant.conversions / variant.visitors) * 100).toFixed(2)}%
                        <span className="text-gray-400 ml-2">
                          ({variant.conversions.toLocaleString()} / {variant.visitors.toLocaleString()})
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Overall Recommendation</h3>
          <p className="text-gray-600">
            {hasWinner 
              ? "You have a winning variant! Consider implementing the changes from the winning variant to improve your conversion rate."
              : hasSignificantResult
                ? "Some variants are underperforming. Consider stopping these variants and focusing on new test ideas."
                : "No statistically significant results yet. Continue running the test or consider increasing traffic to the variants."}
          </p>
        </div>
      </div>
    </div>
  );
}