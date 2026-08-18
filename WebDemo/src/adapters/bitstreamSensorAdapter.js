/**
 * Adapter module to normalize raw Bitstream BMI270 MQTT payloads into LabMate SensorData format.
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
 * Normalizes a raw Bitstream MQTT payload into LabMate SensorData.
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

  // 6. Extract hostMs timestamp source when valid
  let timestamp = new Date().toISOString();
  if (typeof outerData.hostMs === 'number' && !isNaN(outerData.hostMs) && outerData.hostMs > 0) {
    timestamp = new Date(outerData.hostMs).toISOString();
  } else if (typeof outerData.hostMs === 'string') {
    const parsedMs = parseInt(outerData.hostMs, 10);
    if (!isNaN(parsedMs) && parsedMs > 0) {
      timestamp = new Date(parsedMs).toISOString();
    }
  }

  // 7. Return normalized LabMate SensorData shape
  return {
    timestamp,
    accel_x: ax,
    accel_y: ay,
    accel_z: az,
    gyro_x: gx !== null ? gx : 0,
    gyro_y: gy !== null ? gy : 0,
    gyro_z: gz !== null ? gz : 0,
    impact_g,
    tilt_deg: null,
    temperature: tempC !== null ? tempC : null
  };
}

/**
 * Runs basic validation test suite for normalizeBitstreamPayload.
 * Returns test results report.
 */
export function runAdapterTests() {
  const tests = [
    {
      name: 'valid payload',
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
      expectSuccess: true
    },
    {
      name: 'malformed outer JSON',
      input: '{ invalid json',
      expectSuccess: false
    },
    {
      name: 'malformed nested message JSON',
      input: JSON.stringify({
        hostMs: 1787091299051,
        message: '{ bad nested json'
      }),
      expectSuccess: false
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
      expectSuccess: false
    }
  ];

  const results = tests.map((t) => {
    const output = normalizeBitstreamPayload(t.input);
    const success = (output !== null) === t.expectSuccess;
    return { name: t.name, passed: success, output };
  });

  return results;
}

export default normalizeBitstreamPayload;
