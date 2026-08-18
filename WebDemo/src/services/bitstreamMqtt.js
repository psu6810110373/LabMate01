import mqtt from 'mqtt';

const DEFAULT_BROKER_URL = 'ws://127.0.0.1:8883/mqtt';
const DEFAULT_TOPIC = import.meta.env.VITE_BITSTREAM_MQTT_TOPIC || '';
const BROKER_URL = import.meta.env.VITE_BITSTREAM_MQTT_URL || DEFAULT_BROKER_URL;

class BitstreamMqttService {
  constructor() {
    this.client = null;
    this.status = 'DISCONNECTED';
    this.subscribedTopic = null;
    this.onMessageCallback = null;
    this.onStatusChangeCallback = null;
  }

  connect(url = BROKER_URL, options = {}) {
    if (this.client && this.client.connected) {
      console.log('[Bitstream MQTT] Already connected');
      return this.client;
    }

    this.setStatus('CONNECTING');

    try {
      this.client = mqtt.connect(url, {
        reconnectPeriod: 3000,
        connectTimeout: 5000,
        ...options
      });

      this.client.on('connect', () => {
        this.setStatus('CONNECTED');
        console.log('[Bitstream MQTT] Connected');
        if (this.subscribedTopic) {
          this._doSubscribe(this.subscribedTopic);
        }
      });

      this.client.on('message', (topic, message) => {
        const rawPayload = message.toString();
        console.log('[Bitstream MQTT] Raw message:', rawPayload);
        if (this.onMessageCallback) {
          this.onMessageCallback(topic, rawPayload);
        }
      });

      this.client.on('error', (err) => {
        this.setStatus('ERROR');
        console.error('[Bitstream MQTT] Error:', err);
      });

      this.client.on('close', () => {
        if (this.status !== 'DISCONNECTED') {
          this.setStatus('DISCONNECTED');
          console.log('[Bitstream MQTT] Disconnected');
        }
      });

      this.client.on('offline', () => {
        this.setStatus('OFFLINE');
      });
    } catch (err) {
      this.setStatus('ERROR');
      console.error('[Bitstream MQTT] Connection error:', err);
    }

    return this.client;
  }

  subscribe(topic = DEFAULT_TOPIC, callback = null) {
    if (callback) {
      this.onMessageCallback = callback;
    }

    if (!topic) {
      return;
    }

    this.subscribedTopic = topic;

    if (this.client && this.client.connected) {
      this._doSubscribe(topic);
    }
  }

  _doSubscribe(topic) {
    if (!this.client) return;

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`[Bitstream MQTT] Subscription error for topic "${topic}":`, err);
      } else {
        console.log(`[Bitstream MQTT] Subscribed: ${topic}`);
      }
    });
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  onStatusChange(callback) {
    this.onStatusChangeCallback = callback;
  }

  setStatus(newStatus) {
    this.status = newStatus;
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(newStatus);
    }
  }

  getStatus() {
    return this.status;
  }

  disconnect() {
    if (this.client) {
      this.client.end(true, () => {
        this.setStatus('DISCONNECTED');
        console.log('[Bitstream MQTT] Cleanly disconnected');
      });
      this.client = null;
      this.subscribedTopic = null;
    }
  }
}

export const bitstreamMqtt = new BitstreamMqttService();
export default bitstreamMqtt;
