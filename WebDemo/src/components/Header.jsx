import React from 'react';
import { ShieldCheck, Database, Radio } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Header() {
  return (
    <header className="bg-[#0c2b4e] text-white rounded-2xl p-6 mb-6 shadow-clinical-lg flex flex-wrap justify-between items-center gap-4 top-0 left-0 w-full z-50">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#1a3d64] border border-[#2d5280] rounded-xl flex items-center justify-center shadow-md">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-russo tracking-tight text-white">
            LabMate Secure Rover
          </h1>
          <p className="text-xs text-blue-200/80 font-sans">
            Clinical Precision & Secure Chain-of-Custody
          </p>
        </div>
      </div>

    {/*
      <div className="flex items-center gap-3 flex-wrap">
        <div className="bg-amber-400/15 border border-amber-400/40 text-amber-200 text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-warn"></span>
          Software-in-the-Loop Simulation
        </div>

        <div className="bg-blue-900/60 border border-blue-700/60 text-blue-100 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-blue-300" />
          ID: labmate-01
        </div>

        <div className={`text-xs font-mono font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 ${
          isSupabaseConfigured 
            ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-200' 
            : 'bg-slate-800 border border-slate-700 text-slate-300'
        }`}>
          <Database className="w-3.5 h-3.5" />
          {isSupabaseConfigured ? 'Supabase Connected' : 'Local DB Fallback'}
        </div>
      </div>
      */}
    </header>
  );
}
