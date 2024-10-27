import { type TabType } from '../types';

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
        <button
          onClick={() => onTabChange('calculator')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'calculator'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          A/B Test Calculator
        </button>
        <button
          onClick={() => onTabChange('pre-test')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pre-test'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sample Size Calculator
        </button>
      </div>
    </div>
  );
}