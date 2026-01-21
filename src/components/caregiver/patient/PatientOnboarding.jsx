import { useState, useEffect } from 'react';
import { User, Heart, ChevronRight, Activity, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const PatientOnboarding = ({ onComplete, initialData }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        patientName: '',
        dob: '',
        gender: 'Male',
        ethnicity: 'Malay',
        religion: '',
        maritalStatus: 'Single',
        address: '',
        primaryCondition: 'Hypertension',
        medications: [''],
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

    const handleMedicationChange = (index, value) => {
        const newMedications = [...formData.medications];
        newMedications[index] = value;
        setFormData(prev => ({ ...prev, medications: newMedications }));
    };

    const addMedication = () => {
        setFormData(prev => ({
            ...prev,
            medications: [...prev.medications, '']
        }));
    };

    const removeMedication = (index) => {
        if (formData.medications.length > 1) {
            const newMedications = formData.medications.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, medications: newMedications }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete(formData);
        toast.success("Profile updated successfully!");
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
            {/* Header Section */}
            <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                padding: '3rem 1.5rem',
                marginBottom: '0'
            }}>
                <div style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    {/* CENTERED ICON ONLY */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '72px',
                        height: '72px',
                        background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                        borderRadius: '20px',
                        marginBottom: '1.5rem',
                        boxShadow: '0 20px 50px rgba(20, 184, 166, 0.3)'
                    }}>
                        <Activity style={{ width: '36px', height: '36px', color: 'white', strokeWidth: 2.5 }} />
                    </div>

                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#0F172A',
                        marginBottom: '0.5rem'
                    }}>
                        Welcome to Smart Medicine Dispenser
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        color: '#64748B'
                    }}>
                        Please complete the patient profile to initialize the dashboard.
                    </p>
                </div>
            </div>

            {/* White Form Section */}
            <div style={{
                background: 'white',
                minHeight: 'calc(100vh - 250px)',
                padding: '3rem 1.5rem'
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {/* Progress */}
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: step === 1 ? 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' : '#E2E8F0',
                                color: step === 1 ? 'white' : '#64748B',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '1.125rem',
                                boxShadow: step === 1 ? '0 10px 25px rgba(20, 184, 166, 0.3)' : 'none'
                            }}>1</div>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: step === 2 ? 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' : '#E2E8F0',
                                color: step === 2 ? 'white' : '#64748B',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '1.125rem',
                                boxShadow: step === 2 ? '0 10px 25px rgba(20, 184, 166, 0.3)' : 'none'
                            }}>2</div>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            color: '#64748B',
                            fontWeight: '500'
                        }}>Step {step} of 2</div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div style={{ animation: 'slideIn 0.3s ease-out' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginBottom: '2rem',
                                    paddingBottom: '1rem',
                                    borderBottom: '2px solid #E2E8F0'
                                }}>
                                    <User style={{ width: '24px', height: '24px', color: '#14B8A6' }} />
                                    <h2 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: '#0F172A',
                                        margin: 0
                                    }}>Patient Demographics</h2>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '1.5rem'
                                }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Full Name *</label>
                                        <input
                                            name="patientName"
                                            value={formData.patientName}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Date of Birth *</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Gender *</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Marital Status</label>
                                        <select
                                            name="maritalStatus"
                                            value={formData.maritalStatus}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
                                        >
                                            <option>Single</option>
                                            <option>Married</option>
                                            <option>Widowed</option>
                                            <option>Divorced</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Primary Condition *</label>
                                        <input
                                            name="primaryCondition"
                                            value={formData.primaryCondition}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
                                            placeholder="e.g., Hypertension"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Ethnicity *</label>
                                        <select
                                            name="ethnicity"
                                            value={formData.ethnicity}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
                                            required
                                        >
                                            <option value="Malay">Malay</option>
                                            <option value="Chinese">Chinese</option>
                                            <option value="Indian">Indian</option>
                                            <option value="Orang Asli">Orang Asli</option>
                                            <option value="Siam">Siam</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Religion</label>
                                        <input
                                            name="religion"
                                            value={formData.religion}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
                                            placeholder="Optional"
                                        />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Residential Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                fontSize: '1rem',
                                                minHeight: '100px',
                                                resize: 'vertical'
                                            }}
                                            placeholder="Full home address"
                                        />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '0.75rem'
                                        }}>
                                            <label style={{
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: '#0F172A'
                                            }}>Medications</label>
                                            <button
                                                type="button"
                                                onClick={addMedication}
                                                className="btn-secondary"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                <Plus style={{ width: '16px', height: '16px' }} />
                                                Add Medication
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {formData.medications.map((medication, index) => (
                                                <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                    <input
                                                        value={medication}
                                                        onChange={(e) => handleMedicationChange(index, e.target.value)}
                                                        className="input-field"
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.75rem 1rem',
                                                            fontSize: '1rem'
                                                        }}
                                                        placeholder={`Medication ${index + 1} (e.g., Aspirin 100mg)`}
                                                    />
                                                    {formData.medications.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeMedication(index)}
                                                            style={{
                                                                padding: '0.75rem',
                                                                background: '#FEF2F2',
                                                                border: '2px solid #FECACA',
                                                                borderRadius: '8px',
                                                                color: '#DC2626',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = '#FEF2F2'}
                                                        >
                                                            <X style={{ width: '20px', height: '20px' }} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginTop: '2rem',
                                    paddingTop: '2rem',
                                    borderTop: '1px solid #E2E8F0'
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="btn-primary"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.875rem 2rem',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Next Step
                                        <ChevronRight style={{ width: '20px', height: '20px' }} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div style={{ animation: 'slideIn 0.3s ease-out' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginBottom: '2rem',
                                    paddingBottom: '1rem',
                                    borderBottom: '2px solid #E2E8F0'
                                }}>
                                    <Heart style={{ width: '24px', height: '24px', color: '#14B8A6' }} />
                                    <h2 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: '#0F172A',
                                        margin: 0
                                    }}>Caregiver / Guardian Information</h2>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '1.5rem'
                                }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Guardian Name *</label>
                                        <input
                                            name="guardianName"
                                            value={formData.guardianName}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
                                            placeholder="Enter guardian name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Relationship *</label>
                                        <input
                                            name="relationship"
                                            value={formData.relationship}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
                                            placeholder="e.g., Son, Daughter, Nurse"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="guardianPhone"
                                            value={formData.guardianPhone}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
                                            placeholder="+60 12-345 6789"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Email Address *</label>
                                        <input
                                            type="email"
                                            name="guardianEmail"
                                            value={formData.guardianEmail}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
                                            placeholder="guardian@example.com"
                                            required
                                        />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem'
                                        }}>Guardian Address (if different)</label>
                                        <textarea
                                            name="guardianAddress"
                                            value={formData.guardianAddress}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                fontSize: '1rem',
                                                minHeight: '80px',
                                                resize: 'vertical'
                                            }}
                                            placeholder="Leave blank if same as patient"
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '2rem',
                                    paddingTop: '2rem',
                                    borderTop: '1px solid #E2E8F0',
                                    gap: '1rem'
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="btn-secondary"
                                        style={{
                                            padding: '0.875rem 2rem',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        style={{
                                            padding: '0.875rem 2.5rem',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Save Profile & Continue
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};
