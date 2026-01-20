import { Calendar, TrendingUp } from 'lucide-react';

export const ClinicalTimeline = ({ lastVisit, nextVisit }) => {
    const lastVisitDate = lastVisit ? new Date(lastVisit) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const nextVisitDate = nextVisit ? new Date(nextVisit) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const totalDuration = nextVisitDate - lastVisitDate;
    const elapsed = Date.now() - lastVisitDate;
    const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    const daysUntilNext = Math.ceil((nextVisitDate - Date.now()) / (1000 * 60 * 60 * 24));
    const daysSinceLast = Math.floor((Date.now() - lastVisitDate) / (1000 * 60 * 60 * 24));

    return (
        <div className="card">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary-500" />
                Clinical Timeline
            </h3>

            <div className="space-y-6">
                {/* Timeline Visualization */}
                <div className="relative">
                    {/* Progress Bar */}
                    <div className="relative h-4 bg-slate-800/50 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>
                    </div>

                    {/* Timeline Markers */}
                    <div className="flex justify-between mt-4">
                        <div className="flex flex-col items-start">
                            <div className="w-3 h-3 bg-success-500 rounded-full mb-2 shadow-lg shadow-success-500/50"></div>
                            <p className="text-xs text-slate-400 font-medium">Last Visit</p>
                            <p className="text-sm text-white font-semibold mt-1">
                                {lastVisitDate.toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {daysSinceLast} days ago
                            </p>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="w-3 h-3 bg-primary-500 rounded-full mb-2 shadow-lg shadow-primary-500/50 animate-pulse"></div>
                            <p className="text-xs text-slate-400 font-medium">Next Visit</p>
                            <p className="text-sm text-white font-semibold mt-1">
                                {nextVisitDate.toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                in {daysUntilNext} days
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-primary-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Progress</p>
                                <p className="text-2xl font-bold text-white">{progress.toFixed(0)}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-success-500/20 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-success-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Days Until</p>
                                <p className="text-2xl font-bold text-white">{daysUntilNext}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visit Notes */}
                <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
                    <p className="text-sm text-primary-300 font-medium mb-2">
                        📋 Upcoming Visit Preparation
                    </p>
                    <p className="text-xs text-primary-200/80">
                        The system will automatically generate a comprehensive adherence report for your next doctor's visit.
                        This includes 60-day medication history, verification logs, and adherence statistics.
                    </p>
                </div>

                {/* Reminder Alert */}
                {daysUntilNext <= 7 && daysUntilNext > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-yellow-400">Upcoming Visit Reminder</p>
                            <p className="text-xs text-yellow-400/80 mt-1">
                                Your next doctor's visit is in {daysUntilNext} days. Don't forget to download your adherence report.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
