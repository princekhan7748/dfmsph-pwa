import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import { CalculationOutput } from '../types/dfmsph';
import { LineChart, Shield, Maximize2, RefreshCw } from 'lucide-react';

interface PotentialPlotProps {
  output: CalculationOutput | null;
}

export const PotentialPlot: React.FC<PotentialPlotProps> = ({ output }) => {
  const [showVdf, setShowVdf] = useState(true);
  const [showVc, setShowVc] = useState(true);
  const [showVcent, setShowVcent] = useState(true);
  const [showVtot, setShowVtot] = useState(true);
  const [showVws, setShowVws] = useState(true);

  if (!output) {
    return (
      <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-8 text-center text-gray-500 text-xs font-mono uppercase tracking-widest">
        Awaiting parameter execution to plot interaction potential V(R)...
      </div>
    );
  }

  const { barrier, radialData, systemName, E_cm } = output;

  return (
    <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-3 sm:p-5 shadow-2xl space-y-4 w-full max-w-full min-w-0 overflow-hidden">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2">
            <LineChart className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Nuclear Potential Curve <span className="text-cyan-400 font-mono">V(R)</span></span>
          </h3>
          <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5 flex flex-wrap items-center gap-2">
            <span>System: {systemName} | E_c.m. = {E_cm} MeV</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${
              output.isNativeExecution
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {output.isNativeExecution ? '⚡ Computed via Native C Binary' : '🟢 Computed via JS/TS Math Engine'}
            </span>
          </p>
        </div>

        {/* Visibility Toggles */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono">
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showVtot}
              onChange={e => setShowVtot(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <span className="text-cyan-400 font-bold">V_tot</span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showVdf}
              onChange={e => setShowVdf(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
            <span className="text-cyan-500 opacity-80">V_DF</span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showVc}
              onChange={e => setShowVc(e.target.checked)}
              className="accent-amber-400 rounded"
            />
            <span className="text-amber-400">V_C</span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showVcent}
              onChange={e => setShowVcent(e.target.checked)}
              className="accent-emerald-400 rounded"
            />
            <span className="text-emerald-400">V_cent</span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showVws}
              onChange={e => setShowVws(e.target.checked)}
              className="accent-rose-400 rounded"
            />
            <span className="text-rose-400">V_WS (Fit)</span>
          </label>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] sm:h-[400px] w-full min-w-0 max-w-full overflow-hidden pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={radialData} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.8} />
            <XAxis
              dataKey="R"
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
              label={{ value: 'R (fm)', position: 'insideBottom', offset: -15, fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
            />
            <YAxis
              tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
              label={{ value: 'V(R) (MeV)', angle: -90, position: 'insideLeft', offset: 0, fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
              labelFormatter={(value) => `R = ${value} fm`}
              formatter={(value: any, name: any) => [`${Number(value).toFixed(2)} MeV`, name]}
            />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '0px' }} />

            {/* Zero reference line */}
            <ReferenceLine y={0} stroke="#3f3f46" strokeDasharray="2 2" />

            {/* Coulomb Barrier Marker */}
            <ReferenceLine x={barrier.R_b} stroke="#ef4444" strokeDasharray="4 4" label={{ value: `Rb=${barrier.R_b}fm`, fill: '#ef4444', fontSize: 10, fontFamily: 'monospace' }} />
            <ReferenceDot x={barrier.R_b} y={barrier.V_b} r={5} fill="#ef4444" stroke="#09090b" strokeWidth={2} />

            {showVtot && (
              <Line
                type="monotone"
                dataKey="V_tot"
                name="Total Potential V_tot(R)"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            )}

            {showVdf && (
              <Line
                type="monotone"
                dataKey="V_df"
                name="Direct Folding V_DF(R)"
                stroke="#22d3ee"
                strokeWidth={2}
                strokeDasharray="4 2"
                opacity={0.8}
                dot={false}
              />
            )}

            {showVc && (
              <Line
                type="monotone"
                dataKey="V_c"
                name="Coulomb V_C(R)"
                stroke="#fbbf24"
                strokeWidth={1.5}
                dot={false}
              />
            )}

            {showVcent && (
              <Line
                type="monotone"
                dataKey="V_cent"
                name="Centrifugal V_cent(R)"
                stroke="#10b981"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            )}

            {showVws && (
              <Line
                type="monotone"
                dataKey="V_ws"
                name="Woods-Saxon Fit V_WS(R)"
                stroke="#f43f5e"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Barrier Quick Summary Terminal Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black p-3.5 rounded-lg border border-gray-800 font-mono text-xs">
        <div>
          <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-bold">Coulomb Barrier V_b</span>
          <span className="text-cyan-400 font-bold text-sm">{barrier.V_b} MeV</span>
        </div>
        <div>
          <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-bold">Barrier Radius R_b</span>
          <span className="text-cyan-400 font-bold text-sm">{barrier.R_b} fm</span>
        </div>
        <div>
          <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-bold">Curvature ℏω</span>
          <span className="text-purple-400 font-bold text-sm">{barrier.hbar_omega} MeV</span>
        </div>
        <div>
          <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-bold">Woods-Saxon (V₀, R₀, a)</span>
          <span className="text-amber-400 font-bold text-xs">
            {barrier.V0_ws}, {barrier.R0_ws}, {barrier.a_ws}
          </span>
        </div>
      </div>

    </div>
  );
};
