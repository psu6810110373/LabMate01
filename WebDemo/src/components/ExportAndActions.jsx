import React from 'react';
import { Download, Copy, RefreshCw } from 'lucide-react';

export default function ExportAndActions({ onExportJSON, onCopyPayload, onResetDemo }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={onExportJSON}
        className="flex-1 bg-[#0c2b4e] hover:bg-[#001631] text-white font-semibold py-3 px-4 rounded-xl shadow-clinical text-xs sm:text-sm flex items-center justify-center gap-2 transition"
      >
        <Download className="w-4 h-4" />
        Export Mission Log (JSON)
      </button>

      <button
        onClick={onCopyPayload}
        className="flex-1 bg-white hover:bg-[#f4f4f4] text-[#0c2b4e] border border-[#c4c6cf] font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm"
      >
        <Copy className="w-4 h-4 text-[#1d546c]" />
        Copy Latest Payload
      </button>

      <button
        onClick={onResetDemo}
        className="flex-1 bg-white hover:bg-[#f4f4f4] text-[#0c2b4e] border border-[#c4c6cf] font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm"
      >
        <RefreshCw className="w-4 h-4 text-[#d97706]" />
        Reset Demo
      </button>
    </div>
  );
}
