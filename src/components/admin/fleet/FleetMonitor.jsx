import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity, AlertTriangle } from 'lucide-react';

export const FleetMonitor = ({ devices = [] }) => {
    const getSignalStrength = (rssi) => {
        if (rssi >= -50) return { level: 'Excellent', color: 'text-success-500', bars: 4 };
        if (rssi >= -60) return { level: 'Good', color: 'text-success-400', bars: 3 };
        if (rssi >= -70) return { level: 'Fair', color: 'text-yellow-500', bars: 2 };
        return { level: 'Weak', color: 'text-danger-500', bars: 1 };
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'online':
                return (
                    <span className="status-badge bg-success-500/20 text-success-400 border border-success-500/50">
                        ● Online
                    </span>
                );
            case 'offline':
                return (
                    <span className="status-badge bg-danger-500/20 text-danger-400 border border-danger-500/50">
                        ● Offline
                    </span>
                );
            case 'warning':
                return (
                    <span className="status-badge bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">
                        ⚠ Warning
                    </span>
                );
            default:
                return (
                    <span className="status-badge bg-slate-500/20 text-slate-400 border border-slate-500/50">
                        ● Unknown
                    </span>
                );
        }
    };

    const getUptimeString = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const SignalBars = ({ bars }) => (
        <div className="flex items-end gap-0.5 h-5">
            {[1, 2, 3, 4].map((bar) => (
                <div
                    key={bar}
                    className={`w-1 rounded-sm transition-all ${bar <= bars ? 'bg-success-500' : 'bg-slate-700'
                        }`}
                    style={{ height: `${bar * 25}%` }}
                ></div>
            ))}
        </div>
    );

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-primary-500" />
                    Fleet Monitor
                </h3>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-400">
                        {devices.filter(d => d.status === 'online').length} / {devices.length} Online
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Device ID</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">WiFi Signal</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">RSSI</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Battery</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Uptime</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Last Heartbeat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-12 text-slate-500">
                                    No devices registered
                                </td>
                            </tr>
                        ) : (
                            devices.map((device, index) => {
                                const signal = getSignalStrength(device.rssi);
                                return (
                                    <tr
                                        key={index}
                                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                                                    {device.status === 'online' ? (
                                                        <Wifi className="w-4 h-4 text-primary-400" />
                                                    ) : (
                                                        <WifiOff className="w-4 h-4 text-slate-500" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-white">{device.device_id}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {getStatusBadge(device.status)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <SignalBars bars={signal.bars} />
                                                <span className={`text-sm font-medium ${signal.color}`}>
                                                    {signal.level}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm text-slate-300">{device.rssi} dBm</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden max-w-[80px]">
                                                    <div
                                                        className={`h-full transition-all ${device.battery > 50 ? 'bg-success-500' :
                                                                device.battery > 20 ? 'bg-yellow-500' : 'bg-danger-500'
                                                            }`}
                                                        style={{ width: `${device.battery}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-slate-300">{device.battery}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm text-slate-300">
                                                {getUptimeString(device.uptime)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm text-slate-400">
                                                {new Date(device.last_heartbeat || Date.now()).toLocaleTimeString()}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
