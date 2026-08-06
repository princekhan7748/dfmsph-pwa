import React, { useState, useEffect } from 'react';
import { Code2, Copy, Download, Check, FileText, Terminal, FileCode, Folder } from 'lucide-react';
import { CalculationOutput } from '../types/dfmsph';

interface CodeViewerProps {
  output: CalculationOutput | null;
}

const C_FILES = [
  { id: 'dfmsph22.c', name: 'dfmsph22.c', desc: 'Master Consolidated C Program' },
  { id: 'dfmsph_def.h', name: 'dfmsph_def.h', desc: 'Header & Global Declarations' },
  { id: 'dfmsph_mai.c', name: 'dfmsph_mai.c', desc: 'Main Routine & Barrier Finder' },
  { id: 'dfmsph_pot.c', name: 'dfmsph_pot.c', desc: 'Folding Integrals & Potentials' },
  { id: 'dfmsph_exc.c', name: 'dfmsph_exc.c', desc: 'Exchange Interaction Kernels' },
  { id: 'dfmsph_inp.c', name: 'dfmsph_inp.c', desc: 'Density & Input File Loader' },
  { id: 'dfmsph_out.c', name: 'dfmsph_out.c', desc: 'Results File Printer' },
  { id: 'dfmsph_fun.c', name: 'dfmsph_fun.c', desc: 'Gauss Knots & Bessel Functions' },
  { id: 'INP_DFMSPH22.c', name: 'INP_DFMSPH22.c', desc: 'Default Reaction Input Parameters' },
  { id: 'INP_NN_forces.c', name: 'INP_NN_forces.c', desc: 'NN Force Constants Table' },
  { id: 'inp_rhoP.c', name: 'inp_rhoP.c', desc: 'Projectile Point Nuclear Density Table' },
  { id: 'inp_rhoT.c', name: 'inp_rhoT.c', desc: 'Target Point Nuclear Density Table' },
  { id: 'output', name: 'dfmsph22.out', desc: 'Calculated Results Output' },
];

export const CodeViewer: React.FC<CodeViewerProps> = ({ output }) => {
  const [selectedFile, setSelectedFile] = useState<string>('dfmsph22.c');
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedFile === 'output') return;
    if (fileContents[selectedFile]) return;

    setLoading(true);
    fetch(`/api/c-code?file=${encodeURIComponent(selectedFile)}`)
      .then((res) => res.text())
      .then((data) => {
        setFileContents((prev) => ({ ...prev, [selectedFile]: data }));
      })
      .catch(() => {
        setFileContents((prev) => ({ ...prev, [selectedFile]: `// Error loading ${selectedFile}` }));
      })
      .finally(() => setLoading(false));
  }, [selectedFile, fileContents]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCurrentContent = () => {
    if (selectedFile === 'output') {
      return output?.cOutputText || '# Run calculation to generate output file';
    }
    return loading ? `// Loading ${selectedFile}...` : (fileContents[selectedFile] || '// Select a file to view code');
  };

  const currentContent = getCurrentContent();
  const currentFilename = selectedFile === 'output' ? 'dfmsph22.out' : selectedFile;

  return (
    <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl p-5 shadow-2xl space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>DFMSPH22 Original C Source Files & Data</span>
          </h3>
          <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">
            CPC double-folding interaction potential software (I.I. Gontchar et al., 2022)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCopy(currentContent)}
            className="flex items-center space-x-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => handleDownload(currentFilename, currentContent)}
            className="flex items-center space-x-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded bg-cyan-600 hover:bg-cyan-500 text-[#09090b] font-bold transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Download {currentFilename}</span>
          </button>
        </div>
      </div>

      {/* Code File Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-800 pb-3">
        {C_FILES.map((file) => {
          const active = selectedFile === file.id;
          return (
            <button
              key={file.id}
              onClick={() => setSelectedFile(file.id)}
              title={file.desc}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-all ${
                active
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-bold shadow-sm'
                  : 'bg-gray-900/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-800/80'
              }`}
            >
              {file.id.endsWith('.h') ? (
                <Folder className="w-3 h-3 text-amber-400" />
              ) : file.id.endsWith('.out') ? (
                <Terminal className="w-3 h-3 text-emerald-400" />
              ) : (
                <FileCode className="w-3 h-3 text-cyan-400" />
              )}
              <span>{file.name}</span>
            </button>
          );
        })}
      </div>

      {/* File Description Sub-header */}
      <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 bg-gray-950 px-3 py-1.5 rounded border border-gray-900">
        <span className="text-cyan-400 font-bold">{selectedFile}</span>
        <span className="text-gray-500 text-[10px]">
          {C_FILES.find((f) => f.id === selectedFile)?.desc}
        </span>
      </div>

      {/* Code Editor Box with Line Numbers */}
      <div className="relative rounded-lg overflow-hidden bg-black border border-gray-800 font-mono text-xs text-gray-300 max-h-[500px] overflow-y-auto">
        <pre className="p-4 leading-relaxed whitespace-pre font-mono text-cyan-300/90 selection:bg-cyan-950 selection:text-white">
          <code>{currentContent}</code>
        </pre>
      </div>

      {/* CLI Compile Instructions */}
      <div className="bg-black p-4 rounded-lg border border-gray-800 text-xs font-mono space-y-2">
        <div className="flex items-center space-x-2 font-bold text-cyan-400 uppercase tracking-widest text-[11px]">
          <Terminal className="w-4 h-4" />
          <span>Local C Compilation & Native Execution Guide</span>
        </div>
        <div className="bg-gray-950 p-3 rounded border border-gray-800 font-mono text-[11px] text-emerald-400 leading-relaxed">
          # Option A: Compile single consolidated file:<br />
          gcc -O3 -std=c99 dfmsph22.c -lm -o dfmsph22<br /><br />
          # Option B: Compile modular C source files:<br />
          gcc -O3 -std=c99 dfmsph_mai.c dfmsph_pot.c dfmsph_exc.c dfmsph_inp.c dfmsph_out.c dfmsph_fun.c -lm -o dfmsph22<br /><br />
          # Execute double folding potential software:<br />
          ./dfmsph22
        </div>
      </div>

    </div>
  );
};

