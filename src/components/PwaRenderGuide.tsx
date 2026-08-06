import React from 'react';
import { Server, Smartphone, CheckCircle, ShieldCheck, Terminal, Layers, Globe, ExternalLink, Cpu } from 'lucide-react';

export const PwaRenderGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-6 shadow-2xl">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
            <Server className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Render.com & PWA Deployment Architecture
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Full-stack Express + Vite server with embedded C program engine, offline service worker caching, and multi-stage Docker build.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Render Setup & PWA Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Render.com Config Card */}
        <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Render.com Blueprint Configuration</h3>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            The app includes a verified <span className="font-mono text-cyan-400">render.yaml</span> blueprint, <span className="font-mono text-purple-400">Dockerfile</span> with GCC C-compiler integration, and <span className="font-mono text-amber-400">Procfile</span>.
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center space-x-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-Stage Dockerfile with GCC standard C99 compiler</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Express + Vite production server bundled with esbuild</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dynamic PORT binding ($PORT or 3000) for Cloud Run & Render</span>
            </div>
          </div>

          <div className="bg-black p-3 rounded-lg border border-gray-800 font-mono text-[11px] text-gray-300">
            <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">render.yaml</div>
            <pre className="text-cyan-400">{`services:
  - type: web
    name: dfmsph22-pwa
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start`}</pre>
          </div>
        </div>

        {/* Progressive Web App Card */}
        <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
            <Smartphone className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Progressive Web App (PWA) Capabilities</h3>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            DFMSPH22 is fully equipped with an offline Service Worker (<span className="font-mono text-purple-400">sw.js</span>) and Web App Manifest (<span className="font-mono text-cyan-400">manifest.json</span>).
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center space-x-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Standalone full-screen PWA display mode</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Offline caching for full calculation execution in browser</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Home screen & desktop App installation support</span>
            </div>
          </div>

          <div className="bg-black p-3 rounded-lg border border-gray-800 font-mono text-[11px] text-gray-300">
            <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">manifest.json</div>
            <pre className="text-purple-400">{`{
  "name": "DFMSPH22 Calculator",
  "short_name": "DFMSPH22",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#09090b"
}`}</pre>
          </div>
        </div>

      </div>

    </div>
  );
};
