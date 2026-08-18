import React from 'react';
import { DoorClosed, Lock, Zap, Compass, Thermometer, Droplets, Wind, BatteryCharging } from 'lucide-react';

export default function TelemetryCards({ state }) {
  const isImpactAlert = state.acceleration.peak_g > 2.5;
  const isTiltWarn = state.orientation.tilt_deg > 35.0;
  const isTempWarn = state.environment.temperature_c > 30.0;
  const isDoorOpen = state.door_state === 'OPEN';
  const isUnlocked = state.lock_state === 'UNLOCKED';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      {/* Door State */}
      <div className={`bg-white border rounded-2xl p-5 shadow-clinical relative overflow-hidden transition ${
        isDoorOpen ? 'border-red-400 bg-red-50/50' : 'border-[#e2e8f0]'
      }`}>
        <div className={`absolute top-0 left-0 w-1.5 h-full ${isDoorOpen ? 'bg-[#ba1a1a]' : 'bg-[#059669]'}`} />
        <div className="flex items-center justify-between text-[#43474e] mb-1">
          <span className="label-caps">Door State</span>
          <DoorClosed className="w-4 h-4 text-[#1d546c]" />
        </div>
        <div className={`telemetry-value my-1 ${isDoorOpen ? 'text-[#ba1a1a]' : 'text-[#059669]'}`}>
          {state.door_state}
        </div>
        <div className="text-[11px] text-[#74777f] font-medium">Solenoid Latch Status</div>
      </div>

      {/* Lock State */}
      <div className={`bg-white border rounded-2xl p-5 shadow-clinical relative overflow-hidden transition ${
        isUnlocked ? 'border-amber-400 bg-amber-50/50' : 'border-[#e2e8f0]'
      }`}>
        <div className={`absolute top-0 left-0 w-1.5 h-full ${isUnlocked ? 'bg-amber-500' : 'bg-[#0c2b4e]'}`} />
        <div className="flex items-center justify-between text-[#43474e] mb-1">
          <span className="label-caps">Lock State</span>
          <Lock className="w-4 h-4 text-[#1d546c]" />
        </div>
        <div className={`telemetry-value my-1 ${isUnlocked ? 'text-amber-600' : 'text-[#0c2b4e]'}`}>
          {state.lock_state}
        </div>
        <div className="text-[11px] text-[#74777f] font-medium">Security Latch</div>
      </div>

      {/* Peak Impact */}
      <div className={`bg-white border rounded-2xl p-5 shadow-clinical relative overflow-hidden transition ${
        isImpactAlert ? 'border-red-400 bg-red-50/80' : 'border-[#e2e8f0]'
      }`}>
        <div className={`absolute top-0 left-0 w-1.5 h-full ${isImpactAlert ? 'bg-[#ba1a1a]' : 'bg-[#059669]'}`} />
        <div className="flex items-center justify-between text-[#43474e] mb-1">
          <span className="label-caps">Peak Impact</span>
          <Zap className="w-4 h-4 text-[#1d546c]" />
        </div>
        <div className={`telemetry-value my-1 ${isImpactAlert ? 'text-[#ba1a1a] animate-pulse' : 'text-[#1a1c1c]'}`}>
          {state.acceleration.peak_g} <span className="text-sm font-sans font-normal">g</span>
        </div>
        <div className="text-[11px] text-[#74777f] font-medium">Threshold: &le; 2.5g</div>
      </div>

      {/* Orientation / Tilt */}
      <div className={`bg-white border rounded-2xl p-5 shadow-clinical relative overflow-hidden transition ${
        isTiltWarn ? 'border-amber-400 bg-amber-50/80' : 'border-[#e2e8f0]'
      }`}>
        <div className={`absolute top-0 left-0 w-1.5 h-full ${isTiltWarn ? 'bg-amber-500' : 'bg-[#059669]'}`} />
        <div className="flex items-center justify-between text-[#43474e] mb-1">
          <span className="label-caps">Orientation / Tilt</span>
          <Compass className="w-4 h-4 text-[#1d546c]" />
        </div>
        <div className={`telemetry-value my-1 ${isTiltWarn ? 'text-amber-600' : 'text-[#1a1c1c]'}`}>
          {state.orientation.tilt_deg}&deg;
        </div>
        <div className="text-[11px] text-[#74777f] font-medium">Threshold: &le; 35&deg;</div>
      </div>

      {/* Temperature */}
      <div className={`bg-white border rounded-2xl p-5 shadow-clinical relative overflow-hidden transition ${
        isTempWarn ? 'border-amber-400 bg-amber-50/80' : 'border-[#e2e8f0]'
      }`}>
        <div className={`absolute top-0 left-0 w-1.5 h-full ${isTempWarn ? 'bg-amber-500' : 'bg-[#059669]'}`} />
        <div className="flex items-center justify-between text-[#43474e] mb-1">
          <span className="label-caps">Temperature</span>
          <Thermometer className="w-4 h-4 text-[#1d546c]" />
        </div>
        <div className={`telemetry-value my-1 ${isTempWarn ? 'text-amber-600' : 'text-[#1a1c1c]'}`}>
          {state.environment.temperature_c} <span className="text-sm font-sans font-normal">&deg;C</span>
        </div>
        <div className="text-[11px] text-[#74777f] font-medium">Threshold: &le; 30&deg;C</div>
      </div>

      {/* Humidity */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-clinical relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1d546c]" />
        <div className="flex items-center justify-between text-[#43474e] mb-1">
          <span className="label-caps">Humidity</span>
          <Droplets className="w-4 h-4 text-[#1d546c]" />
        </div>
        <div className="telemetry-value my-1 text-[#1a1c1c]">
          {state.environment.humidity_rh} <span className="text-sm font-sans font-normal">%</span>
        </div>
        <div className="text-[11px] text-[#74777f] font-medium">Threshold: &le; 70%</div>
      </div>

      {/* Pressure */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-clinical relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#406089]" />
        <div className="flex items-center justify-between text-[#43474e] mb-1">
          <span className="label-caps">Pressure</span>
          <Wind className="w-4 h-4 text-[#406089]" />
        </div>
        <div className="telemetry-value my-1 text-[#1a1c1c]">
          {state.environment.pressure_hpa} <span className="text-xs font-sans font-normal">hPa</span>
        </div>
        <div className="text-[11px] text-[#74777f] font-medium">Barometer Normal</div>
      </div>

      {/* Battery */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-clinical relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#059669]" />
        <div className="flex items-center justify-between text-[#43474e] mb-1">
          <span className="label-caps">Battery</span>
          <BatteryCharging className="w-4 h-4 text-[#059669]" />
        </div>
        <div className="telemetry-value my-1 text-[#059669]">
          {state.battery_percent}%
        </div>
        <div className="text-[11px] text-[#74777f] font-medium">
          Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
