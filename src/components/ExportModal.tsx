import React, { useState } from 'react';
import { X, Download, FileText, Table, Code, Check } from 'lucide-react';
import { CalculationOutput } from '../types/dfmsph';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  output: CalculationOutput | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, output }) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const downloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateCsv = () => {
    if (!output) return '';
    let csv = 'R_fm,V_DF_MeV,V_C_MeV,V_Cent_MeV,V_Tot_MeV,V_WS_fit_MeV\n';
    output.radialData.forEach(p => {
      csv += `${p.R},${p.V_df},${p.V_c},${p.V_cent},${p.V_tot},${p.V_ws}\n`;
    });
    return csv;
  };

  const generateLatexReport = () => {
    if (!output) return '';
    const b = output.barrier;
    return `% DFMSPH22 Double Folding Potential Summary
\\begin{table}[h]
\\centering
\\caption{Coulomb barrier parameters for ${output.systemName}}
\\begin{tabular}{l c c c}
\\hline
System & $V_b$ (MeV) & $R_b$ (fm) & $\\hbar\\omega$ (MeV) \\\\
\\hline
${output.systemName} & ${b.V_b} & ${b.R_b} & ${b.hbar_omega} \\\\
\\hline
\\end{tabular}
\\end{table}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0c0c0e] border border-gray-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center space-x-2">
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Calculation Results</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3 font-mono text-xs">
          
          {/* DFMSPH22.OUT */}
          <div className="flex items-center justify-between bg-black p-3 rounded-lg border border-gray-800">
            <div>
              <div className="text-xs font-bold text-gray-200">dfmsph22.out (ASCII Output)</div>
              <div className="text-[10px] text-gray-500">Standard DFMSPH22 output table file</div>
            </div>
            <button
              onClick={() => downloadFile('dfmsph22.out', output?.cOutputText || '', 'text/plain')}
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-[#09090b] font-bold text-[10px] uppercase tracking-wider"
            >
              Download .out
            </button>
          </div>

          {/* CSV Table */}
          <div className="flex items-center justify-between bg-black p-3 rounded-lg border border-gray-800">
            <div>
              <div className="text-xs font-bold text-gray-200">CSV Data Table (.csv)</div>
              <div className="text-[10px] text-gray-500">Comma-separated radial potential values</div>
            </div>
            <button
              onClick={() => downloadFile(`${output?.systemName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`, generateCsv(), 'text/csv')}
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-[#09090b] font-bold text-[10px] uppercase tracking-wider"
            >
              Download .csv
            </button>
          </div>

          {/* JSON Payload */}
          <div className="flex items-center justify-between bg-black p-3 rounded-lg border border-gray-800">
            <div>
              <div className="text-xs font-bold text-gray-200">JSON Output Payload (.json)</div>
              <div className="text-[10px] text-gray-500">Complete structured output with barrier metrics</div>
            </div>
            <button
              onClick={() => downloadFile('dfmsph22_results.json', JSON.stringify(output, null, 2), 'application/json')}
              className="px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] uppercase tracking-wider"
            >
              Download .json
            </button>
          </div>

          {/* DFMSPH22.IN */}
          <div className="flex items-center justify-between bg-black p-3 rounded-lg border border-gray-800">
            <div>
              <div className="text-xs font-bold text-gray-200">dfmsph22.in (Namelist Input)</div>
              <div className="text-[10px] text-gray-500">Formatted input file for native execution</div>
            </div>
            <button
              onClick={() => downloadFile('dfmsph22.in', output?.cInputText || '', 'text/plain')}
              className="px-3 py-1.5 rounded bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 text-[10px] font-bold uppercase tracking-wider"
            >
              Download .in
            </button>
          </div>

          {/* LaTeX Snippet */}
          <div className="flex items-center justify-between bg-black p-3 rounded-lg border border-gray-800">
            <div>
              <div className="text-xs font-bold text-gray-200">LaTeX Summary Code</div>
              <div className="text-[10px] text-gray-500">LaTeX table code for manuscript publication</div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateLatexReport());
                setCopiedFormat('latex');
                setTimeout(() => setCopiedFormat(null), 2000);
              }}
              className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-[#09090b] font-bold text-[10px] uppercase tracking-wider flex items-center space-x-1"
            >
              {copiedFormat === 'latex' ? <Check className="w-3 h-3" /> : null}
              <span>{copiedFormat === 'latex' ? 'Copied' : 'Copy LaTeX'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
