import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Shield, Store, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, signup, switchDemoRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error('Please fill all required fields');
        }
        const res = await signup(formData.name, formData.email, formData.password, formData.phone, role);
        if (!res.success) throw new Error(res.error || 'Registration failed');
      } else {
        if (!formData.email || !formData.password) {
          throw new Error('Please enter your email and password');
        }
        const res = await login(formData.email, formData.password);
        if (!res.success) throw new Error(res.error || 'Login failed');
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (roleKey) => {
    switchDemoRole(roleKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              {isRegister ? 'Join Qaswa Hills' : 'Welcome Back'}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {isRegister ? 'Create an account to manage bookings & rewards' : 'Sign in to access your table reservations'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Quick Viva Demo Login Buttons */}
          <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                ⚡ 1-Click Demo Accounts (Viva Presentation)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('owner')}
                className="py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all"
              >
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span>Manager</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* If Register: Name, Phone, Role Selector */}
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Account Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['customer', 'owner', 'admin'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-1.5 px-2 text-xs rounded-lg capitalize border font-medium ${
                          role === r
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-stone-950 border-stone-800 text-stone-400'
                        }`}
                      >
                        {r === 'owner' ? 'Hotel Owner' : r}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-lg transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
              ) : isRegister ? (
                'Create Account'
              ) : (
                'Sign In to Reservation Portal'
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="text-center pt-2 border-t border-stone-800">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-xs text-stone-400 hover:text-amber-400 transition-colors"
            >
              {isRegister
                ? 'Already have an account? Sign In here'
                : "Don't have an account? Register now"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
