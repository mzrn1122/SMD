import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const InventoryEngine = ({ patientId, logs = [], onRefill }) => {
    const [virtualStock, setVirtualStock] = useState(60);
    const [physicalSlots, setPhysicalSlots] = useState(7);
    const [lastRefill, setLastRefill] = useState(new Date());

    useEffect(() => {
        // Calculate virtual stock based on logs
        const takenCount = logs.filter(log => log.event === 'taken').length;
        const remaining = 60 - takenCount;
        setVirtualStock(Math.max(0, remaining));

        // Calculate physical slots (7-day rotation)
        const slotsUsed = takenCount % 7;
        setPhysicalSlots(7 - slotsUsed);

        // Check for refill alert
        if (physicalSlots === 0 && remaining > 0) {
            toast.error('Physical slots empty! Please refill the dispenser.', {
                duration: 5000,
                icon: '🔔',
            });
        }
    }, [logs]);

    const stockPercentage = (virtualStock / 60) * 100;
    const slotsPercentage = (physicalSlots / 7) * 100;

    const getStockColor = (percentage) => {
        if (percentage > 50) return 'text-success-500';
        if (percentage > 20) return 'text-yellow-500';
        return 'text-danger-500';
    };

    const getStockBgColor = (percentage) => {
        if (percentage > 50) return 'bg-success-500';
        if (percentage > 20) return 'bg-yellow-500';
        return 'bg-danger-500';
    };

    const daysRemaining = Math.ceil(virtualStock / 1); // Assuming 1 dose per day

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Package className="w-6 h-6 text-primary-500" />
                    Inventory Engine (KK Model)
                </h3>
                <button
                    onClick={onRefill}
                    className="btn-secondary text-sm flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refill
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Virtual Stock */}
                <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Virtual Stock (60-Day)</p>
                            <p className={`text-4xl font-bold ${getStockColor(stockPercentage)}`}>
                                {virtualStock}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-400 mb-1">Days Remaining</p>
                            <p className="text-2xl font-bold text-white">{daysRemaining}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                            className={`absolute inset-y-0 left-0 ${getStockBgColor(stockPercentage)} transition-all duration-500 rounded-full`}
                            style={{ width: `${stockPercentage}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                        </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                        <TrendingDown className="w-4 h-4" />
                        <span>-1 per dose taken</span>
                    </div>
                </div>

                {/* Physical Slots */}
                <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Physical Slots</p>
                            <p className={`text-4xl font-bold ${getStockColor(slotsPercentage)}`}>
                                {physicalSlots}/7
                            </p>
                        </div>
                        {physicalSlots === 0 && (
                            <div className="bg-danger-500/20 p-3 rounded-lg">
                                <AlertTriangle className="w-8 h-8 text-danger-500 animate-pulse" />
                            </div>
                        )}
                    </div>

                    {/* Slot Indicators */}
                    <div className="flex gap-2 mb-4">
                        {Array.from({ length: 7 }, (_, i) => (
                            <div
                                key={i}
                                className={`
                  flex-1 h-12 rounded-lg transition-all duration-300
                  ${i < physicalSlots
                                        ? 'bg-success-500/30 border-2 border-success-500'
                                        : 'bg-slate-700/30 border-2 border-slate-600'
                                    }
                `}
                            >
                                <div className="h-full flex items-center justify-center text-xs font-bold">
                                    {i + 1}
                                </div>
                            </div>
                        ))}
                    </div>

                    {physicalSlots === 0 ? (
                        <div className="flex items-center gap-2 text-sm text-danger-400 bg-danger-500/10 p-2 rounded-lg">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-semibold">Refill Required!</span>
                        </div>
                    ) : (
                        <div className="text-sm text-slate-400">
                            {physicalSlots} slot{physicalSlots !== 1 ? 's' : ''} available
                        </div>
                    )}
                </div>
            </div>

            {/* Refill History */}
            <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Last Refill:</span>
                    <span className="text-white font-medium">
                        {lastRefill.toLocaleDateString()} at {lastRefill.toLocaleTimeString()}
                    </span>
                </div>
            </div>

            {/* Low Stock Warning */}
            {stockPercentage < 30 && stockPercentage > 0 && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-yellow-400">Low Stock Warning</p>
                        <p className="text-xs text-yellow-400/80 mt-1">
                            Only {virtualStock} doses remaining. Consider ordering a refill soon.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
