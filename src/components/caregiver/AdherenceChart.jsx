import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

export const AdherenceChart = ({ logs = [] }) => {
    // Process logs into daily adherence data for the last 30 days
    const processChartData = () => {
        const data = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayLogs = logs.filter(log => {
                const logDate = new Date(log.created_at || log.timestamp);
                return logDate.toISOString().split('T')[0] === dateStr;
            });

            const taken = dayLogs.filter(log => log.event === 'taken').length;
            const total = dayLogs.length;
            const adherence = total > 0 ? (taken / total) * 100 : 0;

            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                adherence: adherence,
                taken: taken,
                total: total,
            });
        }

        return data;
    };

    const chartData = processChartData();
    const avgAdherence = chartData.reduce((sum, day) => sum + day.adherence, 0) / chartData.length;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
                    <p className="text-sm font-semibold text-white mb-2">{payload[0].payload.date}</p>
                    <p className="text-xs text-slate-400">
                        Adherence: <span className="text-primary-400 font-bold">{payload[0].value.toFixed(1)}%</span>
                    </p>
                    <p className="text-xs text-slate-400">
                        Taken: <span className="text-success-400 font-bold">{payload[0].payload.taken}</span> / {payload[0].payload.total}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary-500" />
                    30-Day Adherence Trend
                </h3>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Average Adherence</p>
                    <p className="text-2xl font-bold text-primary-400">{avgAdherence.toFixed(1)}%</p>
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickLine={{ stroke: '#475569' }}
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickLine={{ stroke: '#475569' }}
                            domain={[0, 100]}
                            ticks={[0, 25, 50, 75, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="adherence"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            fill="url(#colorAdherence)"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Stats Summary */}
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-3 gap-4">
                <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Best Day</p>
                    <p className="text-lg font-bold text-success-400">
                        {Math.max(...chartData.map(d => d.adherence)).toFixed(0)}%
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Average</p>
                    <p className="text-lg font-bold text-primary-400">
                        {avgAdherence.toFixed(0)}%
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Lowest Day</p>
                    <p className="text-lg font-bold text-yellow-400">
                        {Math.min(...chartData.map(d => d.adherence)).toFixed(0)}%
                    </p>
                </div>
            </div>
        </div>
    );
};
