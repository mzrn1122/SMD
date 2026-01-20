import { ChevronLeft, ChevronRight } from 'lucide-react';

export const AdherenceCalendar = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1); // Mock 31 days

    // Mock status: 1 = taken, 2 = missed, 3 = partial
    const getStatus = (day) => {
        if (day > 20) return 0; // Future
        if (day % 7 === 0) return 2; // Missed
        if (day % 5 === 0) return 3; // Partial
        return 1; // Taken
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 dark:text-white">January 2026</h3>
                <div className="flex gap-2">
                    <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><ChevronLeft className="w-4 h-4" /></button>
                    <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><ChevronRight className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {/* Empty slots for start of month */}
                <div className="p-2"></div><div className="p-2"></div><div className="p-2"></div>

                {days.map(day => {
                    const status = getStatus(day);
                    return (
                        <div key={day} className={`
                            aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all cursor-pointer relative group
                            ${status === 1 ? 'bg-primary-50 text-primary-700 border border-primary-100 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-300' :
                                status === 2 ? 'bg-secondary-50 text-secondary-700 border border-secondary-100 dark:bg-secondary-900/20 dark:border-secondary-800 dark:text-secondary-300' :
                                    status === 3 ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                        'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
                        `}>
                            {day}

                            {/* Hover Tooltip */}
                            {status !== 0 && (
                                <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">
                                    {status === 1 ? 'All Doses Taken' : status === 2 ? 'Missed Dose' : 'Partial Intake'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex gap-4 text-xs justify-center">
                <div className="flex items-center gap-1.5 text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-primary-500"></div> Taken
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-secondary-500"></div> Missed
                </div>
            </div>
        </div>
    );
};
