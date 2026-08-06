import React from 'react';
import { 
  Play, 
  RotateCcw, 
  Layers, 
  Zap, 
  Settings2, 
  Sliders, 
  Atom, 
  Database 
} from 'lucide-react';
import { CalculationInput, NNInteractionType, DensityType, PresetReaction } from '../types/dfmsph';

interface ReactionFormProps {
  input: CalculationInput;
  setInput: React.Dispatch<React.SetStateAction<CalculationInput>>;
  onCalculate: () => void;
  isCalculating: boolean;
  presets: PresetReaction[];
  onSelectPreset: (preset: PresetReaction) => void;
}

export const ReactionForm: React.FC<ReactionFormProps> = ({
  input,
  setInput,
  onCalculate,
  isCalculating,
  presets,
  onSelectPreset
}) => {

  const handleProjChange = (field: string, value: any) => {
    setInput(prev => ({
      ...prev,
      proj: { ...prev.proj, [field]: value }
    }));
  };

  const handleTargChange = (field: string, value: any) => {
    setInput(prev => ({
      ...prev,
      targ: { ...prev.targ, [field]: value }
    }));
  };

  /* Auto estimate c parameter for Fermi density */
  const autoEstimateParams = (isProj: boolean) => {
    if (isProj) {
      const c = Number((1.07 * Math.pow(input.proj.A, 1 / 3)).toFixed(3));
      handleProjChange('c', c);
      handleProjChange('a', 0.54);
    } else {
      const c = Number((1.07 * Math.pow(input.targ.A, 1 / 3)).toFixed(3));
      handleTargChange('c', c);
      handleTargChange('a', 0.54);
    }
  };

  const E_cm = Number(((input.energyLab * input.targ.A) / (input.proj.A + input.targ.A)).toFixed(2));
  const mu_amu = Number(((input.proj.A * input.targ.A) / (input.proj.A + input.targ.A)).toFixed(3));

  return (
    <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-5 shadow-2xl space-y-5">
      
      {/* Header & Presets */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Atom className="w-4 h-4 text-cyan-400" />
            <span>Nuclear Reaction Setup & Parameters</span>
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Colliding spherical nuclei, density distributions, and effective NN interaction force
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 flex items-center space-x-1 mr-1">
            <Database className="w-3 h-3 text-cyan-400" />
            <span>Presets:</span>
          </span>
          {presets.slice(0, 4).map(p => (
            <button
              key={p.id}
              onClick={() => onSelectPreset(p)}
              className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Target & Projectile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Projectile Nucleus (1) */}
        <div className="bg-[#09090b] rounded-lg p-4 border border-gray-800 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]"></span>
              <span>Projectile Nucleus (A1)</span>
            </span>
            <button
              onClick={() => autoEstimateParams(true)}
              className="text-[10px] text-cyan-400 hover:underline font-mono uppercase tracking-wider"
            >
              Auto-Estimate (c, a)
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={input.proj.name}
                onChange={e => handleProjChange('name', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Atomic (Z₁)</label>
              <input
                type="number"
                value={input.proj.Z}
                onChange={e => handleProjChange('Z', parseInt(e.target.value) || 1)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Mass (A₁)</label>
              <input
                type="number"
                value={input.proj.A}
                onChange={e => handleProjChange('A', parseInt(e.target.value) || 1)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Density</label>
              <select
                value={input.proj.densityType}
                onChange={e => handleProjChange('densityType', e.target.value as DensityType)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-300 font-mono outline-none focus:border-cyan-500"
              >
                <option value="2pf">2-Param Fermi (2pF)</option>
                <option value="3pf">3-Param Fermi (3pF)</option>
                <option value="ho">Harmonic Osc (HO)</option>
                <option value="gauss">Gaussian</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Radius c (fm)</label>
              <input
                type="number"
                step="0.01"
                value={input.proj.c}
                onChange={e => handleProjChange('c', parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Diffuseness a (fm)</label>
              <input
                type="number"
                step="0.01"
                value={input.proj.a}
                onChange={e => handleProjChange('a', parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Target Nucleus (2) */}
        <div className="bg-[#09090b] rounded-lg p-4 border border-gray-800 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.6)]"></span>
              <span>Target Nucleus (A₂)</span>
            </span>
            <button
              onClick={() => autoEstimateParams(false)}
              className="text-[10px] text-purple-400 hover:underline font-mono uppercase tracking-wider"
            >
              Auto-Estimate (c, a)
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={input.targ.name}
                onChange={e => handleTargChange('name', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Atomic (Z₂)</label>
              <input
                type="number"
                value={input.targ.Z}
                onChange={e => handleTargChange('Z', parseInt(e.target.value) || 1)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Mass (A₂)</label>
              <input
                type="number"
                value={input.targ.A}
                onChange={e => handleTargChange('A', parseInt(e.target.value) || 1)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Density</label>
              <select
                value={input.targ.densityType}
                onChange={e => handleTargChange('densityType', e.target.value as DensityType)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-300 font-mono outline-none focus:border-purple-500"
              >
                <option value="2pf">2-Param Fermi (2pF)</option>
                <option value="3pf">3-Param Fermi (3pF)</option>
                <option value="ho">Harmonic Osc (HO)</option>
                <option value="gauss">Gaussian</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Radius c (fm)</label>
              <input
                type="number"
                step="0.01"
                value={input.targ.c}
                onChange={e => handleTargChange('c', parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Diffuseness a (fm)</label>
              <input
                type="number"
                step="0.01"
                value={input.targ.a}
                onChange={e => handleTargChange('a', parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Physics & Grid Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-[#09090b] p-3.5 rounded-lg border border-gray-800">
        
        {/* Effective NN Force */}
        <div>
          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1 flex items-center space-x-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Effective Interaction</span>
          </label>
          <select
            value={input.nnType}
            onChange={e => setInput(prev => ({ ...prev, nnType: e.target.value as NNInteractionType }))}
            className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-gray-200 font-mono outline-none focus:border-cyan-500"
          >
            <option value="m3y_paris">M3Y-Paris Effective Force</option>
            <option value="m3y_reid">M3Y-Reid Soft Core</option>
            <option value="cdm3y6">CDM3Y6 Density Dependent</option>
            <option value="ddm3y1">DDM3Y1 Density Dependent</option>
            <option value="migdal">Migdal Interaction Force</option>
            <option value="rmf_nl3">RMF NL3 Relativistic Field</option>
          </select>
        </div>

        {/* Reaction Beam Energy & Ecm */}
        <div>
          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1 flex items-center justify-between">
            <span>Beam E_lab (MeV)</span>
            <span className="text-[10px] text-cyan-400 font-mono">Ecm={E_cm}</span>
          </label>
          <input
            type="number"
            step="0.5"
            value={input.energyLab}
            onChange={e => setInput(prev => ({ ...prev, energyLab: parseFloat(e.target.value) || 1 }))}
            className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-cyan-500"
          />
        </div>

        {/* Angular Momentum L */}
        <div>
          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1">Momentum L (ℏ)</label>
          <input
            type="number"
            value={input.Lwave}
            onChange={e => setInput(prev => ({ ...prev, Lwave: parseInt(e.target.value) || 0 }))}
            className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-cyan-500"
          />
        </div>

        {/* Radial Grid Rmin, Rmax, dR */}
        <div>
          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1">Grid Range R (fm)</label>
          <div className="grid grid-cols-3 gap-1">
            <input
              type="number"
              step="0.5"
              placeholder="Rmin"
              value={input.Rmin}
              onChange={e => setInput(prev => ({ ...prev, Rmin: parseFloat(e.target.value) || 0 }))}
              className="bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-cyan-500"
              title="Minimum R (fm)"
            />
            <input
              type="number"
              step="0.5"
              placeholder="Rmax"
              value={input.Rmax}
              onChange={e => setInput(prev => ({ ...prev, Rmax: parseFloat(e.target.value) || 10 }))}
              className="bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-cyan-500"
              title="Maximum R (fm)"
            />
            <input
              type="number"
              step="0.05"
              placeholder="dR"
              value={input.Rstep}
              onChange={e => setInput(prev => ({ ...prev, Rstep: parseFloat(e.target.value) || 0.1 }))}
              className="bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-cyan-400 font-mono outline-none focus:border-cyan-500"
              title="Step size dR (fm)"
            />
          </div>
        </div>

      </div>

      {/* Calculate Button */}
      <div className="pt-1">
        <button
          onClick={onCalculate}
          disabled={isCalculating}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-[#09090b] font-bold text-xs py-3 rounded uppercase tracking-widest transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isCalculating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-[#09090b]/30 border-t-[#09090b] rounded-full animate-spin" />
              <span>Computing Potential Grid...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-[#09090b]" />
              <span>Compute Double Folding Potential</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
