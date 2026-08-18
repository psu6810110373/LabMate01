-- ========================================================
-- LabMate Secure Rover - Supabase Database Schema
-- Run this script in Supabase SQL Editor
-- ========================================================

-- 1. Create Missions Table
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id TEXT UNIQUE NOT NULL,
    device_id TEXT NOT NULL DEFAULT 'labmate-01',
    sender_name TEXT NOT NULL,
    sender_authenticated BOOLEAN DEFAULT FALSE,
    receiver_name TEXT NOT NULL,
    receiver_authenticated BOOLEAN DEFAULT FALSE,
    package_name TEXT NOT NULL,
    asset_id TEXT,
    destination TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'IDLE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Telemetry Logs Table
CREATE TABLE IF NOT EXISTS public.telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL DEFAULT 'labmate-01',
    mission_id TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    mode TEXT DEFAULT 'SIMULATION',
    state TEXT NOT NULL,
    door_state TEXT NOT NULL DEFAULT 'CLOSED',
    lock_state TEXT NOT NULL DEFAULT 'LOCKED',
    x_g NUMERIC(5, 2) DEFAULT 0.00,
    y_g NUMERIC(5, 2) DEFAULT 0.00,
    z_g NUMERIC(5, 2) DEFAULT 1.00,
    peak_g NUMERIC(5, 2) DEFAULT 1.00,
    tilt_deg NUMERIC(5, 1) DEFAULT 0.0,
    temperature_c NUMERIC(5, 1) DEFAULT 25.0,
    humidity_rh NUMERIC(5, 1) DEFAULT 50.0,
    pressure_hpa NUMERIC(7, 1) DEFAULT 1013.2,
    battery_percent INTEGER DEFAULT 100
);

-- 3. Create Secure Chain-of-Custody Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL,
    mission_id TEXT NOT NULL,
    device_id TEXT NOT NULL DEFAULT 'labmate-01',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    actor TEXT NOT NULL,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('INFO', 'SUCCESS', 'WARNING', 'CRITICAL')),
    description TEXT NOT NULL
);

-- 4. Enable Row Level Security (RLS) - Permissive for Hackathon Demo
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write on missions" ON public.missions FOR ALL USING (true);
CREATE POLICY "Allow public read/write on telemetry_logs" ON public.telemetry_logs FOR ALL USING (true);
CREATE POLICY "Allow public read/write on events" ON public.events FOR ALL USING (true);
