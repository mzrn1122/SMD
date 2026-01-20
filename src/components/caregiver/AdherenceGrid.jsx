import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export const AdherenceGrid = ({ logs = [] }) => {
    // Get last 7 days of logs
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date;
    });

    const getSlotStatus = (dayIndex) => {
        const targetDate = last7Days[dayIndex];
        const dayLogs = logs.filter(log => {
            const logDate = new Date(log.created_at || log.timestamp);
            return logDate.toDateString() === targetDate.toDateString();
        });

        if (dayLogs.length === 0) {
            // Check if it's a future date
            if (targetDate > new Date()) {
                return 'upcoming';
            }
            return 'missed';
        }

        const takenLog = dayLogs.find(log => log.event === 'taken');
        return takenLog ? 'taken' : 'missed';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'taken':
                return 'bg-success-500/20 border-success-500 text-success-400';
            case 'missed':
                return 'bg-danger-500/20 border-danger-500 text-danger-400';
            case 'upcoming':
                return 'bg-slate-700/20 border-slate-600 text-slate-400';
            default:
                return 'bg-slate-700/20 border-slate-600 text-slate-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'taken':
                return <CheckCircle2 className="w-8 h-8" />;
            case 'missed':
                return <XCircle className="w-8 h-8" />;
            case 'upcoming':
                return <Clock className="w-8 h-8" />;
            default:
                return <Clock className="w-8 h-8" />;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'taken':
                return 'Taken';
            case 'missed':
                return 'Missed';
            case 'upcoming':
                return 'Upcoming';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="card">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                7-Day Adherence Grid
            </h3>

            <div className="grid grid-cols-7 gap-3">
                {last7Days.map((date, index) => {
                    const status = getSlotStatus(index);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNumber = date.getDate();

                    return (
                        <div
                            key={index}
                            className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${getStatusColor(status)}
                hover:scale-105 hover:shadow-lg
              `}
                        >
                            <div className="text-center">
                                <div className="text-xs font-semibold uppercase mb-2 opacity-70">
                                    {dayName}
                                </div>
                                <div className="text-2xl font-bold mb-3">
                                    {dayNumber}
                                </div>
                                <div className="flex justify-center mb-2">
                                    {getStatusIcon(status)}
                                </div>
                                <div className="text-xs font-medium">
                                    {getStatusLabel(status)}
                                </div>
                            </div>

                            {/* Slot number indicator */}
                            <div className="absolute top-2 right-2 w-6 h-6 bg-slate-800/50 rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                    <span className="text-slate-400">Taken</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
                    <span className="text-slate-400">Missed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                    <span className="text-slate-400">Upcoming</span>
                </div>
            </div>
        </div>
    );
};
