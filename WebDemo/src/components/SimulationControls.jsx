import React from 'react';
import { Sliders, AlertTriangle, RotateCcw, CheckCircle, Navigation } from 'lucide-react';

export default function SimulationControls({
  onSimNormal,
  onSimImpact,
  onSimDoorOpen,
  onSimHighTemp,
  onSimTilt,
  onSimArrived,
  onResetAlert,
  onCompleteMission
}) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-clinical">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h2 className="text-base font-semibold font-display text-[#0c2b4e] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#1d546c]" />
          จำลองเหตุการณ์เซนเซอร์ (Event Simulation Controls)
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onSimNormal}
          className="bg-[#f4f4f4] hover:bg-[#e8e8e8] text-[#0c2b4e] text-xs font-semibold py-2.5 px-3 rounded-xl border border-[#c4c6cf] transition"
        >
          Normal Motion
        </button>

        <button
          onClick={onSimImpact}
          className="bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] text-xs font-semibold py-2.5 px-3 rounded-xl border border-[#ba1a1a]/30 flex items-center justify-center gap-1.5 transition"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Impact (3.4g)
        </button>

        <button
          onClick={onSimDoorOpen}
          className="bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] text-xs font-semibold py-2.5 px-3 rounded-xl border border-[#ba1a1a]/30 transition"
        >
          Door Open
        </button>

        <button
          onClick={onSimHighTemp}
          className="bg-[#fef3c7] hover:bg-[#fde68a] text-[#92400e] text-xs font-semibold py-2.5 px-3 rounded-xl border border-[#f59e0b]/40 transition"
        >
          Temp High (34.5°C)
        </button>

        <button
          onClick={onSimTilt}
          className="bg-[#fef3c7] hover:bg-[#fde68a] text-[#92400e] text-xs font-semibold py-2.5 px-3 rounded-xl border border-[#f59e0b]/40 transition"
        >
          Tilt (42.0°)
        </button>

        <button
          onClick={onSimArrived}
          className="bg-[#1a3d64] hover:bg-[#0c2b4e] text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow-clinical"
        >
          <Navigation className="w-3.5 h-3.5" />
          Force Arrived
        </button>

        <button
          onClick={onResetAlert}
          className="bg-[#f4f4f4] hover:bg-[#e8e8e8] text-[#0c2b4e] text-xs font-semibold py-2.5 px-3 rounded-xl border border-[#c4c6cf] flex items-center justify-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Alert
        </button>

        <button
          onClick={onCompleteMission}
          className="bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow-clinical"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Complete Mission
        </button>
      </div>
    </div>
  );
}
