import { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';

export const LiveVitals = ({ patientName }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="card bg-gradient-to-br from-primary-900 to-slate-900 text-white relative overflow-hidden text-left border-none shadow-2xl">
            {/* Background Animations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-secondary-400 font-bold tracking-wider text-xs uppercase mb-1">Live Monitoring</h2>
                        <h1 className="text-3xl font-bold font-mono tracking-tighter">
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </h1>
                        <p className="text-primary-200 text-sm font-medium mt-1">
                            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-secondary-400 animate-pulse">
                            <Activity className="w-5 h-5 animate-heartbeat" />
                            <span className="font-mono font-bold text-xl">82</span>
                            <span className="text-xs font-medium text-slate-400">BPM</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Pico Sensor Live</div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                    <div>
                        <div className="text-slate-400 text-xs">Patient Status</div>
                        <div className="text-primary-300 font-semibold text-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
                            Stable
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-slate-400 text-xs">Next Dose</div>
                        <div className="text-white font-mono font-bold">12:30 PM</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
