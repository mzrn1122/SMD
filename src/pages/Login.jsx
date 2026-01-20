import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Pill, Lock, Mail, AlertCircle } from 'lucide-react';
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
            // Navigation will be handled by the auth state change
        } catch (err) {
            setError(err.message || 'Failed to sign in');
            toast.error('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    // Demo credentials helper
    const fillDemoCredentials = (role) => {
        if (role === 'admin') {
            setEmail('admin@smd.com');
            setPassword('admin123');
        } else {
            setEmail('caregiver@smd.com');
            setPassword('caregiver123');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8 animate-slide-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-lg shadow-primary-500/30">
                        <Pill className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Smart Medicine Dispenser</h1>
                    <p className="text-slate-400">Sign in to your account</p>
                </div>

                {/* Login Card */}
                <div className="card-hover animate-slide-in" style={{ animationDelay: '0.1s' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-danger-500/10 border border-danger-500/50 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-danger-400">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field w-full pl-11"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field w-full pl-11"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 pt-6 border-t border-slate-800">
                        <p className="text-sm text-slate-400 mb-3 text-center">Quick Demo Access:</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials('caregiver')}
                                className="btn-secondary text-sm py-2"
                            >
                                Caregiver Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials('admin')}
                                className="btn-secondary text-sm py-2"
                            >
                                Admin Demo
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-3 text-center">
                            Click to auto-fill demo credentials
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-6">
                    © 2026 Smart Medicine Dispenser. All rights reserved.
                </p>
            </div>
        </div>
    );
};
