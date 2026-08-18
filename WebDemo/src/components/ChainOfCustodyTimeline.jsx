import React from 'react';
import { History, ShieldAlert, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export default function ChainOfCustodyTimeline({ events }) {
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-l-[#ba1a1a] text-[#ba1a1a] bg-[#ffdad6]/30';
      case 'WARNING':
        return 'border-l-[#d97706] text-[#b45309] bg-[#fef3c7]/50';
      case 'SUCCESS':
        return 'border-l-[#059669] text-[#047857] bg-[#d1fae5]/50';
      default:
        return 'border-l-[#0c2b4e] text-[#0c2b4e] bg-[#f4f4f4]';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <ShieldAlert className="w-3.5 h-3.5 text-[#ba1a1a]" />;
      case 'WARNING':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#d97706]" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />;
      default:
        return <Info className="w-3.5 h-3.5 text-[#0c2b4e]" />;
    }
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-clinical">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h2 className="text-base font-semibold font-display text-[#0c2b4e] flex items-center gap-2">
          <History className="w-4 h-4 text-[#1d546c]" />
          Secure Chain-of-Custody Timeline
        </h2>
        <span className="text-xs text-[#0c2b4e] font-mono bg-[#f4f4f4] border border-[#e2e8f0] px-3 py-1 rounded-full font-semibold">
          {events.length} Events Logged
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-300">
        {events.length === 0 ? (
          <div className="text-center py-8 text-[#74777f] text-sm">
            ยังไม่มีรายการ Event บันทึกไว้
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.event_id || evt.timestamp}
              className={`border-l-4 rounded-r-xl p-3.5 border-y border-r border-slate-200/80 ${getSeverityStyle(evt.severity)}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold flex items-center gap-1.5">
                  {getSeverityIcon(evt.severity)}
                  [{evt.severity}] {evt.event_type}
                </span>
                <span className="text-[10px] text-[#74777f] font-mono">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-[11px] text-[#1d546c] font-semibold mb-1">
                Source: {evt.actor} | ID: {evt.event_id}
              </div>
              <div className="text-xs text-[#1a1c1c] font-sans leading-relaxed">
                {evt.description}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
