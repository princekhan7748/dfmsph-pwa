import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { CalculationOutput } from '../types/dfmsph';
import { Sparkles, ShieldCheck, Activity, Award, CheckCircle } from 'lucide-react';

interface BarrierAnalysisProps {
  output: CalculationOutput | null;
}

export const BarrierAnalysis: React.FC<BarrierAnalysisProps> = ({ output }) => {
  if (!output) {
    return (
      <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-8 text-center text-gray-500 text-xs font-mono uppercase tracking-widest">
        Awaiting calculation to run Coulomb barrier analysis...
      </div>
    );
  }

  const { barrier, fusionData, systemName, E_cm, reducedMassAmu } = output;

  return (
    <div className="space-y-6">
      
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Barrier Height V_b */}
        <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Sparkles className="w-16 h-16 text-cyan-400" />
          </div>
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">
            Coulomb Barrier Height (V_b)
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-cyan-400 font-mono">{barrier.V_b}</span>
            <span className="text-xs font-mono text-gray-400">MeV</span>
          </div>
          <p className="text-[10px] font-mono text-gray-500 mt-2">
            Potential peak at R_b = {barrier.R_b} fm
          </p>
        </div>

        {/* Barrier Radius R_b */}
        <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Activity className="w-16 h-16 text-cyan-400" />
          </div>
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">
            Barrier Radius (R_b)
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-cyan-400 font-mono">{barrier.R_b}</span>
            <span className="text-xs font-mono text-gray-400">fm</span>
          </div>
          <p className="text-[10px] font-mono text-gray-500 mt-2">
            Radial separation at barrier maximum
          </p>
        </div>

        {/* Curvature hbar_omega */}
        <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <ShieldCheck className="w-16 h-16 text-purple-400" />
          </div>
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">
            Barrier Curvature (ℏω)
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-purple-400 font-mono">{barrier.hbar_omega}</span>
            <span className="text-xs font-mono text-gray-400">MeV</span>
          </div>
          <p className="text-[10px] font-mono text-gray-500 mt-2">
            Inverted parabolic oscillator frequency
          </p>
        </div>

        {/* Woods-Saxon Fit */}
        <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Award className="w-16 h-16 text-amber-400" />
          </div>
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">
            Woods-Saxon Parameterization
          </span>
          <div className="text-xs font-mono text-amber-400 font-bold space-y-0.5">
            <div>V₀ = {barrier.V0_ws} MeV</div>
            <div>R₀ = {barrier.R0_ws} fm</div>
            <div>a  = {barrier.a_ws} fm</div>
          </div>
          <p className="text-[10px] font-mono text-gray-500 mt-1">
            Fitted analytical potential depth
          </p>
        </div>

      </div>

      {/* Wong Formula Fusion Cross-Section Plot */}
      <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Fusion Penetrability & Cross Section <span className="text-cyan-400 font-mono">σ_f(E)</span></span>
            </h3>
            <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">
              Evaluated via Wong formula using barrier metrics (V_b, R_b, ℏω)
            </p>
          </div>
        </div>

        <div className="h-[360px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={fusionData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.8} />
              <XAxis
                dataKey="E_cm"
                type="number"
                domain={['dataMin', 'dataMax']}
                tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                label={{ value: 'E_cm (MeV)', position: 'insideBottom', offset: -15, fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                label={{ value: 'σ_f (mb)', angle: -90, position: 'insideLeft', offset: 0, fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 1]}
                tick={{ fill: '#06b6d4', fontSize: 10, fontFamily: 'monospace' }}
                label={{ value: 'P(E)', angle: 90, position: 'insideRight', offset: 0, fill: '#06b6d4', fontSize: 11, fontFamily: 'monospace' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                labelFormatter={(value) => `E_cm = ${value} MeV`}
              />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />

              {/* Barrier Energy vertical marker */}
              <ReferenceLine yAxisId="left" x={barrier.V_b} stroke="#ef4444" strokeDasharray="4 4" label={{ value: `Vb=${barrier.V_b}MeV`, fill: '#ef4444', fontSize: 10, fontFamily: 'monospace' }} />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="crossSectionMb"
                name="Fusion Cross Section σ_f (mb)"
                stroke="#c084fc"
                strokeWidth={3}
                dot={false}
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="penetrability"
                name="Barrier Penetrability P(E)"
                stroke="#06b6d4"
                strokeWidth={2}
                strokeDasharray="4 2"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
