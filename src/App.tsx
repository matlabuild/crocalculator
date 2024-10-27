import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { VariantCard } from './components/VariantCard';
import { TestResults } from './components/TestResults';
import { SampleSizeCalculator } from './components/SampleSizeCalculator';
import { type TabType, type Variant, type TestResult, type SampleSizeParams } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [variants, setVariants] = useState<Variant[]>([
    { id: 'A', label: 'Control', visitors: 0, conversions: 0, colorClass: 'bg-blue-100', textColorClass: 'text-blue-600' },
    { id: 'B', label: 'Test', visitors: 0, conversions: 0, colorClass: 'bg-green-100', textColorClass: 'text-green-600' },
  ]);
  const [sampleSizeParams, setSampleSizeParams] = useState<SampleSizeParams>({
    baselineConversion: 5,
    minimumDetectableEffect: 20,
    confidenceLevel: 95,
    statisticalPower: 80,
  });

  const addVariant = () => {
    if (variants.length >= 4) return;
    
    const variantId = String.fromCharCode(65 + variants.length);
    const colors = [
      { bg: 'bg-purple-100', text: 'text-purple-600' },
      { bg: 'bg-orange-100', text: 'text-orange-600' },
    ];
    const colorIndex = (variants.length - 2) % colors.length;
    
    setVariants([
      ...variants,
      {
        id: variantId,
        label: `Variant ${variantId}`,
        visitors: 0,
        conversions: 0,
        colorClass: colors[colorIndex].bg,
        textColorClass: colors[colorIndex].text,
      },
    ]);
  };

  const updateVariant = (index: number, updates: Partial<Variant>) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], ...updates };
    setVariants(newVariants);
  };

  const calculateStats = useMemo((): TestResult[] => {
    const control = variants[0];
    if (!control.visitors) return [];

    // Calculate all z-scores first
    const results = variants.slice(1).map(variant => {
      const rateA = control.conversions / control.visitors;
      const rateB = variant.conversions / variant.visitors;
      
      const seA = Math.sqrt((rateA * (1 - rateA)) / control.visitors);
      const seB = Math.sqrt((rateB * (1 - rateB)) / variant.visitors);
      const seDiff = Math.sqrt(seA * seA + seB * seB);
      
      const zScore = (rateB - rateA) / seDiff;
      const marginOfError = 1.96 * seDiff;
      const improvement = ((rateB - rateA) / rateA) * 100;
      
      return {
        variantId: variant.id,
        conversionRate: (rateB - rateA) * 100,
        confidenceInterval: [
          (rateB - rateA - marginOfError) * 100,
          (rateB - rateA + marginOfError) * 100
        ],
        improvement,
        significanceLevel: (1 - 0.95) * 100,
        zScore,
        isSignificant: Math.abs(zScore) > 1.96,
        isWinner: false, // Will be set after comparing all variants
        isLoser: false, // Will be set after comparing all variants
      };
    });

    // Find the highest z-score among significant results
    const significantResults = results.filter(r => r.isSignificant);
    const highestZScore = Math.max(...significantResults.map(r => r.zScore));

    // Update winner/loser status
    return results.map(result => ({
      ...result,
      isWinner: result.isSignificant && result.zScore > 1.96 && result.zScore === highestZScore,
      isLoser: result.isSignificant && result.zScore < -1.96,
    }));
  }, [variants]);

  const requiredSampleSize = useMemo(() => {
    const { baselineConversion, minimumDetectableEffect, confidenceLevel, statisticalPower } = sampleSizeParams;
    
    const p1 = baselineConversion / 100;
    const mde = minimumDetectableEffect / 100;
    const p2 = p1 * (1 + mde);
    
    const zAlpha = confidenceLevel === 99 ? 2.576 : confidenceLevel === 95 ? 1.96 : 1.645;
    const zBeta = statisticalPower === 99 ? 2.326 : statisticalPower === 95 ? 1.645 : statisticalPower === 90 ? 1.282 : 0.842;
    
    const p = (p1 + p2) / 2;
    
    return Math.ceil(
      (2 * p * (1 - p) * Math.pow(zAlpha + zBeta, 2)) /
      Math.pow(p2 - p1, 2)
    );
  }, [sampleSizeParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Header />
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'pre-test' ? (
          <SampleSizeCalculator
            params={sampleSizeParams}
            onParamsChange={(updates) => setSampleSizeParams(prev => ({ ...prev, ...updates }))}
            requiredSampleSize={requiredSampleSize}
            variantCount={variants.length}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {variants.map((variant, index) => (
                <VariantCard
                  key={variant.id}
                  variant={variant}
                  onUpdate={(updates) => updateVariant(index, updates)}
                />
              ))}
              
              {variants.length < 4 && (
                <button
                  onClick={addVariant}
                  className="h-[280px] bg-white bg-opacity-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-700 hover:border-gray-400 hover:bg-opacity-60 transition-colors"
                >
                  <Plus className="w-8 h-8" />
                  <span className="font-medium">Add Variant</span>
                </button>
              )}
            </div>

            {calculateStats.length > 0 && variants[0].visitors > 0 && (
              <TestResults 
                stats={calculateStats}
                control={variants[0]}
                variants={variants.slice(1)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;