import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Service Layer: Saves telemetry logs and events to Supabase if configured.
 */
export const dbService = {
  async saveMission(missionData) {
    if (!isSupabaseConfigured || !supabase) {
      console.log('[Local DB Service] Mission saved locally:', missionData);
      return { data: missionData, error: null };
    }
    try {
      const { data, error } = await supabase
        .from('missions')
        .upsert([{
          mission_id: missionData.mission_id,
          device_id: missionData.device_id,
          sender_name: missionData.sender.display_name,
          sender_authenticated: missionData.sender.authenticated,
          receiver_name: missionData.receiver.display_name,
          receiver_authenticated: missionData.receiver.authenticated,
          package_name: missionData.package.name,
          destination: missionData.destination,
          status: missionData.state,
          updated_at: new Date().toISOString()
        }], { onConflict: 'mission_id' });
      return { data, error };
    } catch (err) {
      console.error('[Supabase Error] saveMission:', err);
      return { data: null, error: err };
    }
  },

  async logTelemetry(telemetry) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('telemetry_logs').insert([{
        device_id: telemetry.device_id,
        mission_id: telemetry.mission_id,
        mode: telemetry.mode,
        state: telemetry.state,
        door_state: telemetry.door_state,
        lock_state: telemetry.lock_state,
        x_g: telemetry.acceleration.x_g,
        y_g: telemetry.acceleration.y_g,
        z_g: telemetry.acceleration.z_g,
        peak_g: telemetry.acceleration.peak_g,
        tilt_deg: telemetry.orientation.tilt_deg,
        temperature_c: telemetry.environment.temperature_c,
        humidity_rh: telemetry.environment.humidity_rh,
        pressure_hpa: telemetry.environment.pressure_hpa,
        battery_percent: telemetry.battery_percent
      }]);
    } catch (err) {
      console.error('[Supabase Error] logTelemetry:', err);
    }
  },

  async logEvent(event) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('events').insert([{
        event_id: event.event_id,
        mission_id: event.mission_id,
        device_id: event.device_id,
        timestamp: event.timestamp,
        actor: event.actor,
        event_type: event.event_type,
        severity: event.severity,
        description: event.description
      }]);
    } catch (err) {
      console.error('[Supabase Error] logEvent:', err);
    }
  },

  async fetchRecentEvents(missionId) {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('mission_id', missionId)
        .order('timestamp', { ascending: false });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('[Supabase Error] fetchRecentEvents:', err);
      return null;
    }
  }
};
