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
  selectedEngine?: 'ts' | 'c';
}

export const ReactionForm: React.FC<ReactionFormProps> = ({
  input,
  setInput,
  onCalculate,
  isCalculating,
  presets,
  onSelectPreset,
  selectedEngine = 'ts'
}) => {
  const [showTuning, setShowTuning] = React.useState<boolean>(false);

  const resetTuningDefaults = () => {
    setInput(prev => ({
      ...prev,
      k_up: 3.0,
      Crup: 1.5,
      eps_iter: 0.0001,
      iter_up: 30,
      r00: 1.2,
      dr_density: 0.1,
      rMax_density: 10.0,
      key_ex: 1,
      key_C: 1,
      vNN_scale: 1.0
    }));
  };

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

      {/* Advanced DFMSPH Numerical Tuning Parameters Toggle */}
      <div className="bg-[#09090b] rounded-lg border border-gray-800 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTuning(!showTuning)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white hover:bg-gray-900/60 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-amber-400">DFMSPH Numerical & Physics Tuning Parameters</span>
            <span className="text-[10px] text-gray-500 font-normal border border-gray-800 rounded px-1.5 py-0.5">
              k_up, Crup, eps_iter, r00, dr, key_ex, key_C
            </span>
          </div>
          <span className="text-amber-400 font-bold text-sm">{showTuning ? '−' : '+'}</span>
        </button>

        {showTuning && (
          <div className="p-4 border-t border-gray-800/80 bg-black/40 space-y-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 border-b border-gray-800/60 pb-2">
              <span>Tune double-folding integral cutoffs, iteration accuracy, and interaction switches</span>
              <button
                type="button"
                onClick={resetTuningDefaults}
                className="text-[10px] text-amber-400 hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset DFMSPH Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Momentum Cutoff k_up */}
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1" title="Momentum-space integral cutoff k_up (fm^-1)">
                  Momentum Cutoff k_up (fm⁻¹)
                </label>
                <input
                  type="number"
                  step="0.2"
                  value={input.k_up ?? 3.0}
                  onChange={e => setInput(prev => ({ ...prev, k_up: parseFloat(e.target.value) || 3.0 }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-amber-400 font-mono outline-none focus:border-amber-500"
                />
              </div>

              {/* Density Cutoff Crup */}
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1" title="Real-space density integration cutoff multiplier Crup">
                  Density Cutoff Crup (× r_bar)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={input.Crup ?? 1.5}
                  onChange={e => setInput(prev => ({ ...prev, Crup: parseFloat(e.target.value) || 1.5 }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-amber-400 font-mono outline-none focus:border-amber-500"
                />
              </div>

              {/* Convergence eps_iter */}
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1" title="Exchange iteration convergence threshold eps_iter">
                  Iteration Tolerance ε_iter
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={input.eps_iter ?? 0.0001}
                  onChange={e => setInput(prev => ({ ...prev, eps_iter: parseFloat(e.target.value) || 0.0001 }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-amber-400 font-mono outline-none focus:border-amber-500"
                />
              </div>

              {/* Max Exchange Iterations iter_up */}
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1" title="Max exchange iteration steps iter_up">
                  Max Iterations iter_up
                </label>
                <input
                  type="number"
                  value={input.iter_up ?? 30}
                  onChange={e => setInput(prev => ({ ...prev, iter_up: parseInt(e.target.value) || 30 }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-amber-400 font-mono outline-none focus:border-amber-500"
                />
              </div>

              {/* Nuclear Radius Parameter r00 */}
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1" title="Nuclear radius parameter r00 (fm) for R0 = r00 * A^(1/3)">
                  Nuclear Radius r00 (fm)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={input.r00 ?? 1.20}
                  onChange={e => setInput(prev => ({ ...prev, r00: parseFloat(e.target.value) || 1.2 }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-amber-400 font-mono outline-none focus:border-amber-500"
                />
              </div>

              {/* Density Table Step dr */}
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1" title="Density grid step size dr in fm for inp_rhoP.c & inp_rhoT.c">
                  Density Table Step dr (fm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={input.dr_density ?? 0.10}
                  onChange={e => setInput(prev => ({ ...prev, dr_density: parseFloat(e.target.value) || 0.10 }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-amber-400 font-mono outline-none focus:border-amber-500"
                />
              </div>

              {/* Knock-on Exchange Switch key_ex */}
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">
                  Exchange Term (key_ex)
                </label>
                <select
                  value={input.key_ex ?? 1}
                  onChange={e => setInput(prev => ({ ...prev, key_ex: parseInt(e.target.value) ?? 1 }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-200 font-mono outline-none focus:border-amber-500"
                >
                  <option value={1}>1: Knock-on Exchange Included</option>
                  <option value={0}>0: Direct Potential Only</option>
                </select>
              </div>

              {/* Coulomb Potential Switch key_C */}
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">
                  Coulomb Potential (key_C)
                </label>
                <select
                  value={input.key_C ?? 1}
                  onChange={e => setInput(prev => ({ ...prev, key_C: parseInt(e.target.value) ?? 1 }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-200 font-mono outline-none focus:border-amber-500"
                >
                  <option value={1}>1: Folded/Charge Coulomb</option>
                  <option value={0}>0: Nuclear Potential Only</option>
                </select>
              </div>

              {/* Potential Strength Scale Factor vNN_scale */}
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1" title="Overall potential strength scale factor N_v">
                  Potential Scale N_v
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={input.vNN_scale ?? 1.0}
                  onChange={e => setInput(prev => ({ ...prev, vNN_scale: parseFloat(e.target.value) || 1.0 }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-xs text-amber-400 font-mono outline-none focus:border-amber-500"
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Calculate Button */}
      <div className="pt-1">
        <button
          onClick={onCalculate}
          disabled={isCalculating}
          className={`w-full font-bold text-xs py-3 rounded uppercase tracking-widest transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 ${
            selectedEngine === 'c'
              ? 'bg-cyan-500 hover:bg-cyan-400 text-[#09090b] shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-emerald-500 hover:bg-emerald-400 text-[#09090b] shadow-[0_0_15px_rgba(16,185,129,0.3)]'
          }`}
        >
          {isCalculating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-[#09090b]/30 border-t-[#09090b] rounded-full animate-spin" />
              <span>Computing Double Folding Potential ({selectedEngine === 'c' ? 'Native C Binary' : 'JS/TS Engine'})...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-[#09090b]" />
              <span>Compute Double Folding Potential ({selectedEngine === 'c' ? '⚡ Native C Compiler Engine' : '🟢 JS/TS Math Engine'})</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
