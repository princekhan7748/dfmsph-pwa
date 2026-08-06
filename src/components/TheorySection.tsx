import React from 'react';
import { BookOpen, Atom, Layers, Zap, Calculator } from 'lucide-react';

export const TheorySection: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-300">
      
      {/* Title */}
      <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-6 shadow-2xl">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
            <BookOpen className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Double Folding Model (DFM) Theoretical Framework
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Mathematical formulations for nucleus-nucleus interaction potentials and Coulomb barriers in DFMSPH22
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Theory Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Double Folding Integral */}
        <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">1. Double Folding Integral V_DF(R)</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            The microscopic nuclear potential between two colliding spherical nuclei separated by center-of-mass distance <span className="font-mono text-cyan-400">R</span> is obtained by folding effective nucleon-nucleon forces <span className="font-mono text-amber-400">v_NN</span> over the nuclear densities <span className="font-mono text-purple-400">ρ₁</span> and <span className="font-mono text-cyan-400">ρ₂</span>:
          </p>
          <div className="bg-black p-3 rounded-lg border border-gray-800 font-mono text-xs text-cyan-400 overflow-x-auto">
            V_DF(R) = ∫∫ ρ₁(r₁) ρ₂(r₂) v_NN(|R + r₂ - r₁|) d³r₁ d³r₂
          </div>
          <p className="text-xs text-gray-400">
            Using the Fourier-Bessel expansion in spherical coordinates:
          </p>
          <div className="bg-black p-3 rounded-lg border border-gray-800 font-mono text-xs text-purple-400 overflow-x-auto">
            V_DF(R) = (1 / 2π²) ∫₀^∞ q² ρ̃₁(q) ρ̃₂(q) ṽ_NN(q) j₀(qR) dq
          </div>
        </div>

        {/* Effective NN Interactions */}
        <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">2. Effective Nucleon-Nucleon Forces</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            DFMSPH22 supports several widely utilized effective NN interaction parameterizations:
          </p>
          <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside font-mono">
            <li><span className="font-bold text-amber-400">M3Y-Paris & M3Y-Reid:</span> Sum of three Yukawa terms representing short-range repulsion and long-range attraction, plus zero-range exchange term J₀₀(E).</li>
            <li><span className="font-bold text-cyan-400">CDM3Y / DDM3Y:</span> Density-dependent scaling factors F(ρ) accounting for nuclear medium saturation effects.</li>
            <li><span className="font-bold text-purple-400">Migdal & RMF:</span> Relativistic mean field scalar (σ) and vector (ω) meson exchange couplings.</li>
          </ul>
        </div>

        {/* Nuclear Density Models */}
        <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">3. Nuclear Matter Densities ρ(r)</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Standard 2-parameter Fermi (2pF) half-density distribution with radius parameter <span className="font-mono text-cyan-400">c ≈ 1.07 A^{1/3}</span> fm and diffuseness <span className="font-mono text-cyan-400">a ≈ 0.54</span> fm:
          </p>
          <div className="bg-black p-3 rounded-lg border border-gray-800 font-mono text-xs text-emerald-400 overflow-x-auto">
            ρ(r) = ρ₀ / (1 + exp((r - c) / a))
          </div>
        </div>

        {/* Wong Formula for Fusion Cross Sections */}
        <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-2">
            <Atom className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">4. Wong Fusion Cross Section Formula</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            The sub-barrier and above-barrier fusion cross section <span className="font-mono text-cyan-400">σ_f(E)</span> is calculated via Wong&apos;s parabolic barrier formula:
          </p>
          <div className="bg-black p-3 rounded-lg border border-gray-800 font-mono text-xs text-cyan-400 overflow-x-auto">
            σ_f(E) = (ℏω R_b² / 2E) ln(1 + exp(2π(E - V_b) / ℏω))
          </div>
        </div>

      </div>

    </div>
  );
};
