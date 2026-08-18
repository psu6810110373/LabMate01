import React from 'react';
import { Server } from 'lucide-react';

export default function TesaiotPanel() {
  return (
    <div className="bg-white border border-[#1d546c]/30 rounded-2xl p-5 text-xs leading-relaxed text-[#43474e] shadow-clinical">
      <div className="font-semibold font-display text-[#0c2b4e] mb-2 flex items-center gap-2 text-sm">
        <Server className="w-4 h-4 text-[#1d546c]" />
        แผนการเชื่อมต่อบอร์ดจริง TESAIoT (PSoC Edge E84 Integration Plan)
      </div>

      <div className="space-y-2">
        <div>
          <strong className="text-[#0c2b4e]">Hardware Flow:</strong> PSoC Edge E84 AI Kit &rarr; Sensor Data Processing &rarr; MQTT over Server-TLS &rarr; TESAIoT Platform &rarr; App Dashboard / Supabase DB
        </div>

        <div>
          <strong className="text-[#0c2b4e]">MQTT Topic Hierarchy:</strong>
          <div className="flex flex-wrap gap-2 mt-1.5 font-mono text-[11px]">
            <span className="bg-[#f4f4f4] px-2.5 py-1 rounded-lg border border-[#e2e8f0] text-[#0c2b4e] font-semibold">
              device/labmate-01/telemetry
            </span>
            <span className="bg-[#f4f4f4] px-2.5 py-1 rounded-lg border border-[#e2e8f0] text-[#0c2b4e] font-semibold">
              device/labmate-01/telemetry/sensor
            </span>
            <span className="bg-[#f4f4f4] px-2.5 py-1 rounded-lg border border-[#e2e8f0] text-[#0c2b4e] font-semibold">
              device/labmate-01/commands/#
            </span>
          </div>
        </div>

        <div className="text-[11px] text-[#74777f] pt-1">
          * Current Demo: React + Supabase SIL Simulator | Phase 1: MQTT QoS 1 + Server-TLS | Phase 2: mTLS + OPTIGA™ Trust M Root of Trust
        </div>
      </div>
    </div>
  );
}
