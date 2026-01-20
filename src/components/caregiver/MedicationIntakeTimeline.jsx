import { Check, X, Clock } from 'lucide-react';

export const MedicationIntakeTimeline = ({ logs = [] }) => {
    // Group logs by date
    const groupedByDate = logs.reduce((acc, log) => {
        const date = new Date(log.timestamp || log.created_at);
        const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        if (!acc[dateKey]) {
            acc[dateKey] = {
                date: date,
                dateKey: dateKey,
                intakes: []
            };
        }

        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        acc[dateKey].intakes.push({
            time: time,
            status: log.event === 'taken' ? 'taken' : 'missed',
            timestamp: date,
        });

        return acc;
    }, {});

    // Convert to array and sort by date (most recent first)
    const timeline = Object.values(groupedByDate)
        .sort((a, b) => b.date - a.date)
        .slice(0, 14); // Show last 14 days

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-teal-600" />
                        Medication Intake Timeline
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Daily medication schedule tracking
                    </p>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
                {timeline.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No medication intake records</p>
                    </div>
                ) : (
                    timeline.map((day, index) => (
                        <div
                            key={day.dateKey}
                            className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-colors"
                        >
                            {/* Date */}
                            <div className="flex-shrink-0 w-20 text-center">
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {day.date.toLocaleDateString('en-US', { month: 'short' })}
                                </div>
                                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                    {day.date.getDate()}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                    {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-16 w-px bg-slate-300 dark:bg-slate-600"></div>

                            {/* Time Ticks */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {day.intakes
                                        .sort((a, b) => a.timestamp - b.timestamp)
                                        .map((intake, idx) => (
                                            <div
                                                key={idx}
                                                className={`
                                                    flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
                                                    ${intake.status === 'taken'
                                                        ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-500 dark:border-teal-600'
                                                        : 'bg-coral-50 dark:bg-coral-900/20 border-coral-500 dark:border-coral-600'
                                                    }
                                                `}
                                            >
                                                {intake.status === 'taken' ? (
                                                    <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={3} />
                                                ) : (
                                                    <X className="w-4 h-4 text-coral-600 dark:text-coral-400" strokeWidth={3} />
                                                )}
                                                <span className={`
                                                    text-sm font-semibold
                                                    ${intake.status === 'taken'
                                                        ? 'text-teal-700 dark:text-teal-300'
                                                        : 'text-coral-700 dark:text-coral-300'
                                                    }
                                                `}>
                                                    {intake.time}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>

                                {/* Summary */}
                                <div className="mt-2 flex items-center gap-4 text-xs">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Total: <span className="font-semibold text-slate-900 dark:text-slate-100">{day.intakes.length}</span>
                                    </span>
                                    <span className="text-teal-600 dark:text-teal-400">
                                        Taken: <span className="font-semibold">{day.intakes.filter(i => i.status === 'taken').length}</span>
                                    </span>
                                    {day.intakes.filter(i => i.status === 'missed').length > 0 && (
                                        <span className="text-coral-600 dark:text-coral-400">
                                            Missed: <span className="font-semibold">{day.intakes.filter(i => i.status === 'missed').length}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-teal-500"></div>
                        <span className="text-slate-700 dark:text-slate-300">Taken</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-coral-500"></div>
                        <span className="text-slate-700 dark:text-slate-300">Missed</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
