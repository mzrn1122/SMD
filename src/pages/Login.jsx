import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Lock, Mail, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            toast.success('Welcome back!');
        } catch (err) {
            setError(err.message || 'Failed to sign in');
            toast.error('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem'
        }}>
            <div style={{ width: '100%', maxWidth: '540px', position: 'relative' }}>
                {/* Logo & Title */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '88px',
                        height: '88px',
                        background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                        borderRadius: '24px',
                        marginBottom: '1.5rem',
                        boxShadow: '0 20px 50px rgba(20, 184, 166, 0.3)'
                    }}>
                        <Activity style={{ width: '44px', height: '44px', color: 'white', strokeWidth: 2.5 }} />
                    </div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: '#0F172A',
                        marginBottom: '0.75rem',
                        letterSpacing: '-0.025em'
                    }}>
                        Smart Medicine Dispenser
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        color: '#64748B',
                        fontWeight: '500'
                    }}>
                        Healthcare Management System
                    </p>
                </div>

                {/* Login Card */}
                <div className="card" style={{
                    padding: '3rem',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                }}>
                    {/* Card Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            color: '#0F172A',
                            marginBottom: '0.5rem'
                        }}>
                            Welcome back
                        </h2>
                        <p style={{
                            fontSize: '1rem',
                            color: '#64748B'
                        }}>
                            Sign in to access your dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Error Alert */}
                        {error && (
                            <div style={{
                                background: '#FEF2F2',
                                border: '2px solid #FECACA',
                                borderRadius: '12px',
                                padding: '1rem',
                                display: 'flex',
                                gap: '0.75rem'
                            }}>
                                <AlertCircle style={{ width: '20px', height: '20px', color: '#DC2626', flexShrink: 0 }} />
                                <p style={{ fontSize: '0.875rem', color: '#991B1B' }}>{error}</p>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#0F172A',
                                marginBottom: '0.5rem'
                            }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '20px',
                                    height: '20px',
                                    color: '#94A3B8'
                                }} />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    style={{
                                        width: '100%',
                                        paddingLeft: '3rem',
                                        paddingRight: '1rem',
                                        paddingTop: '0.875rem',
                                        paddingBottom: '0.875rem',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#0F172A',
                                marginBottom: '0.5rem'
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '20px',
                                    height: '20px',
                                    color: '#94A3B8'
                                }} />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                    style={{
                                        width: '100%',
                                        paddingLeft: '3rem',
                                        paddingRight: '1rem',
                                        paddingTop: '0.875rem',
                                        paddingBottom: '0.875rem',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                paddingTop: '1rem',
                                paddingBottom: '1rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                marginTop: '0.5rem'
                            }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTop: '2px solid white',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    <span>Signing in...</span>
                                </span>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.75rem' }}>
                        © 2026 Smart Medicine Dispenser. All rights reserved.
                    </p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#64748B'
                    }}>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};