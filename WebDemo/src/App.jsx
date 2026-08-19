import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MissionSetup from './components/MissionSetup';
import IdentityVerification from './components/IdentityVerification';
import StateBanner from './components/StateBanner';
import TelemetryCards from './components/TelemetryCards';
import SimulationControls from './components/SimulationControls';
import ChainOfCustodyTimeline from './components/ChainOfCustodyTimeline';
import ExportAndActions from './components/ExportAndActions';
import TesaiotPanel from './components/TesaiotPanel';
import { dbService } from './lib/supabase';
import { bitstreamMqtt } from './services/bitstreamMqtt';
import { normalizeBitstreamPayload } from './adapters/bitstreamSensorAdapter';

export default function App() {
  const hasLiveMqttRef = useRef(false);

  // Bitstream MQTT Integration (STEP 3, STEP 4 & STEP 5)
  useEffect(() => {
    const topic = import.meta.env.VITE_BITSTREAM_MQTT_TOPIC || '';
    const url = import.meta.env.VITE_BITSTREAM_MQTT_URL || 'ws://127.0.0.1:8883/mqtt';

    bitstreamMqtt.onMessage((_, rawPayload) => {
      const sensorData = normalizeBitstreamPayload(rawPayload);
      if (sensorData) {
        console.log('[LabMate SensorData]', sensorData);
        hasLiveMqttRef.current = true;
        setState((prev) => ({
          ...prev,
          acceleration: {
            x_g: sensorData.accel_x,
            y_g: sensorData.accel_y,
            z_g: sensorData.accel_z,
            peak_g: sensorData.impact_g
          },
          orientation: {
            tilt_deg: sensorData.tilt_deg
          },
          environment: {
            ...prev.environment,
            temperature_c: sensorData.temperature !== null ? sensorData.temperature : prev.environment.temperature_c
          }
        }));
      }
    });

    bitstreamMqtt.connect(url);
    if (topic) {
      bitstreamMqtt.subscribe(topic);
    }

    return () => {
      bitstreamMqtt.disconnect();
    };
  }, []);
  const [toastMsg, setToastMsg] = useState('');
  const [state, setState] = useState({
    device_id: 'labmate-01',
    mission_id: 'MIS-20260802-001',
    mode: 'SIMULATION',
    state: 'IDLE',
    previous_state: 'IDLE',
    connection: 'ONLINE',
    door_state: 'CLOSED',
    lock_state: 'LOCKED',
    sender: { display_name: 'ดร.สมชาย (ผู้ดูแล Lab)', authenticated: false },
    receiver: { display_name: 'ศ.ดร.อนันต์ (อาจารย์ที่ปรึกษา)', authenticated: false },
    package: { name: 'Laboratory Equipment', asset_id: 'LAB-042' },
    destination: 'Engineering Laboratory 402',
    acceleration: { x_g: 0.02, y_g: 0.01, z_g: 1.00, peak_g: 1.02 },
    orientation: { tilt_deg: 2.4 },
    environment: { temperature_c: 24.5, humidity_rh: 48.2, pressure_hpa: 1008.4 },
    battery_percent: 85,
    events: []
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 3000);
  };

  // Helper to add events & save to Supabase
  const addEvent = (eventType, severity, description, actor) => {
    const now = new Date();
    const evtId = `EVT-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${String(stateRef.current.events.length + 1).padStart(4, '0')}`;
    
    const newEvt = {
      event_id: evtId,
      timestamp: now.toISOString(),
      mission_id: stateRef.current.mission_id,
      device_id: stateRef.current.device_id,
      actor: actor || 'SYSTEM',
      event_type: eventType,
      severity,
      description
    };

    setState((prev) => ({
      ...prev,
      events: [newEvt, ...prev.events]
    }));

    // Async save to Supabase
    dbService.logEvent(newEvt);
  };

  // Create Mission
  const handleCreateMission = ({ sender, receiver, packageName, destination }) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = String(Math.floor(Math.random() * 900) + 100);
    const newMissionId = `MIS-${dateStr}-${randNum}`;

    const updatedState = {
      ...state,
      mission_id: newMissionId,
      sender: { display_name: sender, authenticated: false },
      receiver: { display_name: receiver, authenticated: false },
      package: { name: packageName, asset_id: 'LAB-042' },
      destination,
      state: 'IDLE',
      door_state: 'CLOSED',
      lock_state: 'LOCKED'
    };

    setState(updatedState);
    dbService.saveMission(updatedState);

    addEvent(
      'MISSION_CREATED',
      'INFO',
      `สร้างภารกิจใหม่ ${newMissionId}: ส่ง ${packageName} ไปยัง ${destination}`,
      `Sender: ${sender}`
    );

    showToast(`สร้างภารกิจ ${newMissionId} สำเร็จ (บันทึกลง Supabase DB)`);
  };

  // Authenticate Sender
  const handleAuthSender = () => {
    setState((prev) => {
      const updated = {
        ...prev,
        sender: { ...prev.sender, authenticated: true },
        state: 'LOADING',
        door_state: 'OPEN',
        lock_state: 'UNLOCKED'
      };
      dbService.saveMission(updated);
      return updated;
    });

    addEvent(
      'SENDER_AUTHENTICATED',
      'SUCCESS',
      `ผู้ส่ง (${state.sender.display_name}) ยืนยันตัวตนสำเร็จ ฝากล่องเปิดและปลดล็อก`,
      'Sender Auth Module'
    );
    showToast('ยืนยันตัวตนผู้ส่งสำเร็จ');
  };

  // Lock and Start Transit
  const handleLockAndTransit = () => {
    setState((prev) => ({
      ...prev,
      door_state: 'CLOSED',
      lock_state: 'LOCKED',
      state: 'LOCKED'
    }));

    addEvent('DOOR_LOCKED', 'INFO', 'ฝากล่องปิดและเปิดระบบ Solenoid Lock เรียบร้อย', 'Door Sensor');

    setTimeout(() => {
      setState((prev) => {
        const updated = { ...prev, state: 'IN_TRANSIT' };
        dbService.saveMission(updated);
        return updated;
      });
      addEvent('TRANSIT_STARTED', 'INFO', `หุ่นยนต์เริ่มออกเดินทางไปยัง ${state.destination}`, 'Rover Navigation');
    }, 1000);
  };

  // Authenticate Receiver
  const handleAuthReceiver = () => {
    setState((prev) => {
      const updated = {
        ...prev,
        receiver: { ...prev.receiver, authenticated: true },
        door_state: 'OPEN',
        lock_state: 'UNLOCKED'
      };
      dbService.saveMission(updated);
      return updated;
    });

    addEvent(
      'RECEIVER_AUTHENTICATED',
      'SUCCESS',
      `ผู้รับ (${state.receiver.display_name}) ยืนยันตัวตนสำเร็จ ปลดล็อกกล่องรับของ`,
      'Receiver Auth Module'
    );
    showToast('ยืนยันตัวตนผู้รับสำเร็จ');
  };

  // Complete Mission
  const handleCompleteMission = () => {
    setState((prev) => {
      const updated = {
        ...prev,
        door_state: 'CLOSED',
        lock_state: 'LOCKED',
        state: 'COMPLETED'
      };
      dbService.saveMission(updated);
      return updated;
    });

    addEvent(
      'MISSION_COMPLETED',
      'SUCCESS',
      `ภารกิจ ${state.mission_id} เสร็จสิ้นสมบูรณ์ บันทึก Chain of Custody สำเร็จ`,
      'System Controller'
    );
    showToast('เสร็จสิ้นภารกิจสมบูรณ์');
  };

  // Simulation Triggers
  const handleSimNormal = () => {
    setState((prev) => ({
      ...prev,
      acceleration: { ...prev.acceleration, peak_g: 1.04 },
      orientation: { tilt_deg: 2.1 },
      environment: { ...prev.environment, temperature_c: 24.5 }
    }));
    showToast('ปรับเป็นสภาวะเคลื่อนที่ปกติ');
  };

  const handleSimImpact = () => {
    setState((prev) => ({
      ...prev,
      acceleration: { ...prev.acceleration, peak_g: 3.40 }
    }));
    triggerAlert('IMPACT_DETECTED', 'CRITICAL', 'ตรวจพบแรงกระแทกสูง peak_g = 3.4g (เกินเกณฑ์ 2.5g)');
  };

  const handleSimDoorOpen = () => {
    setState((prev) => ({ ...prev, door_state: 'OPEN' }));
    if (stateRef.current.state === 'IN_TRANSIT') {
      triggerAlert('UNAUTHORIZED_OPEN', 'CRITICAL', 'ตรวจพบการเปิดฝากล่องผิดเวลาระหว่างขนส่ง!');
    } else {
      addEvent('DOOR_OPENED', 'INFO', 'ฝากล่องเปิดออก', 'Door Sensor');
      showToast('ฝากล่องเปิดออก');
    }
  };

  const handleSimHighTemp = () => {
    setState((prev) => ({
      ...prev,
      environment: { ...prev.environment, temperature_c: 34.5 }
    }));
    triggerAlert('TEMPERATURE_HIGH', 'WARNING', 'อุณหภูมิในกล่องสูงเกินเกณฑ์ 34.5°C (> 30.0°C)');
  };

  const handleSimTilt = () => {
    setState((prev) => ({
      ...prev,
      orientation: { tilt_deg: 42.0 }
    }));
    triggerAlert('EXCESSIVE_TILT', 'WARNING', 'หุ่นยนต์เอียงเกินกำหนด tilt = 42.0° (เกินเกณฑ์ 35.0°)');
  };

  const handleSimArrived = () => {
    setState((prev) => {
      const updated = { ...prev, state: 'ARRIVED' };
      dbService.saveMission(updated);
      return updated;
    });
    addEvent('ROVER_ARRIVED', 'SUCCESS', `หุ่นยนต์เดินทางถึงจุดหมาย ${state.destination} รอผู้รับยืนยันตัวตน`, 'Rover Navigation');
    showToast('หุ่นยนต์ถึงจุดหมายแล้ว');
  };

  const handleResetAlert = () => {
    if (state.state === 'ALERT') {
      setState((prev) => ({
        ...prev,
        state: prev.previous_state || 'IN_TRANSIT',
        door_state: 'CLOSED',
        lock_state: 'LOCKED',
        acceleration: { ...prev.acceleration, peak_g: 1.02 },
        orientation: { tilt_deg: 2.0 },
        environment: { ...prev.environment, temperature_c: 24.5 }
      }));
      addEvent('ALERT_RESET', 'INFO', 'รีเซ็ตการแจ้งเตือน ระบบกลับสู่สภาวะภารกิจตามปกติ', 'Operator / System');
      showToast('รีเซ็ต Alert เรียบร้อย');
    }
  };

  // Rule Evaluation Loop for auto-detected sensor thresholds
  useEffect(() => {
    const currentState = stateRef.current;
    if (currentState.state === 'COMPLETED') return;

    if (currentState.acceleration.peak_g > 2.5 && currentState.state !== 'ALERT') {
      triggerAlert('IMPACT_DETECTED', 'CRITICAL', `ตรวจพบแรงกระแทกสูง peak_g = ${currentState.acceleration.peak_g}g (เกินเกณฑ์ 2.5g)`);
    }
    if (currentState.orientation.tilt_deg > 35.0 && currentState.state !== 'ALERT') {
      triggerAlert('EXCESSIVE_TILT', 'WARNING', `หุ่นยนต์เอียงเกินกำหนด tilt = ${currentState.orientation.tilt_deg}° (เกินเกณฑ์ 35.0°)`);
    }
    if (currentState.door_state === 'OPEN' && currentState.state === 'IN_TRANSIT' && currentState.state !== 'ALERT') {
      triggerAlert('UNAUTHORIZED_OPEN', 'CRITICAL', 'ตรวจพบการเปิดฝากล่องผิดเวลาระหว่างขนส่ง!');
    }
    if (currentState.environment.temperature_c > 30.0 && currentState.state !== 'ALERT') {
      triggerAlert('TEMPERATURE_HIGH', 'WARNING', `อุณหภูมิในกล่องสูงเกินเกณฑ์ ${currentState.environment.temperature_c}°C (> 30.0°C)`);
    }
  }, [state.acceleration.peak_g, state.orientation.tilt_deg, state.door_state, state.environment.temperature_c]);

  const triggerAlert = (eventType, severity, desc) => {
    setState((prev) => ({
      ...prev,
      previous_state: prev.state !== 'ALERT' ? prev.state : prev.previous_state,
      state: 'ALERT'
    }));
    addEvent(eventType, severity, desc, 'EDGE_SIMULATOR');
    showToast(`⚠️ แจ้งเตือน: ${eventType}`);
  };

  // 1-second Telemetry Loop
  useEffect(() => {
    const timer = setInterval(() => {
      const current = stateRef.current;
      if (current.state !== 'ALERT') {
        if (hasLiveMqttRef.current) {
          // Live MQTT active: preserve live sensor fields (accel, impact_g, temperature, tilt)
          const humidity_rh = +(48.0 + Math.cos(Date.now() / 5000) * 1.0).toFixed(1);
          const pressure_hpa = +(1008.0 + Math.random() * 0.5).toFixed(1);

          const updatedTelemetry = {
            ...current,
            environment: {
              ...current.environment,
              humidity_rh,
              pressure_hpa
            }
          };

          setState(updatedTelemetry);
          dbService.logTelemetry(updatedTelemetry);
        } else {
          // Fallback mock generator when live MQTT data is not received
          const x_g = +(Math.sin(Date.now() / 1000) * 0.05 + (Math.random() * 0.02 - 0.01)).toFixed(2);
          const y_g = +(Math.cos(Date.now() / 1000) * 0.05 + (Math.random() * 0.02 - 0.01)).toFixed(2);
          const z_g = +(1.00 + (Math.random() * 0.04 - 0.02)).toFixed(2);
          const peak_g = +Math.sqrt(x_g ** 2 + y_g ** 2 + z_g ** 2).toFixed(2);
          const tilt_deg = +(2.0 + Math.random() * 1.5).toFixed(1);
          const temperature_c = +(24.5 + Math.sin(Date.now() / 5000) * 0.5).toFixed(1);
          const humidity_rh = +(48.0 + Math.cos(Date.now() / 5000) * 1.0).toFixed(1);
          const pressure_hpa = +(1008.0 + Math.random() * 0.5).toFixed(1);

          const updatedTelemetry = {
            ...current,
            acceleration: { x_g, y_g, z_g, peak_g },
            orientation: { tilt_deg },
            environment: { temperature_c, humidity_rh, pressure_hpa }
          };

          setState(updatedTelemetry);
          dbService.logTelemetry(updatedTelemetry);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Export JSON
  const handleExportJSON = () => {
    const payload = {
      metadata: {
        exported_at: new Date().toISOString(),
        system: 'LabMate Secure Rover SIL Simulation (React + Supabase)',
        version: '2.0.0-react'
      },
      mission: {
        mission_id: state.mission_id,
        device_id: state.device_id,
        state: state.state,
        sender: state.sender,
        receiver: state.receiver,
        package: state.package,
        destination: state.destination
      },
      telemetry_snapshot: {
        door_state: state.door_state,
        lock_state: state.lock_state,
        acceleration: state.acceleration,
        orientation: state.orientation,
        environment: state.environment,
        battery_percent: state.battery_percent
      },
      events_timeline: state.events
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `LabMate_Mission_${state.mission_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('ดาวน์โหลดไฟล์ JSON Log สำเร็จ');
  };

  // Copy Payload
  const handleCopyPayload = () => {
    const snapshot = {
      device_id: state.device_id,
      mission_id: state.mission_id,
      timestamp: new Date().toISOString(),
      mode: state.mode,
      state: state.state,
      door_state: state.door_state,
      lock_state: state.lock_state,
      acceleration: state.acceleration,
      orientation: state.orientation,
      environment: state.environment,
      battery_percent: state.battery_percent
    };
    navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
    showToast('คัดลอก Telemetry Payload สำเร็จ');
  };

  // Reset Demo
  const handleResetDemo = () => {
    const resetState = {
      device_id: 'labmate-01',
      mission_id: 'MIS-20260802-001',
      mode: 'SIMULATION',
      state: 'IDLE',
      previous_state: 'IDLE',
      connection: 'ONLINE',
      door_state: 'CLOSED',
      lock_state: 'LOCKED',
      sender: { display_name: 'ดร.สมชาย (ผู้ดูแล Lab)', authenticated: false },
      receiver: { display_name: 'ศ.ดร.อนันต์ (อาจารย์ที่ปรึกษา)', authenticated: false },
      package: { name: 'Laboratory Equipment', asset_id: 'LAB-042' },
      destination: 'Engineering Laboratory 402',
      acceleration: { x_g: 0.02, y_g: 0.01, z_g: 1.00, peak_g: 1.02 },
      orientation: { tilt_deg: 2.4 },
      environment: { temperature_c: 24.5, humidity_rh: 48.2, pressure_hpa: 1008.4 },
      battery_percent: 85,
      events: []
    };
    setState(resetState);
    showToast('รีเซ็ตระบบ Demo กลับสู่ตั้งต้นเรียบร้อย');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Setup & QR */}
        <div className="lg:col-span-4 space-y-6">
          <MissionSetup onCreateMission={handleCreateMission} showToast={showToast} />
          <IdentityVerification
            state={state}
            onAuthSender={handleAuthSender}
            onAuthReceiver={handleAuthReceiver}
            onLockAndTransit={handleLockAndTransit}
          />
        </div>

        {/* Right Column - Status, Telemetry & Controls */}
        <div className="lg:col-span-8 space-y-6">
          <StateBanner state={state} />
          <TelemetryCards state={state} />
          <SimulationControls
            onSimNormal={handleSimNormal}
            onSimImpact={handleSimImpact}
            onSimDoorOpen={handleSimDoorOpen}
            onSimHighTemp={handleSimHighTemp}
            onSimTilt={handleSimTilt}
            onSimArrived={handleSimArrived}
            onResetAlert={handleResetAlert}
            onCompleteMission={handleCompleteMission}
          />
          <ChainOfCustodyTimeline events={state.events} />
          <ExportAndActions
            onExportJSON={handleExportJSON}
            onCopyPayload={handleCopyPayload}
            onResetDemo={handleResetDemo}
          />

          
          {/*<TesaiotPanel />*/}


        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c2b4e] text-white border border-[#1d546c] shadow-clinical-lg px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa] animate-pulse" />
          {toastMsg}
        </div>
      )}
    </div>
  );
}
