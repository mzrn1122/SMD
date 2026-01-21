import { Calendar, Circle, CheckCircle2 } from 'lucide-react';

export const AppointmentTimeline = () => {
    // Mock Appointments based on the user request/image
    const appointments = [
        { id: 1, time: '16:30', title: 'Cardiologist Follow-up', type: 'upcoming', date: 'Today' },
        { id: 2, time: '14:22', title: 'Blood Pressure Check', type: 'completed', date: 'Yesterday' },
        { id: 3, time: '09:15', title: 'Nutritionist Consultation', type: 'completed', date: 'Jan 20' },
    ];

    return (
        <div className="card h-full">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                Appointments
            </h3>

            <div className="relative pl-4 space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent dark:before:via-slate-700">
                {appointments.map((apt) => (
                    <div key={apt.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Dot */}
                        <div className={`
                            flex items-center justify-center w-4 h-4 rounded-full border border-white dark:border-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0
                            ${apt.type === 'upcoming'
                                ? 'bg-secondary-500 ring-4 ring-secondary-100 dark:ring-secondary-900/30'
                                : 'bg-primary-500 ring-4 ring-primary-100 dark:ring-primary-900/30'}
                        `}></div>

                        {/* Card */}
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm ml-10">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <span className="font-bold text-slate-900 dark:text-slate-100">{apt.title}</span>
                                <time className="font-mono text-xs font-medium text-slate-500">{apt.time}</time>
                            </div>
                            <div className="text-slate-500 text-xs">{apt.date}</div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 border border-dashed border-primary-200 dark:border-primary-800/50 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                + Add New Appointment
            </button>
        </div>
    );
};
