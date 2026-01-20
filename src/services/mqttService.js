// MQTT Service for IoT Communication
// This service handles communication with the Pico 2 W device

class MQTTService {
    constructor() {
        this.connected = false;
        this.listeners = new Map();
        this.mockMode = true; // Set to false when connecting to real MQTT broker
    }

    // Connect to MQTT broker
    connect(brokerUrl, options = {}) {
        if (this.mockMode) {
            console.log('MQTT: Running in mock mode');
            this.connected = true;
            this.startMockDataStream();
            return Promise.resolve();
        }

        // In production, use mqtt.js library
        // const mqtt = require('mqtt');
        // this.client = mqtt.connect(brokerUrl, options);
        // this.setupListeners();
    }

    // Subscribe to a topic
    subscribe(topic, callback) {
        if (!this.listeners.has(topic)) {
            this.listeners.set(topic, []);
        }
        this.listeners.get(topic).push(callback);

        if (this.mockMode) {
            console.log(`MQTT: Subscribed to ${topic}`);
        } else {
            // this.client.subscribe(topic);
        }
    }

    // Publish to a topic
    publish(topic, message) {
        const payload = typeof message === 'string' ? message : JSON.stringify(message);

        if (this.mockMode) {
            console.log(`MQTT: Publishing to ${topic}:`, payload);
            // Simulate immediate response for sync commands
            if (topic === 'smd/sync') {
                setTimeout(() => {
                    this.emit('smd/sync/response', {
                        status: 'success',
                        message: 'Schedule updated successfully',
                    });
                }, 500);
            }
        } else {
            // this.client.publish(topic, payload);
        }
    }

    // Emit event to listeners
    emit(topic, data) {
        const listeners = this.listeners.get(topic) || [];
        listeners.forEach(callback => callback(data));
    }

    // Start mock data stream for testing
    startMockDataStream() {
        // Simulate periodic dose taken events
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every 10 seconds
                const mockLog = {
                    event: 'taken',
                    verification: {
                        face: Math.random() > 0.1, // 90% success rate
                        ir: Math.random() > 0.05,  // 95% success rate
                        load: Math.random() > 0.08, // 92% success rate
                    },
                    remaining_stock: Math.floor(Math.random() * 60),
                    timestamp: new Date().toISOString(),
                    device_id: 'MOCK_DEVICE_001',
                };
                this.emit('smd/logs', mockLog);
            }
        }, 10000);

        // Simulate device heartbeat
        setInterval(() => {
            const mockHeartbeat = {
                device_id: 'MOCK_DEVICE_001',
                rssi: -45 - Math.floor(Math.random() * 30), // -45 to -75 dBm
                battery: 85 + Math.floor(Math.random() * 15), // 85-100%
                uptime: Math.floor(Date.now() / 1000),
                status: 'online',
            };
            this.emit('smd/heartbeat', mockHeartbeat);
        }, 30000);

        // Simulate occasional hardware errors
        setInterval(() => {
            if (Math.random() > 0.95) { // 5% chance
                const errors = ['Motor Jam', 'Sensor Fault', 'Low Battery', 'WiFi Weak'];
                const mockError = {
                    device_id: 'MOCK_DEVICE_001',
                    error_type: errors[Math.floor(Math.random() * errors.length)],
                    severity: Math.random() > 0.5 ? 'warning' : 'error',
                    timestamp: new Date().toISOString(),
                };
                this.emit('smd/errors', mockError);
            }
        }, 20000);
    }

    // Disconnect from broker
    disconnect() {
        if (this.mockMode) {
            this.connected = false;
            console.log('MQTT: Disconnected');
        } else {
            // this.client.end();
        }
    }

    // Send remote command to device
    sendCommand(deviceId, command, params = {}) {
        const message = {
            device_id: deviceId,
            command: command,
            params: params,
            timestamp: new Date().toISOString(),
        };

        this.publish('smd/commands', message);
    }

    // Update schedule on device
    updateSchedule(deviceId, slots, time) {
        const message = {
            command: 'UPDATE_SCHEDULE',
            device_id: deviceId,
            slots: slots,
            time: time,
        };

        this.publish('smd/sync', message);
    }
}

// Export singleton instance
export const mqttService = new MQTTService();
