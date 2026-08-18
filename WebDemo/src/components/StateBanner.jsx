import React from 'react';
import { Activity } from 'lucide-react';

export default function StateBanner({ state }) {
  const getBannerStyle = (currentState) => {
    switch (currentState) {
      case 'ALERT':
        return 'bg-[#ffdad6] border-[#ffb4ab] text-[#ba1a1a]';
      case 'COMPLETED':
        return 'bg-[#d1fae5] border-[#a7f3d0] text-[#065f46]';
      case 'IN_TRANSIT':
        return 'bg-[#dbeafe] border-[#bfdbfe] text-[#1e40af]';
      case 'ARRIVED':
        return 'bg-[#fef3c7] border-[#fde68a] text-[#92400e]';
      default:
        return 'bg-[#e2e8f0] border-[#cbd5e1] text-[#334155]';
    }
  };

  const getIndicatorStyle = (currentState) => {
    switch (currentState) {
      case 'ALERT':
        return 'bg-[#ba1a1a] shadow-md shadow-[#ba1a1a]/50 animate-pulse';
      case 'COMPLETED':
        return 'bg-[#059669] shadow-md shadow-[#059669]/50';
      case 'IN_TRANSIT':
        return 'bg-[#0c2b4e] shadow-md shadow-[#0c2b4e]/50 animate-pulse';
      default:
        return 'bg-[#64748b]';
    }
  };

  return (
    <div className={`border rounded-2xl p-5 flex items-center justify-between transition-colors shadow-clinical ${getBannerStyle(state.state)}`}>
      <div className="flex items-center gap-3.5">
        <div className={`w-3.5 h-3.5 rounded-full ${getIndicatorStyle(state.state)}`} />
        <div>
          <span className="label-caps opacity-75 block">
            สถานะปัจจุบัน (Current Mission State)
          </span>
          <span className="font-mono font-bold text-xl tracking-wide">
            {state.state}
          </span>
        </div>
      </div>

      <div className="text-right">
        <span className="label-caps opacity-75 block">
          Mission Identifier
        </span>
        <span className="font-mono font-bold text-sm flex items-center gap-1.5 justify-end">
          <Activity className="w-4 h-4 opacity-80" />
          {state.mission_id}
        </span>
      </div>
    </div>
  );
}
