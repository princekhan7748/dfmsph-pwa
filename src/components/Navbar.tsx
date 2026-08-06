import React, { useState, useEffect } from 'react';
import { 
  Atom, 
  Cpu, 
  LineChart, 
  Code2, 
  Download, 
  BookOpen, 
  Server, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { PresetReaction } from '../types/dfmsph';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  presets: PresetReaction[];
  onSelectPreset: (preset: PresetReaction) => void;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  presets,
  onSelectPreset,
  onOpenExport
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0e] border-b border-gray-800 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('calculator')}>
            <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
              <span className="text-[#09090b] font-bold text-xs italic">DF</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-bold tracking-tight text-white uppercase">
                  DFMSPH22 <span className="text-gray-500 font-normal text-xs">v1.0.4</span>
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-gray-900 text-cyan-400 border border-gray-800 uppercase tracking-widest font-mono">
                  CPC 2022
                </span>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest hidden sm:block">
                Double Folding Potential Calculator
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#09090b] p-1 rounded-lg border border-gray-800">
            {[
              { id: 'calculator', label: 'Potential V(R)', icon: LineChart },
              { id: 'density', label: 'Densities ρ(r)', icon: Layers },
              { id: 'barrier', label: 'Coulomb Barrier', icon: Sparkles },
              { id: 'code', label: 'C Code & CLI', icon: Code2 },
              { id: 'guide', label: 'Render & PWA', icon: Server },
              { id: 'theory', label: 'Theory', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                    active
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status Badges & Controls */}
          <div className="flex items-center space-x-4">
            
            {/* Render Status Light */}
            <div className="hidden xl:flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              <span className="text-[10px] text-gray-400 font-mono uppercase">RENDER_INSTANCE: STABLE</span>
            </div>

            {/* Offline PWA Badge */}
            <div className="hidden xl:flex items-center space-x-2 border-l border-gray-800 pl-4">
              <span className="text-[10px] text-gray-500 uppercase">PWA STATUS:</span>
              <span className="text-[10px] text-cyan-400 font-bold uppercase font-mono">Offline Ready</span>
            </div>

            {/* Export Data Button */}
            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 transition-colors"
              title="Export Output Files (.dat, .csv, .json, .in)"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* PWA Install Button */}
            {deferredPrompt && !isInstalled && (
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded bg-cyan-600 hover:bg-cyan-500 text-[#09090b] shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}

            {/* Preset Selector */}
            <div className="relative">
              <select
                onChange={(e) => {
                  const selected = presets.find((p) => p.id === e.target.value);
                  if (selected) onSelectPreset(selected);
                }}
                className="bg-gray-900 hover:bg-gray-850 text-cyan-400 text-xs font-mono py-1 px-2.5 rounded border border-gray-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  Presets...
                </option>
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-gray-800 bg-[#09090b] py-1.5 px-1 overflow-x-auto">
        {[
          { id: 'calculator', label: 'Potential', icon: LineChart },
          { id: 'density', label: 'Densities', icon: Layers },
          { id: 'barrier', label: 'Barrier', icon: Sparkles },
          { id: 'code', label: 'C Code', icon: Code2 },
          { id: 'guide', label: 'Deploy', icon: Server },
          { id: 'theory', label: 'Theory', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center px-2 py-1 rounded text-[10px] uppercase font-mono tracking-wider transition-colors ${
                active ? 'text-cyan-400 font-bold bg-gray-900' : 'text-gray-500'
              }`}
            >
              <Icon className="w-3.5 h-3.5 mb-0.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
