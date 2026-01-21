import { Check, X, Clock, Pill } from 'lucide-react';

export const DailyIntakeTracker = ({ logs }) => {
    // Determine status for 3 daily slots: Morning (8-10), Afternoon (12-2), Evening (6-8)
    // This is mock logic to simulate "Real-time" status based on the logs passed
    const today = new Date().toLocaleDateString();

    // Mock determination based on props
    const slots = [
        { id: 1, label: 'Morning', time: '08:00 AM', med: 'Hypertension', status: 'taken' },
        { id: 2, label: 'Noon', time: '12:00 PM', med: 'Vitamin D', status: 'waiting' },
        { id: 3, label: 'Afternoon', time: '04:00 PM', med: 'Antibiotics', status: 'upcoming' },
    ];

    return (
        <div className="card h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Pill className="w-5 h-5 text-primary-500" />
                    Today's Intake
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                    3 Doses / Day
                </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-4">
                {slots.map((slot, idx) => (
                    <div key={slot.id} className="relative pl-6 pb-4 last:pb-0">
                        {/* Timeline Connector */}
                        {idx !== slots.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                        )}

                        {/* Status Dot */}
                        <div className={`
                            absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10
                            ${slot.status === 'taken' ? 'bg-primary-100 border-primary-500 text-primary-600' :
                                slot.status === 'missed' ? 'bg-secondary-100 border-secondary-500 text-secondary-600' :
                                    'bg-slate-50 border-slate-300 text-slate-400 dark:bg-slate-800 dark:border-slate-600'}
                        `}>
                            {slot.status === 'taken' && <Check className="w-3 h-3" strokeWidth={4} />}
                            {slot.status === 'missed' && <X className="w-3 h-3" strokeWidth={4} />}
                            {(slot.status === 'waiting' || slot.status === 'upcoming') && <Clock className="w-3 h-3" />}
                        </div>

                        {/* Content */}
                        <div className="ml-4 flex justify-between items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-primary-200 transition-colors">
                            <div>
                                <div className="text-xs text-slate-500 font-semibold tracking-wide uppercase">{slot.label} • {slot.time}</div>
                                <div className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{slot.med}</div>
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                                ${slot.status === 'taken' ? 'bg-primary-100 text-primary-700' :
                                    slot.status === 'missed' ? 'bg-secondary-100 text-secondary-700' :
                                        'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}
                            `}>
                                {slot.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
