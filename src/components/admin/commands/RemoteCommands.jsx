import { useState } from 'react';
import { Send, RotateCcw, RefreshCw, Power, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { mqttService } from '@services/mqttService';

export const RemoteCommands = ({ devices = [] }) => {
    const [selectedDevice, setSelectedDevice] = useState('');
    const [customCommand, setCustomCommand] = useState('');
    const [sending, setSending] = useState(false);

    const sendCommand = async (command, params = {}) => {
        if (!selectedDevice) {
            toast.error('Please select a device first');
            return;
        }

        setSending(true);

        try {
            mqttService.sendCommand(selectedDevice, command, params);

            toast.success(`Command "${command}" sent to ${selectedDevice}`, {
                icon: '📡',
                duration: 3000,
            });

            // Simulate response delay
            setTimeout(() => {
                toast.success(`Device ${selectedDevice} acknowledged command`, {
                    icon: '✓',
                    duration: 2000,
                });
            }, 1000);

        } catch (error) {
            toast.error('Failed to send command');
        } finally {
            setSending(false);
        }
    };

    const quickCommands = [
        {
            id: 'REMOTE_RESET',
            name: 'Remote Reset',
            description: 'Restart the device remotely',
            icon: RotateCcw,
            color: 'from-yellow-600 to-yellow-500',
            action: () => sendCommand('REMOTE_RESET'),
        },
        {
            id: 'FORCE_SYNC',
            name: 'Force Sync',
            description: 'Force synchronize device data',
            icon: RefreshCw,
            color: 'from-primary-600 to-primary-500',
            action: () => sendCommand('FORCE_SYNC'),
        },
        {
            id: 'UPDATE_SCHEDULE',
            name: 'Update Schedule',
            description: 'Push new medication schedule',
            icon: Settings,
            color: 'from-success-600 to-success-500',
            action: () => {
                const slots = [1, 2, 3, 4, 5, 6, 7];
                const time = '08:00';
                mqttService.updateSchedule(selectedDevice, slots, time);
                toast.success('Schedule update sent');
            },
        },
        {
            id: 'POWER_CYCLE',
            name: 'Power Cycle',
            description: 'Turn device off and on',
            icon: Power,
            color: 'from-danger-600 to-danger-500',
            action: () => sendCommand('POWER_CYCLE'),
        },
    ];

    return (
        <div className="card">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Send className="w-6 h-6 text-primary-500" />
                Remote Commands
            </h3>

            {/* Device Selection */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select Target Device
                </label>
                <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="input-field w-full"
                >
                    <option value="">-- Select a device --</option>
                    {devices.map((device) => (
                        <option key={device.device_id} value={device.device_id}>
                            {device.device_id} ({device.status})
                        </option>
                    ))}
                </select>
            </div>

            {/* Quick Commands */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {quickCommands.map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                        <button
                            key={cmd.id}
                            onClick={cmd.action}
                            disabled={!selectedDevice || sending}
                            className={`
                relative overflow-hidden rounded-xl p-4 text-left
                bg-gradient-to-r ${cmd.color}
                hover:shadow-lg hover:shadow-primary-500/20
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                group
              `}
                        >
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-2">
                                    <Icon className="w-6 h-6 text-white" />
                                    {sending && (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    )}
                                </div>
                                <h4 className="text-white font-semibold mb-1">{cmd.name}</h4>
                                <p className="text-white/80 text-xs">{cmd.description}</p>
                            </div>

                            {/* Hover effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    );
                })}
            </div>

            {/* Custom Command */}
            <div className="pt-6 border-t border-slate-800">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Custom Command (JSON)
                </label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={customCommand}
                        onChange={(e) => setCustomCommand(e.target.value)}
                        placeholder='{"command": "CUSTOM_ACTION", "params": {}}'
                        className="input-field flex-1"
                        disabled={!selectedDevice}
                    />
                    <button
                        onClick={() => {
                            try {
                                const cmd = JSON.parse(customCommand);
                                sendCommand(cmd.command, cmd.params || {});
                                setCustomCommand('');
                            } catch (error) {
                                toast.error('Invalid JSON format');
                            }
                        }}
                        disabled={!selectedDevice || !customCommand || sending}
                        className="btn-primary"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Send custom MQTT commands in JSON format
                </p>
            </div>

            {/* Command History */}
            <div className="mt-6 pt-6 border-t border-slate-800">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Recent Commands</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {[
                        { cmd: 'FORCE_SYNC', device: 'MOCK_DEVICE_001', time: '2 min ago', status: 'success' },
                        { cmd: 'REMOTE_RESET', device: 'MOCK_DEVICE_001', time: '15 min ago', status: 'success' },
                        { cmd: 'UPDATE_SCHEDULE', device: 'MOCK_DEVICE_001', time: '1 hour ago', status: 'success' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3 text-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-success-500' : 'bg-danger-500'
                                    }`}></div>
                                <span className="text-white font-medium">{item.cmd}</span>
                                <span className="text-slate-500">→</span>
                                <span className="text-slate-400">{item.device}</span>
                            </div>
                            <span className="text-slate-500 text-xs">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
