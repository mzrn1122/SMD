import { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, XCircle } from 'lucide-react';

export const HardwareErrorFeed = ({ errors = [] }) => {
    const [filter, setFilter] = useState('all'); // all, error, warning

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'error':
                return <XCircle className="w-5 h-5 text-danger-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-primary-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-slate-500" />;
        }
    };

    const getSeverityBadge = (severity) => {
        switch (severity) {
            case 'error':
                return (
                    <span className="status-badge bg-danger-500/20 text-danger-400 border border-danger-500/50">
                        Error
                    </span>
                );
            case 'warning':
                return (
                    <span className="status-badge bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">
                        Warning
                    </span>
                );
            case 'info':
                return (
                    <span className="status-badge bg-primary-500/20 text-primary-400 border border-primary-500/50">
                        Info
                    </span>
                );
            default:
                return (
                    <span className="status-badge bg-slate-500/20 text-slate-400 border border-slate-500/50">
                        Unknown
                    </span>
                );
        }
    };

    const getErrorTypeColor = (errorType) => {
        const colors = {
            'Motor Jam': 'text-danger-400',
            'Sensor Fault': 'text-yellow-400',
            'Low Battery': 'text-yellow-400',
            'WiFi Weak': 'text-primary-400',
            'Memory Error': 'text-danger-400',
            'Temperature High': 'text-yellow-400',
        };
        return colors[errorType] || 'text-slate-400';
    };

    const filteredErrors = errors.filter(error => {
        if (filter === 'all') return true;
        return error.severity === filter;
    });

    const errorCounts = {
        total: errors.length,
        error: errors.filter(e => e.severity === 'error').length,
        warning: errors.filter(e => e.severity === 'warning').length,
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    Hardware Error Feed
                </h3>

                {/* Error Count Summary */}
                <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                        <span className="text-slate-400">{errorCounts.error} Errors</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-slate-400">{errorCounts.warning} Warnings</span>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all'
                            ? 'bg-primary-500 text-white'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                        }`}
                >
                    All ({errorCounts.total})
                </button>
                <button
                    onClick={() => setFilter('error')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'error'
                            ? 'bg-danger-500 text-white'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                        }`}
                >
                    Errors ({errorCounts.error})
                </button>
                <button
                    onClick={() => setFilter('warning')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'warning'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                        }`}
                >
                    Warnings ({errorCounts.warning})
                </button>
            </div>

            {/* Error List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {filteredErrors.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Info className="w-8 h-8 text-success-500" />
                        </div>
                        <p className="text-slate-400">No {filter !== 'all' ? filter + 's' : 'errors'} to display</p>
                        <p className="text-sm text-slate-500 mt-2">All systems operating normally</p>
                    </div>
                ) : (
                    filteredErrors.map((error, index) => (
                        <div
                            key={index}
                            className={`
                bg-slate-800/30 rounded-lg p-4 border transition-all duration-200
                hover:bg-slate-800/50 hover:border-slate-600
                ${error.severity === 'error' ? 'border-danger-500/30' :
                                    error.severity === 'warning' ? 'border-yellow-500/30' :
                                        'border-slate-700/50'}
              `}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    {getSeverityIcon(error.severity)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div>
                                            <h4 className={`text-base font-semibold ${getErrorTypeColor(error.error_type)}`}>
                                                {error.error_type}
                                            </h4>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Device: <span className="text-white font-medium">{error.device_id}</span>
                                            </p>
                                        </div>
                                        {getSeverityBadge(error.severity)}
                                    </div>

                                    {error.message && (
                                        <p className="text-sm text-slate-300 mb-3 bg-slate-900/50 rounded p-2">
                                            {error.message}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>
                                            {new Date(error.timestamp).toLocaleString()}
                                        </span>
                                        {error.resolved ? (
                                            <span className="text-success-400 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-success-400 rounded-full"></div>
                                                Resolved
                                            </span>
                                        ) : (
                                            <span className="text-yellow-400 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Real-time Indicator */}
            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span>Real-time monitoring active</span>
            </div>
        </div>
    );
};
