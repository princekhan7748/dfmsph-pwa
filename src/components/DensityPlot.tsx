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
import { Layers, Info } from 'lucide-react';

interface DensityPlotProps {
  output: CalculationOutput | null;
}

export const DensityPlot: React.FC<DensityPlotProps> = ({ output }) => {
  if (!output) {
    return (
      <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-8 text-center text-gray-500 text-xs font-mono uppercase tracking-widest">
        Awaiting calculation to display nuclear density distribution profiles...
      </div>
    );
  }

  const { densityData, systemName } = output;

  return (
    <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-5 shadow-2xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Nuclear Density Distributions <span className="text-cyan-400 font-mono">ρ(r)</span></span>
          </h3>
          <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">
            Matter density profiles normalized to mass number A (∫ 4πr²ρ(r)dr = A)
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[380px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={densityData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.8} />
            <XAxis
              dataKey="r"
              type="number"
              domain={[0, 14]}
              tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
              label={{ value: 'r (fm)', position: 'insideBottom', offset: -15, fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
            />
            <YAxis
              tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
              label={{ value: 'ρ(r) (fm⁻³)', angle: -90, position: 'insideLeft', offset: 0, fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
              labelFormatter={(value) => `r = ${value} fm`}
              formatter={(value: any, name: any) => [`${Number(value).toFixed(5)} fm⁻³`, name]}
            />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />

            {/* Saturation Density Reference Line ~ 0.17 fm^-3 */}
            <ReferenceLine y={0.17} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'ρ₀ ≈ 0.17 fm⁻³', fill: '#f59e0b', fontSize: 10, fontFamily: 'monospace' }} />

            <Line
              type="monotone"
              dataKey="rho_proj"
              name="Projectile Density ρ₁(r)"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />

            <Line
              type="monotone"
              dataKey="rho_targ"
              name="Target Density ρ₂(r)"
              stroke="#c084fc"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Terminal Info Box */}
      <div className="flex items-start space-x-3 bg-black p-3.5 rounded-lg border border-gray-800 text-xs font-mono text-gray-400">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <p className="leading-relaxed text-[11px]">
          DFMSPH22 transforms these spherical density profiles <span className="text-cyan-400 font-bold">ρ̃(q)</span> into momentum space via Fourier-Bessel integrals to fold with effective NN force <span className="text-purple-400 font-bold">ṽ_NN(q)</span>.
        </p>
      </div>

    </div>
  );
};
