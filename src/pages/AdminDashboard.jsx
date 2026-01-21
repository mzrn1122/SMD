import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { mqttService } from '../services/mqttService';
import {
    Shield, Activity, AlertTriangle, Wifi, WifiOff,
    Battery, Clock, LogOut, User, Send, RefreshCw,
    RotateCcw, Power, XCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export const AdminDashboard = () => {
    const { user, profile, signOut } = useAuth();
    const [devices, setDevices] = useState([]);
    const [errors, setErrors] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');
    const [customCommand, setCustomCommand] = useState('{"command": "CUSTOM_ACTION", "params": {}}');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        mqttService.connect();
        mqttService.subscribe('smd/heartbeat', handleHeartbeat);
        mqttService.subscribe('smd/errors', handleError);
        loadMockData();
        return () => mqttService.disconnect();
    }, []);

    const loadMockData = () => {
        const mockDevices = [
            {
                device_id: 'MOCK_DEVICE_001',
                status: 'online',
                rssi: -52,
                battery: 95,
                uptime: 345600,
                last_heartbeat: new Date().toISOString(),
                signal: 'Good'
            },
            {
                device_id: 'SMD_DEVICE_002',
                status: 'online',
                rssi: -68,
                battery: 78,
                uptime: 172800,
                last_heartbeat: new Date().toISOString(),
                signal: 'Fair'
            },
            {
                device_id: 'SMD_DEVICE_003',
                status: 'warning',
                rssi: -75,
                battery: 25,
                uptime: 86400,
                last_heartbeat: new Date().toISOString(),
                signal: 'Weak'
            },
            {
                device_id: 'SMD_DEVICE_004',
                status: 'offline',
                rssi: -85,
                battery: 0,
                uptime: 0,
                last_heartbeat: new Date(Date.now() - 3600000).toISOString(),
                signal: 'Weak'
            }
        ];

        const mockErrors = [
            {
                device_id: 'MOCK_DEVICE_001',
                error_type: 'Motor Jam',
                severity: 'error',
                message: 'Motor rotation blocked. Manual intervention required.',
                timestamp: new Date().toISOString(),
                resolved: false
            },
            {
                device_id: 'SMD_DEVICE_002',
                error_type: 'WiFi Weak',
                severity: 'warning',
                message: 'WiFi signal strength below optimal threshold.',
                timestamp: new Date().toISOString(),
                resolved: false
            },
            {
                device_id: 'SMD_DEVICE_003',
                error_type: 'Low Battery',
                severity: 'warning',
                message: 'Battery level at 25%. Consider replacing soon.',
                timestamp: new Date().toISOString(),
                resolved: false
            },
            {
                device_id: 'MOCK_DEVICE_001',
                error_type: 'Sensor Fault',
                severity: 'error',
                message: 'IR sensor not responding. Verification may fail.',
                timestamp: new Date().toISOString(),
                resolved: false
            },
            {
                device_id: 'SMD_DEVICE_002',
                error_type: 'Temperature High',
                severity: 'warning',
                message: 'Device temperature above normal range (45°C).',
                timestamp: new Date().toISOString(),
                resolved: false
            }
        ];

        setDevices(mockDevices);
        setErrors(mockErrors);
    };

    const handleHeartbeat = (data) => {
        setDevices(prev => {
            const idx = prev.findIndex(d => d.device_id === data.device_id);
            if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], ...data, last_heartbeat: new Date().toISOString() };
                return updated;
            }
            return [...prev, { ...data, last_heartbeat: new Date().toISOString() }];
        });
    };

    const handleError = (data) => {
        setErrors(prev => [data, ...prev]);
        toast.error(`${data.error_type} on ${data.device_id}`);
    };

    const sendCommand = async (command, params = {}) => {
        if (!selectedDevice) {
            toast.error('Please select a device first');
            return;
        }
        setSending(true);
        try {
            mqttService.sendCommand(selectedDevice, command, params);
            toast.success(`Command "${command}" sent to ${selectedDevice}`);
            setTimeout(() => {
                toast.success(`Device acknowledged command`);
            }, 1000);
        } catch (error) {
            toast.error('Failed to send command');
        } finally {
            setSending(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            // Force navigation to login page
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Even if signOut fails, try to clear local state and redirect
            try {
                await supabase.auth.signOut();
                window.location.href = '/login';
            } catch (fallbackError) {
                console.error('Fallback logout error:', fallbackError);
                toast.error('Failed to log out. Please try again.');
            }
        }
    };

    const stats = {
        totalDevices: devices.length,
        onlineDevices: devices.filter(d => d.status === 'online').length,
        activeErrors: errors.filter(e => !e.resolved && e.severity === 'error').length,
        warnings: errors.filter(e => !e.resolved && e.severity === 'warning').length
    };

    const getSignalBars = (rssi) => {
        if (rssi >= -50) return 3;
        if (rssi >= -70) return 2;
        return 1;
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
            <Toaster position="top-right" />

            {/* Top Navigation - Dark Theme */}
            <nav style={{
                background: '#1F2937',
                borderBottom: '1px solid #374151',
                padding: '0.75rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Shield style={{ width: '24px', height: '24px', color: 'white' }} />
                    <div>
                        <h1 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'white', margin: 0, letterSpacing: '0.05em' }}>
                            ADMIN CONSOLE
                        </h1>
                        <p style={{ fontSize: '0.625rem', color: '#9CA3AF', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            SYSTEM STATUS: OPERATIONAL
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 1rem',
                        background: '#374151',
                        borderRadius: '8px',
                        border: '1px solid #4B5563'
                    }}>
                        <User style={{ width: '16px', height: '16px', color: '#9CA3AF' }} />
                        <div>
                            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'white', margin: 0 }}>
                                {profile?.email || 'admin@smd.com'}
                            </p>
                            <p style={{ fontSize: '0.625rem', color: '#9CA3AF', margin: 0, textTransform: 'capitalize' }}>
                                {profile?.role || 'Admin'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#374151',
                            border: '1px solid #4B5563',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            color: 'white',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#4B5563'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#374151'}
                    >
                        <LogOut style={{ width: '16px', height: '16px' }} />
                        Logout
                    </button>
                </div>
            </nav>

            <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #E5E7EB'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: '#EEF2FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Activity style={{ width: '24px', height: '24px', color: '#6366F1' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0, marginBottom: '0.25rem' }}>
                                    Total Devices
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                                    {stats.totalDevices}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #E5E7EB'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: '#DCFCE7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Wifi style={{ width: '24px', height: '24px', color: '#16A34A' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0, marginBottom: '0.25rem' }}>
                                    Online
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                                    {stats.onlineDevices}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #E5E7EB'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: '#FEE2E2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Shield style={{ width: '24px', height: '24px', color: '#DC2626' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0, marginBottom: '0.25rem' }}>
                                    Active Errors
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                                    {stats.activeErrors}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #E5E7EB'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: '#FEF3C7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <AlertTriangle style={{ width: '24px', height: '24px', color: '#F59E0B' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0, marginBottom: '0.25rem' }}>
                                    Warnings
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                                    {stats.warnings}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content - 2 Columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* LEFT: Device Table + Remote Commands */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Fleet Monitor Table */}
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            border: '1px solid #E5E7EB'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', margin: 0 }}>
                                    {stats.onlineDevices} / {stats.totalDevices} Online
                                </h3>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', fontSize: '0.875rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF' }}>Device ID</th>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF' }}>Status</th>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF' }}>WiFi Signal</th>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF' }}>RSSI</th>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF' }}>Battery</th>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF' }}>Uptime</th>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF' }}>Last Heartbeat</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {devices.map((device, idx) => {
                                            const bars = getSignalBars(device.rssi);
                                            return (
                                                <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            {device.status === 'online' ? (
                                                                <Wifi style={{ width: '16px', height: '16px', color: '#10B981' }} />
                                                            ) : (
                                                                <WifiOff style={{ width: '16px', height: '16px', color: '#9CA3AF' }} />
                                                            )}
                                                            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{device.device_id}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                                        <span style={{
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '12px',
                                                            fontSize: '0.625rem',
                                                            fontWeight: '600',
                                                            textTransform: 'uppercase',
                                                            background: device.status === 'online' ? '#DCFCE7' : device.status === 'warning' ? '#FEF3C7' : '#F3F4F6',
                                                            color: device.status === 'online' ? '#16A34A' : device.status === 'warning' ? '#D97706' : '#6B7280'
                                                        }}>
                                                            ● {device.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{ display: 'flex', gap: '2px', height: '16px', alignItems: 'flex-end' }}>
                                                                {[1, 2, 3].map(bar => (
                                                                    <div key={bar} style={{
                                                                        width: '3px',
                                                                        height: `${bar * 5}px`,
                                                                        background: bar <= bars ? '#10B981' : '#E5E7EB',
                                                                        borderRadius: '2px'
                                                                    }} />
                                                                ))}
                                                            </div>
                                                            <span style={{
                                                                fontSize: '0.75rem',
                                                                color: bars === 3 ? '#10B981' : bars === 2 ? '#F59E0B' : '#DC2626'
                                                            }}>
                                                                {device.signal}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#6B7280' }}>
                                                        {device.rssi} dBm
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{
                                                                flex: 1,
                                                                height: '6px',
                                                                background: '#F3F4F6',
                                                                borderRadius: '3px',
                                                                overflow: 'hidden',
                                                                maxWidth: '60px'
                                                            }}>
                                                                <div style={{
                                                                    height: '100%',
                                                                    width: `${device.battery}%`,
                                                                    background: device.battery > 50 ? '#10B981' : device.battery > 20 ? '#F59E0B' : '#DC2626',
                                                                    transition: 'width 0.3s'
                                                                }} />
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                                                {device.battery}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#6B7280' }}>
                                                        {Math.floor(device.uptime / 3600)}h {Math.floor((device.uptime % 3600) / 60)}m
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#6B7280' }}>
                                                        {new Date(device.last_heartbeat).toLocaleTimeString()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Remote Commands */}
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            border: '1px solid #E5E7EB'
                        }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                                    Select Target Device
                                </label>
                                <select
                                    value={selectedDevice}
                                    onChange={(e) => setSelectedDevice(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        borderRadius: '8px',
                                        border: '1px solid #D1D5DB',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="">-- Select a device --</option>
                                    {devices.map(d => (
                                        <option key={d.device_id} value={d.device_id}>
                                            {d.device_id} ({d.status})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                <button
                                    onClick={() => sendCommand('REMOTE_RESET')}
                                    disabled={!selectedDevice || sending}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        background: '#FEF3C7',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: selectedDevice ? 'pointer' : 'not-allowed',
                                        opacity: selectedDevice ? 1 : 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#92400E'
                                    }}
                                >
                                    <RotateCcw style={{ width: '16px', height: '16px' }} />
                                    Remote Reset
                                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#6B7280' }}>
                                        Restart the device remotely
                                    </span>
                                </button>
                            </div>

                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                                    Custom Command (JSON)
                                </label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={customCommand}
                                        onChange={(e) => setCustomCommand(e.target.value)}
                                        placeholder='{"command": "CUSTOM_ACTION", "params": {}}'
                                        disabled={!selectedDevice}
                                        style={{
                                            flex: 1,
                                            padding: '0.625rem',
                                            borderRadius: '8px',
                                            border: '1px solid #D1D5DB',
                                            fontSize: '0.75rem',
                                            fontFamily: 'monospace'
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            try {
                                                const cmd = JSON.parse(customCommand);
                                                sendCommand(cmd.command, cmd.params || {});
                                            } catch {
                                                toast.error('Invalid JSON format');
                                            }
                                        }}
                                        disabled={!selectedDevice || sending}
                                        style={{
                                            padding: '0.625rem 1rem',
                                            background: '#14B8A6',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: selectedDevice ? 'pointer' : 'not-allowed',
                                            opacity: selectedDevice ? 1 : 0.5,
                                            color: 'white'
                                        }}
                                    >
                                        <Send style={{ width: '16px', height: '16px' }} />
                                    </button>
                                </div>
                                <p style={{ fontSize: '0.625rem', color: '#6B7280', marginTop: '0.5rem' }}>
                                    Send custom MQTT commands in JSON format
                                </p>
                            </div>

                            {/* Recent Commands */}
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                    Recent Commands
                                </h4>
                                {[
                                    { cmd: 'FORCE_SYNC', device: 'MOCK_DEVICE_001', time: '2 min ago' },
                                    { cmd: 'REMOTE_RESET', device: 'MOCK_DEVICE_001', time: '15 min ago' },
                                    { cmd: 'UPDATE_SCHEDULE', device: 'MOCK_DEVICE_001', time: '1 hour ago' }
                                ].map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.5rem',
                                        background: '#F9FAFB',
                                        borderRadius: '6px',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.75rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '4px', height: '4px', background: '#10B981', borderRadius: '50%' }} />
                                            <span style={{ fontWeight: '600', color: '#374151' }}>{item.cmd}</span>
                                            <span style={{ color: '#9CA3AF' }}>→</span>
                                            <span style={{ color: '#6B7280' }}>{item.device}</span>
                                        </div>
                                        <span style={{ color: '#9CA3AF' }}>{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Hardware Error Feed */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #E5E7EB'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <AlertTriangle style={{ width: '20px', height: '20px', color: '#F59E0B' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                        {errors.filter(e => e.severity === 'error').length} Errors
                                    </span>
                                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                        ● {errors.filter(e => e.severity === 'warning').length} Warnings
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
                            {errors.map((error, idx) => (
                                <div key={idx} style={{
                                    background: error.severity === 'error' ? '#F3F4F6' : '#FFFBEB',
                                    border: `1px solid ${error.severity === 'error' ? '#E5E7EB' : '#FDE68A'}`,
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    marginBottom: '0.75rem'
                                }}>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: error.severity === 'error' ? '#FEE2E2' : '#FEF3C7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            {error.severity === 'error' ? (
                                                <XCircle style={{ width: '16px', height: '16px', color: '#DC2626' }} />
                                            ) : (
                                                <AlertTriangle style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <div>
                                                    <h4 style={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: '700',
                                                        color: error.severity === 'error' ? '#DC2626' : '#D97706',
                                                        margin: 0,
                                                        marginBottom: '0.25rem'
                                                    }}>
                                                        {error.error_type}
                                                    </h4>
                                                    <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>
                                                        Device: <span style={{ fontWeight: '600', color: '#374151' }}>{error.device_id}</span>
                                                    </p>
                                                </div>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.625rem',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    background: error.severity === 'error' ? '#FEE2E2' : '#FEF3C7',
                                                    color: error.severity === 'error' ? '#991B1B' : '#92400E'
                                                }}>
                                                    {error.severity}
                                                </span>
                                            </div>
                                            <p style={{
                                                fontSize: '0.75rem',
                                                color: '#4B5563',
                                                background: 'rgba(0,0,0,0.03)',
                                                padding: '0.5rem',
                                                borderRadius: '4px',
                                                marginBottom: '0.5rem'
                                            }}>
                                                {error.message}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.625rem', color: '#9CA3AF' }}>
                                                <span>{new Date(error.timestamp).toLocaleString()}</span>
                                                {error.resolved ? (
                                                    <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <div style={{ width: '4px', height: '4px', background: '#10B981', borderRadius: '50%' }} />
                                                        Resolved
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <div style={{ width: '4px', height: '4px', background: '#F59E0B', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            marginTop: '1rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid #E5E7EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '0.75rem',
                            color: '#6B7280'
                        }}>
                            <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                            Real-time monitoring active
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};