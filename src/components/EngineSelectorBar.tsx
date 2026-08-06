import React from 'react';
import { Cpu, Terminal, CheckCircle2, Zap, AlertTriangle, Sparkles, ShieldCheck, XCircle } from 'lucide-react';
import { CalculationOutput } from '../types/dfmsph';

interface EngineSelectorBarProps {
  selectedEngine: 'ts' | 'c';
  setSelectedEngine: (engine: 'ts' | 'c') => void;
  cEngineAvailable: boolean;
  output: CalculationOutput | null;
  isCalculating: boolean;
}

export const EngineSelectorBar: React.FC<EngineSelectorBarProps> = ({
  selectedEngine,
  setSelectedEngine,
  cEngineAvailable,
  output,
  isCalculating
}) => {
  return (
    <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-3 sm:p-4 shadow-2xl space-y-3 w-full overflow-hidden">
      
      {/* Engine Selection Bar Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Side Title & Info */}
        <div className="flex items-start sm:items-center space-x-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 shadow-inner mt-0.5 sm:mt-0">
            {selectedEngine === 'c' ? (
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            ) : (
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Calculation Engine Selection
              </h2>
              <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded font-mono font-bold uppercase border shrink-0 ${
                selectedEngine === 'c'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-700'
              }`}>
                {selectedEngine === 'c' ? 'C Binary Active' : 'JS/TS Active'}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">
              Choose your computing engine. You can switch between JS/TS Math Engine and the native C code (<code className="text-cyan-300 font-mono">dfmsph22.c</code>).
            </p>
          </div>
        </div>

        {/* Engine Selection Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full lg:w-auto shrink-0">
          
          {/* JS / TS Engine Button (Default) */}
          <button
            onClick={() => setSelectedEngine('ts')}
            className={`flex items-center justify-between space-x-2 px-3 py-2 rounded-lg border transition-all text-left ${
              selectedEngine === 'ts'
                ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-gray-900/80 hover:bg-gray-800/80 border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2 min-w-0">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedEngine === 'ts' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-bold tracking-tight uppercase font-mono flex items-center space-x-1">
                  <span className="truncate">JS / TS Engine</span>
                  {selectedEngine === 'ts' && (
                    <span className="text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1 py-0.2 rounded uppercase font-bold shrink-0">
                      ON
                    </span>
                  )}
                </div>
                <div className="text-[9px] sm:text-[10px] text-gray-400 font-mono truncate">
                  TypeScript Simulation
                </div>
              </div>
            </div>
            <span className="text-[8px] sm:text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0">
              AVAILABLE
            </span>
          </button>

          {/* C Compiler Engine Button */}
          <button
            onClick={() => setSelectedEngine('c')}
            className={`flex items-center justify-between space-x-2 px-3 py-2 rounded-lg border transition-all text-left relative overflow-hidden ${
              selectedEngine === 'c'
                ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                : cEngineAvailable
                ? 'bg-gray-900 border-cyan-500/40 text-cyan-200 hover:bg-cyan-950/30 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                : 'bg-gray-900/60 hover:bg-gray-800/80 border-rose-900/40 text-gray-400'
            }`}
          >
            <div className="flex items-center space-x-2 min-w-0">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedEngine === 'c' ? 'bg-cyan-400 animate-pulse' : cEngineAvailable ? 'bg-cyan-500' : 'bg-rose-500'}`} />
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-bold tracking-tight uppercase font-mono flex items-center space-x-1">
                  <span className="truncate">C Compiler Engine</span>
                  {selectedEngine === 'c' && (
                    <span className="text-[8px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1 py-0.2 rounded uppercase font-bold shrink-0">
                      ON
                    </span>
                  )}
                </div>
                <div className="text-[9px] sm:text-[10px] text-gray-400 font-mono truncate">
                  DFMSPH22 C Binary
                </div>
              </div>
            </div>

            {/* Availability Highlight Badge (AVAILABLE vs UNAVAILABLE) */}
            <div className="shrink-0 ml-1">
              {cEngineAvailable ? (
                <span className="text-[8px] sm:text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-500/60 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider flex items-center space-x-1 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400 animate-pulse shrink-0" />
                  <span>C AVAILABLE</span>
                </span>
              ) : (
                <span className="text-[8px] sm:text-[9px] bg-rose-950/80 text-rose-300 border border-rose-800/80 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider flex items-center space-x-1">
                  <XCircle className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                  <span>C UNAVAILABLE</span>
                </span>
              )}
            </div>
          </button>

        </div>

      </div>

      {/* Active Engine Live Banner */}
      <div className={`p-3 rounded-lg border font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-all ${
        selectedEngine === 'c'
          ? 'bg-cyan-950/30 border-cyan-800/80 text-cyan-200'
          : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
      }`}>
        <div className="flex items-center space-x-2.5">
          {selectedEngine === 'c' ? (
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <div>
            <span className="font-bold uppercase tracking-wider">
              Currently Active Engine:
            </span>{' '}
            <span className="underline decoration-dashed font-semibold">
              {selectedEngine === 'c'
                ? 'Native C Compiler Engine (dfmsph22.c -> gcc binary)'
                : 'JavaScript / TypeScript Engine (dfmsphEngine.ts)'}
            </span>
          </div>
        </div>

        {/* Realtime C Engine Availability & Verification status */}
        <div className="text-[10px] text-gray-400 flex items-center space-x-3 self-end sm:self-auto border-t sm:border-t-0 border-gray-800 pt-1 sm:pt-0">
          <div className="flex items-center space-x-1">
            <span className="text-gray-500 uppercase">C Engine Status:</span>
            {cEngineAvailable ? (
              <span className="text-cyan-400 font-bold bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                ✓ Available
              </span>
            ) : (
              <span className="text-rose-400 font-bold bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">
                ✕ Unavailable (TS Fallback)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-gray-500 uppercase">Last Execution:</span>
            {isCalculating ? (
              <span className="text-amber-400 animate-pulse font-bold">Computing...</span>
            ) : output ? (
              output.isNativeExecution ? (
                <span className="text-cyan-400 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>Native C Binary Output</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>JS / TS Engine Output</span>
                </span>
              )
            ) : (
              <span className="text-gray-500">Ready</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

