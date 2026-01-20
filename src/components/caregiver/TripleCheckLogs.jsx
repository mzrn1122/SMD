import { CheckCircle2, XCircle, User, Radio, Scale } from 'lucide-react';

export const TripleCheckLogs = ({ logs = [] }) => {
    const getVerificationIcon = (verified) => {
        return verified ? (
            <CheckCircle2 className="w-5 h-5 text-success-500" />
        ) : (
            <XCircle className="w-5 h-5 text-danger-500" />
        );
    };

    const getVerificationBadge = (verified) => {
        return verified ? (
            <span className="status-badge bg-success-500/20 text-success-400 border border-success-500/50">
                ✓ Pass
            </span>
        ) : (
            <span className="status-badge bg-danger-500/20 text-danger-400 border border-danger-500/50">
                ✗ Fail
            </span>
        );
    };

    const calculateSuccessRate = (logs, checkType) => {
        const total = logs.filter(log => log.verification).length;
        if (total === 0) return 0;

        const successful = logs.filter(
            log => log.verification && log.verification[checkType]
        ).length;

        return ((successful / total) * 100).toFixed(1);
    };

    const faceRate = calculateSuccessRate(logs, 'face');
    const irRate = calculateSuccessRate(logs, 'ir');
    const loadRate = calculateSuccessRate(logs, 'load');

    return (
        <div className="card">
            <h3 className="text-xl font-bold text-white mb-6">Triple-Check Verification Logs</h3>

            {/* Success Rate Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Face ID</p>
                            <p className="text-2xl font-bold text-white">{faceRate}%</p>
                        </div>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                            style={{ width: `${faceRate}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-success-500/20 rounded-lg flex items-center justify-center">
                            <Radio className="w-5 h-5 text-success-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">IR Sensor</p>
                            <p className="text-2xl font-bold text-white">{irRate}%</p>
                        </div>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-success-500 to-success-400 transition-all duration-500"
                            style={{ width: `${irRate}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                            <Scale className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Load Cell</p>
                            <p className="text-2xl font-bold text-white">{loadRate}%</p>
                        </div>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                            style={{ width: `${loadRate}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Detailed Logs */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {logs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <p>No verification logs available</p>
                    </div>
                ) : (
                    logs.slice(0, 20).map((log, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {new Date(log.created_at || log.timestamp).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Event: <span className="text-white font-medium">{log.event}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    {log.event === 'taken' ? (
                                        <span className="status-badge bg-success-500/20 text-success-400 border border-success-500/50">
                                            ✓ Taken
                                        </span>
                                    ) : (
                                        <span className="status-badge bg-danger-500/20 text-danger-400 border border-danger-500/50">
                                            ✗ Missed
                                        </span>
                                    )}
                                </div>
                            </div>

                            {log.verification && (
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-3">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400">Face ID</p>
                                            <div className="mt-1">
                                                {getVerificationBadge(log.verification.face)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-3">
                                        <Radio className="w-4 h-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400">IR Sensor</p>
                                            <div className="mt-1">
                                                {getVerificationBadge(log.verification.ir)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-3">
                                        <Scale className="w-4 h-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400">Load Cell</p>
                                            <div className="mt-1">
                                                {getVerificationBadge(log.verification.load)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {log.remaining_stock !== undefined && (
                                <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-400">
                                    Remaining Stock: <span className="text-white font-medium">{log.remaining_stock}</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
