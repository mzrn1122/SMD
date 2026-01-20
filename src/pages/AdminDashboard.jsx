import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mqttService } from '../services/mqttService';
import { FleetMonitor } from '../components/admin/FleetMonitor';
import { RemoteCommands } from '../components/admin/RemoteCommands';
import { HardwareErrorFeed } from '../components/admin/HardwareErrorFeed';

import { LogOut, Shield, User, Activity } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export const AdminDashboard = () => {
    const { user, profile, signOut } = useAuth();
    const [devices, setDevices] = useState([]);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        // Initialize MQTT connection
        mqttService.connect();

        // Subscribe to device heartbeats
        mqttService.subscribe('smd/heartbeat', handleHeartbeat);

        // Subscribe to hardware errors
        mqttService.subscribe('smd/errors', handleError);

        // Load mock devices
        loadMockDevices();

        return () => {
            mqttService.disconnect();
        };
    }, []);

    const loadMockDevices = () => {
        const mockDevices = [
            {
                device_id: 'MOCK_DEVICE_001',
                status: 'online',
                rssi: -52,
                battery: 95,
                uptime: 345600, // 4 days
                last_heartbeat: new Date().toISOString(),
            },
            {
                device_id: 'SMD_DEVICE_002',
                status: 'online',
                rssi: -68,
                battery: 78,
                uptime: 172800, // 2 days
                last_heartbeat: new Date(Date.now() - 30000).toISOString(),
            },
            {
                device_id: 'SMD_DEVICE_003',
                status: 'warning',
                rssi: -75,
                battery: 25,
                uptime: 86400, // 1 day
                last_heartbeat: new Date(Date.now() - 120000).toISOString(),
            },
            {
                device_id: 'SMD_DEVICE_004',
                status: 'offline',
                rssi: -85,
                battery: 0,
                uptime: 0,
                last_heartbeat: new Date(Date.now() - 3600000).toISOString(),
            },
        ];

        setDevices(mockDevices);

        // Load mock errors
        const mockErrors = [
            {
                device_id: 'MOCK_DEVICE_001',
                error_type: 'Motor Jam',
                severity: 'error',
                message: 'Motor rotation blocked. Manual intervention required.',
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                resolved: false,
            },
            {
                device_id: 'SMD_DEVICE_002',
                error_type: 'WiFi Weak',
                severity: 'warning',
                message: 'WiFi signal strength below optimal threshold.',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                resolved: false,
            },
            {
                device_id: 'SMD_DEVICE_003',
                error_type: 'Low Battery',
                severity: 'warning',
                message: 'Battery level at 25%. Consider replacing soon.',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                resolved: false,
            },
            {
                device_id: 'MOCK_DEVICE_001',
                error_type: 'Sensor Fault',
                severity: 'error',
                message: 'IR sensor not responding. Verification may fail.',
                timestamp: new Date(Date.now() - 10800000).toISOString(),
                resolved: true,
            },
            {
                device_id: 'SMD_DEVICE_002',
                error_type: 'Temperature High',
                severity: 'warning',
                message: 'Device temperature above normal range (45°C).',
                timestamp: new Date(Date.now() - 14400000).toISOString(),
                resolved: true,
            },
        ];

        setErrors(mockErrors);
    };

    const handleHeartbeat = (heartbeatData) => {
        console.log('Heartbeat received:', heartbeatData);

        setDevices(prevDevices => {
            const existingIndex = prevDevices.findIndex(d => d.device_id === heartbeatData.device_id);

            if (existingIndex >= 0) {
                const updated = [...prevDevices];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    ...heartbeatData,
                    last_heartbeat: new Date().toISOString(),
                };
                return updated;
            } else {
                return [...prevDevices, { ...heartbeatData, last_heartbeat: new Date().toISOString() }];
            }
        });
    };

    const handleError = (errorData) => {
        console.log('Error received:', errorData);

        setErrors(prevErrors => [errorData, ...prevErrors]);

        toast.error(`${errorData.error_type} on ${errorData.device_id}`, {
            icon: '⚠️',
            duration: 5000,
        });
    };

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    const stats = {
        totalDevices: devices.length,
        onlineDevices: devices.filter(d => d.status === 'online').length,
        activeErrors: errors.filter(e => !e.resolved && e.severity === 'error').length,
        warnings: errors.filter(e => !e.resolved && e.severity === 'warning').length,
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
            <Toaster position="top-right" />

            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800 shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-secondary-600 rounded-lg flex items-center justify-center shadow-lg shadow-secondary-900/50">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-wide">ADMIN CONSOLE</h1>
                                <p className="text-xs text-slate-400 font-mono">SYSTEM STATUS: OPERATIONAL</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">

                            <div className="flex items-center gap-3 px-4 py-2 bg-neutral-100 dark:bg-surface-dark-elevated rounded-lg border border-border-light dark:border-border-dark">
                                <User className="w-5 h-5 text-text-light-secondary dark:text-text-dark-secondary" />
                                <div>
                                    <p className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">{profile?.email}</p>
                                    <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary capitalize">{profile?.role}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="relative max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card-hover">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center">
                                <Activity className="w-7 h-7 text-primary-400" />
                            </div>
                            <div>
                                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Total Devices</p>
                                <p className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">{stats.totalDevices}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-hover">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-success-500/20 rounded-xl flex items-center justify-center">
                                <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Online</p>
                                <p className="text-3xl font-bold text-success-500 dark:text-success-400">{stats.onlineDevices}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-hover">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-danger-500/20 rounded-xl flex items-center justify-center">
                                <Shield className="w-7 h-7 text-danger-400" />
                            </div>
                            <div>
                                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Active Errors</p>
                                <p className="text-3xl font-bold text-danger-500 dark:text-danger-400">{stats.activeErrors}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-hover">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                                <Activity className="w-7 h-7 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Warnings</p>
                                <p className="text-3xl font-bold text-warning-500 dark:text-warning-400">{stats.warnings}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Fleet Monitor */}
                    <div className="animate-slide-in">
                        <FleetMonitor devices={devices} />
                    </div>

                    {/* Remote Commands and Error Feed */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                            <RemoteCommands devices={devices} />
                        </div>
                        <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
                            <HardwareErrorFeed errors={errors} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
