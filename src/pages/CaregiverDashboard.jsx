import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mqttService } from '../services/mqttService';
import { generatePDFReport } from '../utils/reportGenerator';
import { PatientOnboarding } from '../components/caregiver/PatientOnboarding';
import { LiveVitals } from '../components/caregiver/LiveVitals';
import { DailyIntakeTracker } from '../components/caregiver/DailyIntakeTracker';
import { AppointmentTimeline } from '../components/caregiver/AppointmentTimeline';
import { AdherenceCalendar } from '../components/caregiver/AdherenceCalendar';
import { MedicationManager } from '../components/caregiver/MedicationManager';

import { LogOut, Download, FileText, UserCircle, Pill, Activity } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export const CaregiverDashboard = () => {
    const { profile, signOut } = useAuth();
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // overview, medications, reports

    // Patient Data State (would ideally sync with Supabase)
    const [patientData, setPatientData] = useState(null);
    const [logs, setLogs] = useState([]);
    const [isBioExpanded, setIsBioExpanded] = useState(false);
    const [medications, setMedications] = useState([
        {
            id: 1,
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'daily',
            times: ['08:00', '20:00'],
            active: true,
            startDate: new Date().toISOString(),
            instructions: 'Take with food'
        }
    ]);

    // Load persisted data on mount
    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem('smd_patient_profile');
            if (savedProfile) {
                const parsed = JSON.parse(savedProfile);
                if (parsed && parsed.patientName) {
                    setPatientData(parsed);
                    setIsProfileComplete(true);
                }
            }
        } catch (e) {
            console.error("Failed to parse profile", e);
            localStorage.removeItem('smd_patient_profile');
        }

        // MQTT Connection
        mqttService.connect();
        mqttService.subscribe('smd/logs', (msg) => {
            setLogs(prev => [msg, ...prev]);
            toast.success('New intake event recorded');
        });

        return () => mqttService.disconnect();
    }, []);

    const handleProfileComplete = (data) => {
        if (!data) return;
        setPatientData(data);
        setIsProfileComplete(true);
        localStorage.setItem('smd_patient_profile', JSON.stringify(data));
    };

    const handleDownloadReport = () => {
        if (!patientData) return;

        // Mock Statistics for the report
        const stats = {
            weeklyAdherence: 87.5,
            monthlyAdherence: 92.0,
            takenCount: 45,
            missedCount: 3
        };

        generatePDFReport(patientData, stats);
        toast.success("Downloading Medical Report...");
    };

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isProfileComplete || !patientData) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
                <Toaster position="top-right" />
                <div className="max-w-4xl mx-auto mb-8 text-center animate-slide-in">
                    <Activity className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome to Smart Medicine Dispenser</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Please complete the patient profile to initialize the dashboard.</p>
                </div>
                <PatientOnboarding onComplete={handleProfileComplete} />
            </div>
        );
    }



    // Defensive check to prevent rendering with incomplete data
    const safePatientData = patientData || {
        patientName: 'Unknown',
        dob: 'N/A',
        gender: 'N/A',
        primaryCondition: 'N/A',
        ethnicity: 'N/A',
        religion: 'N/A',
        address: 'N/A',
        guardianName: 'N/A',
        relationship: 'N/A',
        guardianPhone: 'N/A'
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
            <Toaster position="top-right" />

            {/* Top Navigation Bar */}
            <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl shadow-sm">
                                <Activity className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">SDM Caregiver</h1>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider hidden sm:block">Monitoring: {safePatientData.patientName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">

                            <button onClick={handleLogout} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-secondary-600 transition-colors" title="Log Out">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

                {/* Collapsible Patient Header */}
                <div className="mb-6 card bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow transition-all duration-300 border border-slate-200 dark:border-slate-800" >
                    <div
                        onClick={() => setIsBioExpanded(!isBioExpanded)}
                        className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-50 dark:active:bg-slate-800/50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-lg border-2 border-white dark:border-slate-800 shadow-sm">
                                {safePatientData.patientName.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {safePatientData.patientName}
                                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] uppercase font-bold tracking-wide dark:bg-red-900/30 dark:text-red-400">
                                        {safePatientData.primaryCondition}
                                    </span>
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                    <UserCircle className="w-3 h-3" />
                                    {safePatientData.pk || 'Patient ID: #SMD-8291'}
                                </p>
                            </div>
                        </div>
                        <button className={`p-2 rounded-full transition-transform duration-300 ${isBioExpanded ? 'rotate-180 bg-slate-100 dark:bg-slate-800' : ''}`}>
                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    </div>

                    {isBioExpanded && (
                        <div className="px-4 pb-6 pt-0 animate-slide-in">
                            <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-4"></div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-sm text-slate-600 dark:text-slate-400">
                                <div>
                                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Gender / DOB</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{safePatientData.gender}, {safePatientData.dob}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Ethnicity</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{safePatientData.ethnicity || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Religion</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{safePatientData.religion || 'N/A'}</span>
                                </div>
                                <div className="col-span-2 lg:col-span-2">
                                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Guardian Contact</span>
                                    <span className="font-medium text-slate-900 dark:text-white block">{safePatientData.guardianName} ({safePatientData.relationship})</span>
                                    <span className="text-primary-600 dark:text-primary-400 text-xs">{safePatientData.guardianPhone}</span>
                                </div>
                                <div className="col-span-2 lg:col-span-1">
                                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Address</span>
                                    <span className="font-medium text-slate-900 dark:text-white truncate block" title={safePatientData.address}>{safePatientData.address}</span>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button onClick={() => setIsProfileComplete(false)} className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline">Edit Full Profile</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dashboard Grid - 3 Column XL Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 items-start">

                    {/* COL 1: REAL-TIME MONITORING (XL: 3 cols) */}
                    <div className="xl:col-span-3 space-y-6">
                        <div className="animate-slide-in" style={{ animationDelay: '0s' }}>
                            <LiveVitals patientName={safePatientData.patientName} />
                        </div>
                        <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                            <DailyIntakeTracker logs={logs} />
                        </div>
                    </div>

                    {/* COL 2: SCHEDULE & HISTORY (XL: 6 cols) */}
                    <div className="xl:col-span-6 space-y-6 md:col-span-1 xl:order-none order-last md:order-none">

                        <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Adherence Tracker</h3>
                            </div>
                            <AdherenceCalendar />
                        </div>

                        <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
                            <MedicationManager
                                medications={medications}
                                onAdd={(med) => setMedications([...medications, med])}
                                onDelete={(id) => setMedications(medications.filter(m => m.id !== id))}
                            />
                        </div>
                    </div>

                    {/* COL 3: ACTIONS & TIMELINE (XL: 3 cols) */}
                    <div className="xl:col-span-3 space-y-6">
                        {/* Quick Stats / Stock */}
                        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg animate-slide-in relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Pill className="w-24 h-24" /></div>
                            <h4 className="font-medium text-primary-100 mb-1 flex items-center gap-2">
                                <Pill className="w-4 h-4" /> Medication Stock
                            </h4>
                            <div className="text-3xl font-bold mb-2">
                                42 <span className="text-sm font-normal text-primary-200">capsules</span>
                            </div>
                            <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden mb-2">
                                <div className="bg-white/90 h-full w-[70%]"></div>
                            </div>
                            <p className="text-xs text-primary-100">Est. 14 days remaining</p>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={handleDownloadReport}
                            className="w-full card p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group border-dashed border-2 border-slate-300 dark:border-slate-700 bg-transparent animate-slide-in"
                            style={{ animationDelay: '0.2s' }}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 transition-colors">
                                <Download className="w-5 h-5 text-slate-400 group-hover:text-primary-500" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Download Report</h4>
                                <p className="text-xs text-slate-400">Export PDF Summary</p>
                            </div>
                        </button>

                        {/* Timeline moved to right column for balance */}
                        <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
                            <AppointmentTimeline />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
