import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
    Activity, Download, Calendar, Clock, Pill,
    CheckCircle, XCircle, Plus, Edit2, Trash2,
    ChevronLeft, ChevronRight, LogOut, Loader2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export const CaregiverDashboard = () => {
    const { user, profile, signOut } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showMedModal, setShowMedModal] = useState(false);
    const [showApptModal, setShowApptModal] = useState(false);
    const [editingMed, setEditingMed] = useState(null);
    const [editingAppt, setEditingAppt] = useState(null);
    const [loading, setLoading] = useState(true);

    const [apptForm, setApptForm] = useState({
        title: '',
        date: '',
        time: '',
        type: 'checkup'
    });

    const [medForm, setMedForm] = useState({
        name: '',
        dosage: '',
        frequency: 'daily',
        times: ['08:00'],
        instructions: ''
    });

    const [patientInfo, setPatientInfo] = useState({
        patientName: 'John Doe',
        dob: '1955-06-15',
        gender: 'Male',
        primaryCondition: 'Hypertension',
        guardianName: 'Marzini',
        guardianPhone: '+60193220658',
        ethnicity: 'Asian',
        religion: 'N/A',
        address: 'N/A',
        patientId: null
    });

    const [medications, setMedications] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [todayIntake] = useState([
        { time: '04:00 PM', medicine: 'Antibiotics', status: 'WAITING', badge: 'WAITING' }
    ]);

    const adherenceData = {
        '2026-01-15': 'missed',
        '2026-01-20': 'missed',
        '2026-01-21': 'taken'
    };

    // Load data from Supabase on mount
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        loadDataFromSupabase();
        return () => clearInterval(timer);
    }, [user]);

    const loadDataFromSupabase = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Load caregiver profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;

            if (profileData?.patient_id) {
                // Load patient details
                const { data: patientData, error: patientError } = await supabase
                    .from('patients')
                    .select('*')
                    .eq('id', profileData.patient_id)
                    .single();

                if (patientError) throw patientError;

                if (patientData) {
                    setPatientInfo({
                        patientName: patientData.name || 'John Doe',
                        dob: patientData.dob || '1955-06-15',
                        gender: patientData.gender || 'Male',
                        primaryCondition: patientData.primary_condition || 'Hypertension',
                        guardianName: patientData.guardian_name || 'Marzini',
                        guardianPhone: patientData.guardian_phone || '+60193220658',
                        ethnicity: patientData.ethnicity || 'Asian',
                        religion: patientData.religion || 'N/A',
                        address: patientData.address || 'N/A',
                        patientId: patientData.id
                    });

                    // Load medications
                    const { data: medsData, error: medsError } = await supabase
                        .from('medications')
                        .select('*')
                        .eq('patient_id', patientData.id)
                        .eq('active', true)
                        .order('created_at', { ascending: false });

                    if (medsError) {
                        console.error('Error loading medications:', medsError);
                    } else if (medsData) {
                        setMedications(medsData.map(m => ({
                            id: m.id,
                            name: m.name,
                            dosage: m.dosage,
                            frequency: m.frequency,
                            times: m.times || ['08:00'],
                            active: m.active,
                            instructions: m.instructions || ''
                        })));
                    }

                    // Load appointments
                    const { data: apptsData, error: apptsError } = await supabase
                        .from('appointments')
                        .select('*')
                        .eq('patient_id', patientData.id)
                        .order('date', { ascending: true });

                    if (apptsError) {
                        console.error('Error loading appointments:', apptsError);
                    } else if (apptsData) {
                        setAppointments(apptsData.map(a => ({
                            id: a.id,
                            title: a.title,
                            date: a.date,
                            time: a.time,
                            type: a.type || 'checkup',
                            status: new Date(a.date) < new Date() ? 'completed' : 'upcoming'
                        })));
                    }
                }
            } else {
                toast.error('No patient assigned to this caregiver account');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load data from database');
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getAdherenceStatus = (year, month, day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return adherenceData[dateStr] || null;
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

    // Medication CRUD with Supabase
    const openAddMedModal = () => {
        setMedForm({ name: '', dosage: '', frequency: 'daily', times: ['08:00'], instructions: '' });
        setEditingMed(null);
        setShowMedModal(true);
    };

    const openEditMedModal = (med) => {
        setMedForm({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            times: [...med.times],
            instructions: med.instructions
        });
        setEditingMed(med);
        setShowMedModal(true);
    };

    const handleSaveMedication = async () => {
        if (!medForm.name || !medForm.dosage) {
            toast.error('Please fill in medication name and dosage');
            return;
        }

        if (!patientInfo.patientId) {
            toast.error('Patient ID not found. Please refresh the page.');
            return;
        }

        try {
            if (editingMed) {
                // Update existing medication
                const { data, error } = await supabase
                    .from('medications')
                    .update({
                        name: medForm.name,
                        dosage: medForm.dosage,
                        frequency: medForm.frequency,
                        times: medForm.times,
                        instructions: medForm.instructions,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingMed.id)
                    .select()
                    .single();

                if (error) throw error;

                setMedications(medications.map(m => m.id === editingMed.id ? {
                    id: data.id,
                    name: data.name,
                    dosage: data.dosage,
                    frequency: data.frequency,
                    times: data.times,
                    active: data.active,
                    instructions: data.instructions
                } : m));
                toast.success('Medication updated successfully!');
            } else {
                // Add new medication
                const { data, error } = await supabase
                    .from('medications')
                    .insert([{
                        patient_id: patientInfo.patientId,
                        name: medForm.name,
                        dosage: medForm.dosage,
                        frequency: medForm.frequency,
                        times: medForm.times,
                        instructions: medForm.instructions,
                        active: true
                    }])
                    .select()
                    .single();

                if (error) throw error;

                setMedications([...medications, {
                    id: data.id,
                    name: data.name,
                    dosage: data.dosage,
                    frequency: data.frequency,
                    times: data.times,
                    active: data.active,
                    instructions: data.instructions
                }]);
                toast.success('Medication added successfully!');
            }
            setShowMedModal(false);
        } catch (error) {
            console.error('Error saving medication:', error);
            toast.error('Failed to save medication to database');
        }
    };

    const handleDeleteMedication = async (id, name) => {
        if (!window.confirm(`Delete ${name}?`)) return;

        try {
            const { error } = await supabase
                .from('medications')
                .update({ active: false, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;

            setMedications(medications.filter(m => m.id !== id));
            toast.success('Medication deleted successfully');
        } catch (error) {
            console.error('Error deleting medication:', error);
            toast.error('Failed to delete medication');
        }
    };

    const addTimeSlot = () => {
        setMedForm({ ...medForm, times: [...medForm.times, '12:00'] });
    };

    const removeTimeSlot = (index) => {
        if (medForm.times.length > 1) {
            setMedForm({ ...medForm, times: medForm.times.filter((_, i) => i !== index) });
        }
    };

    const updateTimeSlot = (index, value) => {
        const newTimes = [...medForm.times];
        newTimes[index] = value;
        setMedForm({ ...medForm, times: newTimes });
    };

    // Appointment CRUD with Supabase
    const openAddApptModal = () => {
        setApptForm({ title: '', date: '', time: '', type: 'checkup' });
        setEditingAppt(null);
        setShowApptModal(true);
    };

    const openEditApptModal = (appt) => {
        setApptForm({
            title: appt.title,
            date: appt.date,
            time: appt.time,
            type: appt.type || 'checkup'
        });
        setEditingAppt(appt);
        setShowApptModal(true);
    };

    const handleSaveAppointment = async () => {
        if (!apptForm.title || !apptForm.date || !apptForm.time) {
            toast.error('Please fill in all appointment fields');
            return;
        }

        if (!patientInfo.patientId) {
            toast.error('Patient ID not found. Please refresh the page.');
            return;
        }

        try {
            if (editingAppt) {
                // Update existing appointment
                const { data, error } = await supabase
                    .from('appointments')
                    .update({
                        title: apptForm.title,
                        date: apptForm.date,
                        time: apptForm.time,
                        type: apptForm.type,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingAppt.id)
                    .select()
                    .single();

                if (error) throw error;

                setAppointments(appointments.map(a => a.id === editingAppt.id ? {
                    id: data.id,
                    title: data.title,
                    date: data.date,
                    time: data.time,
                    type: data.type,
                    status: new Date(data.date) < new Date() ? 'completed' : 'upcoming'
                } : a));
                toast.success('Appointment updated successfully!');
            } else {
                // Add new appointment
                const { data, error } = await supabase
                    .from('appointments')
                    .insert([{
                        patient_id: patientInfo.patientId,
                        title: apptForm.title,
                        date: apptForm.date,
                        time: apptForm.time,
                        type: apptForm.type
                    }])
                    .select()
                    .single();

                if (error) throw error;

                setAppointments([...appointments, {
                    id: data.id,
                    title: data.title,
                    date: data.date,
                    time: data.time,
                    type: data.type,
                    status: 'upcoming'
                }].sort((a, b) => new Date(a.date) - new Date(b.date)));
                toast.success('Appointment added successfully!');
            }
            setShowApptModal(false);
        } catch (error) {
            console.error('Error saving appointment:', error);
            toast.error('Failed to save appointment to database');
        }
    };

    const handleDeleteAppointment = async (id, title) => {
        if (!window.confirm(`Delete "${title}"?`)) return;

        try {
            const { error } = await supabase
                .from('appointments')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setAppointments(appointments.filter(a => a.id !== id));
            toast.success('Appointment deleted successfully');
        } catch (error) {
            console.error('Error deleting appointment:', error);
            toast.error('Failed to delete appointment');
        }
    };

    // Update patient info in Supabase
    const handleSavePatientInfo = async () => {
        if (!patientInfo.patientId) {
            toast.error('Patient ID not found');
            return;
        }

        try {
            const { error } = await supabase
                .from('patients')
                .update({
                    name: patientInfo.patientName,
                    primary_condition: patientInfo.primaryCondition,
                    guardian_name: patientInfo.guardianName,
                    guardian_phone: patientInfo.guardianPhone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', patientInfo.patientId);

            if (error) throw error;

            setShowEditProfile(false);
            toast.success('Patient information updated successfully!');
        } catch (error) {
            console.error('Error updating patient info:', error);
            toast.error('Failed to update patient information');
        }
    };

    // PDF Export
    const generatePDFReport = () => {
        const taken = Object.values(adherenceData).filter(s => s === 'taken').length;
        const missed = Object.values(adherenceData).filter(s => s === 'missed').length;
        const total = taken + missed;
        const weeklyAdherence = total > 0 ? ((taken / total) * 100).toFixed(1) : 87.5;

        const reportWindow = window.open('', '', 'width=800,height=1000');
        reportWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Medical Report - ${patientInfo.patientName}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 3px solid #14B8A6; padding-bottom: 20px; margin-bottom: 30px; }
                    .title { font-size: 28px; font-weight: bold; color: #14B8A6; margin-bottom: 5px; }
                    .subtitle { font-size: 14px; color: #64748B; margin-top: 5px; }
                    .report-info { font-size: 12px; color: #64748B; margin-top: 10px; }
                    .section { margin-bottom: 30px; page-break-inside: avoid; }
                    .section-title { 
                        font-size: 18px; 
                        font-weight: bold; 
                        color: #14B8A6; 
                        border-bottom: 2px solid #E2E8F0; 
                        padding-bottom: 10px; 
                        margin-bottom: 15px; 
                        text-transform: uppercase; 
                    }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    .field { margin-bottom: 12px; }
                    .label { font-size: 11px; color: #64748B; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
                    .value { font-size: 14px; font-weight: 500; color: #0F172A; margin-top: 4px; }
                    .stats-box { background: #F0FDFA; border: 2px solid #CCFBF1; padding: 20px; border-radius: 8px; }
                    .stat-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #CBD5E1; }
                    .stat-row:last-child { border: none; }
                    .stat-label { color: #475569; font-size: 14px; }
                    .stat-value { font-weight: bold; font-size: 16px; color: #0F172A; }
                    .stat-value.danger { color: #EF4444; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">PERSONAL MEDICAL RECORD</div>
                    <div class="subtitle">Generated by Smart Medicine Dispenser</div>
                    <div class="report-info">
                        Report Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} | 
                        Ref ID: #${Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </div>
                </div>
                <div class="section">
                    <div class="section-title">Patient Demographics</div>
                    <div class="grid">
                        <div>
                            <div class="field"><div class="label">Full Name</div><div class="value">${patientInfo.patientName}</div></div>
                            <div class="field"><div class="label">Date of Birth</div><div class="value">${patientInfo.dob}</div></div>
                            <div class="field"><div class="label">Gender</div><div class="value">${patientInfo.gender}</div></div>
                        </div>
                        <div>
                            <div class="field"><div class="label">Address</div><div class="value">${patientInfo.address || 'N/A'}</div></div>
                            <div class="field"><div class="label">Ethnicity</div><div class="value">${patientInfo.ethnicity || 'Asian'}</div></div>
                            <div class="field"><div class="label">Religion</div><div class="value">${patientInfo.religion || 'N/A'}</div></div>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-title">Guardian / Caregiver Information</div>
                    <div class="grid">
                        <div>
                            <div class="field"><div class="label">Guardian Name</div><div class="value">${patientInfo.guardianName}</div></div>
                            <div class="field"><div class="label">Phone Number</div><div class="value">${patientInfo.guardianPhone}</div></div>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-title">Medication Adherence Report</div>
                    <div class="stats-box">
                        <div class="stat-row">
                            <span class="stat-label">Weekly Avg. Adherence</span>
                            <strong class="stat-value">${weeklyAdherence}%</strong>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Monthly Avg. Adherence</span>
                            <strong class="stat-value">92%</strong>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Total Doses Taken (This Month)</span>
                            <strong class="stat-value">${taken > 0 ? taken : 45}</strong>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Total Doses Missed (This Month)</span>
                            <strong class="stat-value danger">${missed > 0 ? missed : 3}</strong>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
        reportWindow.document.close();
        setTimeout(() => {
            reportWindow.print();
        }, 250);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleLogout = async () => {
        try {
            await signOut();
            // Force navigation to login page
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Even if signOut fails, try to clear local state and redirect
            try {
                await supabase.auth.signOut();
                window.location.href = '/login';
            } catch (fallbackError) {
                console.error('Fallback logout error:', fallbackError);
                toast.error('Failed to log out. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 style={{ width: '48px', height: '48px', color: '#14B8A6', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: '#64748B', marginTop: '1rem', fontSize: '0.875rem' }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
            <Toaster position="top-right" />

            {/* Top Navigation */}
            <nav style={{
                background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                padding: '1.25rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(20, 184, 166, 0.3)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Activity style={{ width: '28px', height: '28px', color: 'white' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: 0, letterSpacing: '-0.025em' }}>
                            SDM Caregiver
                        </h1>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', margin: 0, fontWeight: '500', letterSpacing: '0.05em' }}>
                            MONITORING: {patientInfo.patientName.toUpperCase()}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '0.625rem 1.5rem',
                        background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: 'white',
                        fontWeight: '600',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <LogOut style={{ width: '16px', height: '16px' }} />
                    Logout
                </button>
            </nav>

            {/* Main Content - 3 Column Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '340px 1fr 380px',
                gap: '1.5rem',
                padding: '2rem',
                maxWidth: '1800px',
                margin: '0 auto'
            }}>
                {/* LEFT COLUMN: Live Monitor + Upcoming Dose + Medications */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Live Monitor Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #E5E7EB'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#14B8A6', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    Live Monitoring
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'monospace', color: '#0F172A', marginTop: '0.5rem' }}>
                                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.25rem' }}>
                                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '1rem',
                                borderTop: '1px solid #E5E7EB'
                            }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Patient Status</p>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#14B8A6', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <span style={{ width: '6px', height: '6px', background: '#14B8A6', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                                        Stable
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Next Dose</p>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '700', fontFamily: 'monospace', color: '#0F172A', marginTop: '0.25rem' }}>
                                        12:30 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Dose Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #E5E7EB'
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Pill style={{ width: '18px', height: '18px', color: '#14B8A6' }} />
                            Upcoming Dose
                        </h3>
                        {todayIntake.map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: '#FEF3C7',
                                borderRadius: '12px',
                                border: '1px solid #FDE68A'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Clock style={{ width: '20px', height: '20px', color: '#D97706' }} />
                                    <div>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F172A' }}>{item.time}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.medicine}</p>
                                    </div>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.625rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    background: '#FBBF24',
                                    color: '#78350F'
                                }}>
                                    {item.badge}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Medications Management */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #E5E7EB',
                        maxHeight: '400px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Pill style={{ width: '18px', height: '18px', color: '#14B8A6' }} />
                                Medications
                            </h3>
                            <button
                                onClick={openAddMedModal}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#14B8A6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    fontSize: '0.75rem',
                                    color: 'white',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#0D9488'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#14B8A6'}
                            >
                                <Plus style={{ width: '14px', height: '14px' }} />
                                Add
                            </button>
                        </div>

                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {medications.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
                                    <Pill style={{ width: '48px', height: '48px', margin: '0 auto 1rem', opacity: 0.3 }} />
                                    <p style={{ fontSize: '0.875rem' }}>No medications added</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {medications.map((med) => (
                                        <div key={med.id} style={{
                                            background: '#F9FAFB',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '12px',
                                            padding: '1rem'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.25rem' }}>
                                                        {med.name}
                                                    </h4>
                                                    <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                        {med.dosage} • {med.frequency}
                                                    </p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => openEditMedModal(med)}
                                                        style={{
                                                            padding: '0.375rem',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: '#14B8A6',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            borderRadius: '6px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#F0FDFA'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <Edit2 style={{ width: '14px', height: '14px' }} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMedication(med.id, med.name)}
                                                        style={{
                                                            padding: '0.375rem',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: '#EF4444',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            borderRadius: '6px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <Trash2 style={{ width: '14px', height: '14px' }} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.5rem' }}>
                                                {med.times.map((time, idx) => (
                                                    <span key={idx} style={{
                                                        padding: '0.25rem 0.625rem',
                                                        background: '#CCFBF1',
                                                        color: '#0F766E',
                                                        fontSize: '0.625rem',
                                                        fontWeight: '600',
                                                        borderRadius: '6px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem'
                                                    }}>
                                                        <Clock style={{ width: '10px', height: '10px' }} />
                                                        {time}
                                                    </span>
                                                ))}
                                            </div>
                                            {med.instructions && (
                                                <p style={{ fontSize: '0.625rem', color: '#6B7280', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                                    📝 {med.instructions}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CENTER COLUMN: Calendar Only */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #E5E7EB'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0F172A' }}>
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={handlePrevMonth}
                                style={{
                                    padding: '0.5rem',
                                    background: '#F9FAFB',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#64748B',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#F1F5F9';
                                    e.currentTarget.style.color = '#0F172A';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#F9FAFB';
                                    e.currentTarget.style.color = '#64748B';
                                }}
                            >
                                <ChevronLeft style={{ width: '18px', height: '18px' }} />
                            </button>
                            <button
                                onClick={handleNextMonth}
                                style={{
                                    padding: '0.5rem',
                                    background: '#F9FAFB',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#64748B',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#F1F5F9';
                                    e.currentTarget.style.color = '#0F172A';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#F9FAFB';
                                    e.currentTarget.style.color = '#64748B';
                                }}
                            >
                                <ChevronRight style={{ width: '18px', height: '18px' }} />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            gap: '0.375rem',
                            marginBottom: '0.5rem'
                        }}>
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} style={{
                                    textAlign: 'center',
                                    fontSize: '0.625rem',
                                    fontWeight: '700',
                                    color: '#9CA3AF',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    padding: '0.5rem'
                                }}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            gap: '0.375rem'
                        }}>
                            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                                <div key={`empty-${i}`} style={{ padding: '1rem' }} />
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const status = getAdherenceStatus(year, month, day);
                                const isToday = new Date().getDate() === day &&
                                    new Date().getMonth() === month &&
                                    new Date().getFullYear() === year;

                                let bgColor = 'transparent';
                                let borderColor = '#E5E7EB';
                                let textColor = '#64748B';

                                if (status === 'taken') {
                                    bgColor = '#FEF3C7';
                                    borderColor = '#FBBF24';
                                    textColor = '#78350F';
                                } else if (status === 'missed') {
                                    bgColor = '#FEE2E2';
                                    borderColor = '#EF4444';
                                    textColor = '#991B1B';
                                } else if (isToday) {
                                    bgColor = '#CCFBF1';
                                    borderColor = '#14B8A6';
                                    textColor = '#0F766E';
                                }

                                return (
                                    <div key={day} style={{
                                        aspectRatio: '1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8125rem',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        border: `1px solid ${borderColor}`,
                                        background: bgColor,
                                        color: textColor,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                        onMouseEnter={(e) => {
                                            if (!status) {
                                                e.currentTarget.style.background = '#F9FAFB';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!status) {
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}>
                                        {day}
                                        {status && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '4px',
                                                width: '4px',
                                                height: '4px',
                                                borderRadius: '50%',
                                                background: status === 'taken' ? '#FBBF24' : '#EF4444'
                                            }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1.5rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #E5E7EB',
                        fontSize: '0.75rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FBBF24' }} />
                            <span style={{ color: '#64748B' }}>Taken</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
                            <span style={{ color: '#64748B' }}>Missed</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#14B8A6' }} />
                            <span style={{ color: '#64748B' }}>Today</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Guardian + Appointments + Download */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Guardian Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #E5E7EB'
                    }}>
                        {showEditProfile ? (
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A', marginBottom: '1rem' }}>
                                    Edit Patient Info
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>
                                            Patient Name
                                        </label>
                                        <input
                                            type="text"
                                            value={patientInfo.patientName}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, patientName: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem',
                                                borderRadius: '8px',
                                                border: '1px solid #D1D5DB',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>
                                            Primary Condition
                                        </label>
                                        <input
                                            type="text"
                                            value={patientInfo.primaryCondition}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, primaryCondition: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem',
                                                borderRadius: '8px',
                                                border: '1px solid #D1D5DB',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>
                                            Guardian Name
                                        </label>
                                        <input
                                            type="text"
                                            value={patientInfo.guardianName}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, guardianName: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem',
                                                borderRadius: '8px',
                                                border: '1px solid #D1D5DB',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>
                                            Guardian Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={patientInfo.guardianPhone}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, guardianPhone: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem',
                                                borderRadius: '8px',
                                                border: '1px solid #D1D5DB',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button
                                            onClick={() => setShowEditProfile(false)}
                                            style={{
                                                flex: 1,
                                                padding: '0.625rem',
                                                background: '#F3F4F6',
                                                border: '1px solid #D1D5DB',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: '#374151',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#E5E7EB'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#F3F4F6'}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSavePatientInfo}
                                            style={{
                                                flex: 1,
                                                padding: '0.625rem',
                                                background: '#14B8A6',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: 'white',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#0D9488'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#14B8A6'}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>Guardian</h3>
                                    <button
                                        onClick={() => setShowEditProfile(true)}
                                        style={{
                                            padding: '0.375rem',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#14B8A6',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Edit2 style={{ width: '16px', height: '16px' }} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0F172A' }}>
                                        {patientInfo.guardianName}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                        {patientInfo.guardianPhone}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Appointments */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #E5E7EB',
                        maxHeight: '400px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar style={{ width: '18px', height: '18px', color: '#14B8A6' }} />
                                Appointments
                            </h3>
                            <button
                                onClick={openAddApptModal}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#14B8A6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    fontSize: '0.75rem',
                                    color: 'white',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#0D9488'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#14B8A6'}
                            >
                                <Plus style={{ width: '14px', height: '14px' }} />
                                Add
                            </button>
                        </div>

                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {appointments.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
                                    <Calendar style={{ width: '48px', height: '48px', margin: '0 auto 1rem', opacity: 0.3 }} />
                                    <p style={{ fontSize: '0.875rem' }}>No appointments scheduled</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {appointments.map((appt) => (
                                        <div key={appt.id} style={{
                                            background: appt.status === 'completed' ? '#F9FAFB' : '#F0FDFA',
                                            border: `1px solid ${appt.status === 'completed' ? '#E5E7EB' : '#CCFBF1'}`,
                                            borderRadius: '12px',
                                            padding: '1rem'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.25rem' }}>
                                                        {appt.title}
                                                    </h4>
                                                    <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                        {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {appt.time}
                                                    </p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => openEditApptModal(appt)}
                                                        style={{
                                                            padding: '0.375rem',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: '#14B8A6',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            borderRadius: '6px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#F0FDFA'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <Edit2 style={{ width: '14px', height: '14px' }} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAppointment(appt.id, appt.title)}
                                                        style={{
                                                            padding: '0.375rem',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: '#EF4444',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            borderRadius: '6px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <Trash2 style={{ width: '14px', height: '14px' }} />
                                                    </button>
                                                </div>
                                            </div>
                                            <span style={{
                                                padding: '0.25rem 0.625rem',
                                                borderRadius: '6px',
                                                fontSize: '0.625rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                background: appt.status === 'completed' ? '#F3F4F6' : '#CCFBF1',
                                                color: appt.status === 'completed' ? '#6B7280' : '#0F766E'
                                            }}>
                                                {appt.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Download Report */}
                    <button
                        onClick={generatePDFReport}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'white',
                            border: '2px dashed #D1D5DB',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#14B8A6';
                            e.currentTarget.style.background = '#F0FDFA';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#D1D5DB';
                            e.currentTarget.style.background = 'white';
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: '#F0FDFA',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Download style={{ width: '20px', height: '20px', color: '#14B8A6' }} />
                        </div>
                        <div style={{ textAlign: 'left', flex: 1 }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.125rem' }}>
                                Download Report
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                Export PDF Summary
                            </p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Medication Modal */}
            {showMedModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        maxWidth: '500px',
                        width: '100%',
                        padding: '1.5rem',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A', marginBottom: '1.5rem' }}>
                            {editingMed ? 'Edit Medication' : 'Add Medication'}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                                    Medication Name *
                                </label>
                                <input
                                    type="text"
                                    value={medForm.name}
                                    onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                                    placeholder="e.g., Aspirin"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #D1D5DB',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                                    Dosage *
                                </label>
                                <input
                                    type="text"
                                    value={medForm.dosage}
                                    onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                                    placeholder="e.g., 100mg"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #D1D5DB',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                                    Frequency
                                </label>
                                <select
                                    value={medForm.frequency}
                                    onChange={(e) => setMedForm({ ...medForm, frequency: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #D1D5DB',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="twice-daily">Twice Daily</option>
                                    <option value="three-times-daily">Three Times Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                                    Time Slots
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {medForm.times.map((time, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                type="time"
                                                value={time}
                                                onChange={(e) => updateTimeSlot(index, e.target.value)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.75rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #D1D5DB',
                                                    fontSize: '0.875rem'
                                                }}
                                            />
                                            {medForm.times.length > 1 && (
                                                <button
                                                    onClick={() => removeTimeSlot(index)}
                                                    style={{
                                                        padding: '0.75rem 1rem',
                                                        background: '#FEE2E2',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        color: '#991B1B',
                                                        fontWeight: '600',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={addTimeSlot}
                                        style={{
                                            padding: '0.75rem',
                                            background: '#F3F4F6',
                                            border: '1px dashed #D1D5DB',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#374151',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#E5E7EB'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#F3F4F6'}
                                    >
                                        + Add Time Slot
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                                    Instructions
                                </label>
                                <textarea
                                    value={medForm.instructions}
                                    onChange={(e) => setMedForm({ ...medForm, instructions: e.target.value })}
                                    placeholder="e.g., Take with food"
                                    rows="3"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #D1D5DB',
                                        fontSize: '0.875rem',
                                        resize: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => {
                                    setShowMedModal(false);
                                    setEditingMed(null);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: '#F3F4F6',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#374151',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#E5E7EB'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#F3F4F6'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveMedication}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: '#14B8A6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: 'white',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#0D9488'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#14B8A6'}
                            >
                                {editingMed ? 'Update' : 'Add'} Medication
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Appointment Modal */}
            {showApptModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        maxWidth: '500px',
                        width: '100%',
                        padding: '1.5rem'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A', marginBottom: '1.5rem' }}>
                            {editingAppt ? 'Edit Appointment' : 'Add Appointment'}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                                    Appointment Title *
                                </label>
                                <input
                                    type="text"
                                    value={apptForm.title}
                                    onChange={(e) => setApptForm({ ...apptForm, title: e.target.value })}
                                    placeholder="e.g., Cardiologist Follow-up"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #D1D5DB',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={apptForm.date}
                                        onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid #D1D5DB',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                                        Time *
                                    </label>
                                    <input
                                        type="time"
                                        value={apptForm.time}
                                        onChange={(e) => setApptForm({ ...apptForm, time: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid #D1D5DB',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                                    Type
                                </label>
                                <select
                                    value={apptForm.type}
                                    onChange={(e) => setApptForm({ ...apptForm, type: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #D1D5DB',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="checkup">Check-up</option>
                                    <option value="follow-up">Follow-up</option>
                                    <option value="consultation">Consultation</option>
                                    <option value="emergency">Emergency</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => {
                                    setShowApptModal(false);
                                    setEditingAppt(null);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: '#F3F4F6',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#374151',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#E5E7EB'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#F3F4F6'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveAppointment}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: '#14B8A6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: 'white',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#0D9488'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#14B8A6'}
                            >
                                {editingAppt ? 'Update' : 'Add'} Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};