import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ReactionForm } from './components/ReactionForm';
import { PotentialPlot } from './components/PotentialPlot';
import { DensityPlot } from './components/DensityPlot';
import { BarrierAnalysis } from './components/BarrierAnalysis';
import { CodeViewer } from './components/CodeViewer';
import { PwaRenderGuide } from './components/PwaRenderGuide';
import { TheorySection } from './components/TheorySection';
import { ExportModal } from './components/ExportModal';
import { runDFMSPHCalculation, PRESET_REACTIONS } from './physics/dfmsphEngine';
import { CalculationInput, CalculationOutput, PresetReaction } from './types/dfmsph';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('calculator');
  const [presets, setPresets] = useState<PresetReaction[]>(PRESET_REACTIONS);
  const [input, setInput] = useState<CalculationInput>(PRESET_REACTIONS[0].input);
  const [output, setOutput] = useState<CalculationOutput | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  /* Run calculation ONLY when user clicks Execute / Compute button */
  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      /* Try API call first, fallback to client-side TS engine */
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      if (response.ok) {
        const data = await response.json();
        setOutput(data);
      } else {
        const localResult = runDFMSPHCalculation(input);
        setOutput(localResult);
      }
    } catch (err) {
      /* Client-side fallback for offline PWA operation */
      const localResult = runDFMSPHCalculation(input);
      setOutput(localResult);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSelectPreset = (preset: PresetReaction) => {
    setInput(preset.input);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-200 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        presets={presets}
        onSelectPreset={handleSelectPreset}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Tab 1: Calculator & Potential V(R) */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <ReactionForm
              input={input}
              setInput={setInput}
              onCalculate={handleCalculate}
              isCalculating={isCalculating}
              presets={presets}
              onSelectPreset={handleSelectPreset}
            />
            <PotentialPlot output={output} />
          </div>
        )}

        {/* Tab 2: Density Profiles rho(r) */}
        {activeTab === 'density' && (
          <div className="space-y-6">
            <ReactionForm
              input={input}
              setInput={setInput}
              onCalculate={handleCalculate}
              isCalculating={isCalculating}
              presets={presets}
              onSelectPreset={handleSelectPreset}
            />
            <DensityPlot output={output} />
          </div>
        )}

        {/* Tab 3: Coulomb Barrier & Fusion Penetrability */}
        {activeTab === 'barrier' && (
          <div className="space-y-6">
            <BarrierAnalysis output={output} />
          </div>
        )}

        {/* Tab 4: C Code Viewer & CLI */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <CodeViewer output={output} />
          </div>
        )}

        {/* Tab 5: Render.com & PWA Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <PwaRenderGuide />
          </div>
        )}

        {/* Tab 6: Theory & Math Framework */}
        {activeTab === 'theory' && (
          <div className="space-y-6">
            <TheorySection />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#0c0c0e] py-4 text-center text-[11px] font-mono text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            DFMSPH22 Web GUI PWA • Original C Code by I.I. Gontchar, M.V. Chushnyakova, N.A. Khmyrova (2022)
          </div>
          <div className="flex items-center space-x-3 text-cyan-400">
            <span>Standalone PWA</span>
            <span>•</span>
            <span>Render.com Ready</span>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        output={output}
      />

    </div>
  );
}
