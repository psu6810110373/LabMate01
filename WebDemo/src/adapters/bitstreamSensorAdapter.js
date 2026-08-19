/**
 * Adapter module to normalize raw Bitstream BMI270 (IMU & Fusion) MQTT payloads into LabMate SensorData format.
 */

function asNumber(val) {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) return parsed;
  }
  return null;
}

/**
 * Normalizes a raw Bitstream MQTT payload (BMI270 IMU or Fusion) into LabMate SensorData.
 *
 * @param {string|object} rawPayload - Raw MQTT payload received from broker.
 * @returns {object|null} Normalized LabMate SensorData object, or null if parsing fails.
 */
export function normalizeBitstreamPayload(rawPayload) {
  if (!rawPayload) {
    return null;
  }

  let outerData = null;

  // 1. Safely parse outer MQTT JSON if string
  if (typeof rawPayload === 'string') {
    try {
      outerData = JSON.parse(rawPayload);
    } catch (err) {
      return null;
    }
  } else if (typeof rawPayload === 'object' && rawPayload !== null) {
    outerData = rawPayload;
  } else {
    return null;
  }

  if (!outerData || typeof outerData !== 'object') {
    return null;
  }

  // 2. Safely parse nested "message" field
  let innerData = null;
  const messageRaw = outerData.message;

  if (typeof messageRaw === 'string') {
    try {
      innerData = JSON.parse(messageRaw);
    } catch (err) {
      return null;
    }
  } else if (typeof messageRaw === 'object' && messageRaw !== null) {
    innerData = messageRaw;
  } else {
    return null;
  }

  if (!innerData || typeof innerData !== 'object') {
    return null;
  }

  // 3. Extract and validate required numeric BMI270 acceleration fields
  const ax = asNumber(innerData.accelX);
  const ay = asNumber(innerData.accelY);
  const az = asNumber(innerData.accelZ);

  if (ax === null || ay === null || az === null) {
    return null;
  }

  // 4. Extract optional gyro and temperature fields
  const gx = asNumber(innerData.gyroX);
  const gy = asNumber(innerData.gyroY);
  const gz = asNumber(innerData.gyroZ);
  const tempC = asNumber(innerData.temperatureC);

  // 5. Calculate impact_g normalized by standard gravity (9.80665 m/s²)
  const accelMag = Math.sqrt(ax * ax + ay * ay + az * az);
  const impact_g = Number((accelMag / 9.80665).toFixed(4));

  // 6. Calculate tilt_deg from optional BMI270 Fusion fields (rollRad and pitchRad)
  const rollRad = asNumber(innerData.rollRad);
  const pitchRad = asNumber(innerData.pitchRad);

  let tilt_deg = null;
  if (rollRad !== null && pitchRad !== null) {
    const rollDeg = (rollRad * 180) / Math.PI;
    const pitchDeg = (pitchRad * 180) / Math.PI;
    const combinedTilt = Math.sqrt(rollDeg * rollDeg + pitchDeg * pitchDeg);
    tilt_deg = Number(combinedTilt.toFixed(1));
  }

  // 7. Extract hostMs timestamp source when valid
  let timestamp = new Date().toISOString();
  if (typeof outerData.hostMs === 'number' && !isNaN(outerData.hostMs) && outerData.hostMs > 0) {
    timestamp = new Date(outerData.hostMs).toISOString();
  } else if (typeof outerData.hostMs === 'string') {
    const parsedMs = parseInt(outerData.hostMs, 10);
    if (!isNaN(parsedMs) && parsedMs > 0) {
      timestamp = new Date(parsedMs).toISOString();
    }
  }

  // 8. Return normalized LabMate SensorData shape
  return {
    timestamp,
    accel_x: ax,
    accel_y: ay,
    accel_z: az,
    gyro_x: gx !== null ? gx : 0,
    gyro_y: gy !== null ? gy : 0,
    gyro_z: gz !== null ? gz : 0,
    impact_g,
    tilt_deg,
    temperature: tempC !== null ? tempC : null
  };
}

/**
 * Runs validation test suite for normalizeBitstreamPayload including Fusion payloads.
 * Returns test results report.
 */
export function runAdapterTests() {
  const tests = [
    {
      name: 'valid IMU payload without Fusion fields',
      input: JSON.stringify({
        hostMs: 1787091299051,
        nodeId: 'mqtt-publisher',
        message: JSON.stringify({
          accelX: -1.13,
          accelY: 9.25,
          accelZ: -0.06,
          gyroX: 0.05,
          gyroY: 0,
          gyroZ: -0.02,
          temperatureC: 30
        })
      }),
      validate: (out) => out !== null && out.tilt_deg === null && out.impact_g === 0.9503
    },
    {
      name: 'valid Fusion payload with rollRad and pitchRad',
      input: JSON.stringify({
        hostMs: 1787110477615,
        nodeId: 'mqtt-publisher',
        message: JSON.stringify({
          accelX: 0.66,
          accelY: 8.92,
          accelZ: 0.13,
          gyroX: 0.11,
          gyroY: 0,
          gyroZ: 0.01,
          rollRad: 0.01,
          pitchRad: -0.03,
          headingRad: 0,
          quatW: 0.999853,
          quatX: -0.016799,
          quatY: -0.0001,
          quatZ: 0.003399,
          temperatureC: 30
        })
      }),
      validate: (out) => out !== null && out.tilt_deg === 1.8 && out.temperature === 30
    },
    {
      name: 'correct radian-to-degree conversion & combined tilt calculation',
      input: JSON.stringify({
        hostMs: 1787110477615,
        message: JSON.stringify({
          accelX: 0,
          accelY: 9.8,
          accelZ: 0,
          rollRad: Math.PI / 4, // 45 degrees
          pitchRad: 0
        })
      }),
      validate: (out) => out !== null && out.tilt_deg === 45
    },
    {
      name: 'malformed Fusion fields (invalid string in rollRad)',
      input: JSON.stringify({
        hostMs: 1787110477615,
        message: JSON.stringify({
          accelX: 0.66,
          accelY: 8.92,
          accelZ: 0.13,
          rollRad: 'invalid',
          pitchRad: -0.03
        })
      }),
      validate: (out) => out !== null && out.tilt_deg === null
    },
    {
      name: 'malformed outer JSON',
      input: '{ invalid json',
      validate: (out) => out === null
    },
    {
      name: 'malformed nested message JSON',
      input: JSON.stringify({
        hostMs: 1787091299051,
        message: '{ bad nested json'
      }),
      validate: (out) => out === null
    },
    {
      name: 'missing acceleration fields',
      input: JSON.stringify({
        hostMs: 1787091299051,
        message: JSON.stringify({
          gyroX: 0.05,
          temperatureC: 30
        })
      }),
      validate: (out) => out === null
    }
  ];

  const results = tests.map((t) => {
    const output = normalizeBitstreamPayload(t.input);
    const passed = t.validate(output);
    return { name: t.name, passed, output };
  });

  return results;
}

export default normalizeBitstreamPayload;
