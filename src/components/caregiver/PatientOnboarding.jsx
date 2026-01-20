import { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Heart, Calendar, FileText, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const PatientOnboarding = ({ onComplete, initialData }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Patient Info
        patientName: 'John Doe',
        dob: '1955-06-15',
        gender: 'Male',
        ethnicity: '',
        religion: '',
        maritalStatus: 'Married',
        address: '',
        primaryCondition: 'Hypertension',

        // Guardian/Caregiver Info
        guardianName: '',
        relationship: '',
        guardianPhone: '',
        guardianEmail: '',
        guardianAddress: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete(formData);
        toast.success("Profile updated successfully!");
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto border border-slate-200 dark:border-slate-700">
            <div className="bg-primary-600 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <User className="w-6 h-6" /> Patient Registration
                    </h2>
                    <p className="opacity-80 text-sm">Complete profile for medical reports</p>
                </div>
                <div className="flex gap-2">
                    <span className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-white' : 'bg-white/30'}`}></span>
                    <span className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-white' : 'bg-white/30'}`}></span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
                {step === 1 && (
                    <div className="space-y-6 animate-slide-in">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b pb-2">Patient Demographics</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                                <input name="patientName" value={formData.patientName} onChange={handleInputChange} className="input-field w-full" required />
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Date of Birth</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="input-field w-full" required />
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleInputChange} className="input-field w-full">
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Marital Status</label>
                                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className="input-field w-full">
                                    <option>Single</option>
                                    <option>Married</option>
                                    <option>Widowed</option>
                                    <option>Divorced</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Ethnicity</label>
                                <input name="ethnicity" value={formData.ethnicity} onChange={handleInputChange} className="input-field w-full" placeholder="e.g. Hispanic, Asian..." />
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Religion</label>
                                <input name="religion" value={formData.religion} onChange={handleInputChange} className="input-field w-full" placeholder="Optional" />
                            </div>
                            <div className="form-group md:col-span-2">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Residential Address</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} className="input-field w-full h-24 resize-none" placeholder="Full Home Address" />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={() => setStep(2)} className="btn-primary flex items-center gap-2">
                                Next Step <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-slide-in">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b pb-2">Caregiver / Guardian Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Guardian Name</label>
                                <input name="guardianName" value={formData.guardianName} onChange={handleInputChange} className="input-field w-full" required />
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Relationship</label>
                                <input name="relationship" value={formData.relationship} onChange={handleInputChange} className="input-field w-full" placeholder="e.g. Son, Daughter, Nurse" required />
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
                                <input name="guardianPhone" value={formData.guardianPhone} onChange={handleInputChange} className="input-field w-full" type="tel" required />
                            </div>
                            <div className="form-group">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                                <input name="guardianEmail" value={formData.guardianEmail} onChange={handleInputChange} className="input-field w-full" type="email" required />
                            </div>
                            <div className="form-group md:col-span-2">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Guardian Address (if different)</label>
                                <textarea name="guardianAddress" value={formData.guardianAddress} onChange={handleInputChange} className="input-field w-full h-20 resize-none" placeholder="Leave blank if same as patient" />
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <button type="button" onClick={() => setStep(1)} className="btn-secondary text-sm">
                                Back
                            </button>
                            <button type="submit" className="btn-primary bg-gradient-to-r from-primary-600 to-primary-500">
                                Save Profile & Continue
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};
