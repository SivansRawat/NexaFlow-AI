import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/lib/api';
import { ShieldCheck, Lock, CreditCard, Eye, EyeOff, CheckCircle, AlertCircle, ArrowUpRight, User, Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../common/SEO';

const Settings: React.FC = () => {
  const { token, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{
    startDate: string;
    expiryDate: string;
    amount: number;
    planName: string;
  } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedUser = res.data.user;
        setSubscription({
          startDate: fetchedUser.subscriptionStart ? fetchedUser.subscriptionStart.slice(0, 10) : 'Active',
          expiryDate: fetchedUser.expiry ? fetchedUser.expiry.slice(0, 10) : 'Never',
          amount: fetchedUser.plan === 'Paid' ? 5666 : 0,
          planName: fetchedUser.plan || 'Free Tier',
        });
      } catch (e: any) {
        setSubscription(null);
      }
    }
    fetchUser();
  }, [token]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await axios.post(
        `${API_BASE}/user/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update password. Please check your old password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 w-full max-w-5xl mx-auto pt-2 pb-16 font-['Inter']">
      <SEO 
        title="Account Settings & Profile"
        description="Manage your NexaFlow AI account settings, profile information, password security, and active subscription plan."
        canonical="/premium/settings"
        noindex={true}
      />

      {/* Top Banner & Profile Header (Matching Reference Image Header Layout) */}
      <div className="relative overflow-hidden rounded-[28px] border border-[#262626] bg-[#0b0b0f] shadow-2xl">
        {/* Cover Graphic / Banner Backdrop */}
        <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-[#2640D9]/20 via-[#6633E6]/15 to-[#0b0b0f] relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#2640D9]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#8A66E6]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Profile Info Overlay Row */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-14 sm:-mt-16">
          {/* Left: Avatar + Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar Circle */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#121218] p-1 border-4 border-[#0b0b0f] shadow-xl flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#2640D9] via-[#8A66E6] to-[#6633E6] flex items-center justify-center text-white text-3xl font-light">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>

            {/* Name + Badge + Email */}
            <div className="space-y-1 mb-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                  {user?.username || 'User Account'}
                </h1>
                <span className={`px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                  user?.isPremium 
                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                    : 'bg-[#2640D9]/15 text-[#8A66E6] border-[#2640D9]/30'
                }`}>
                  {user?.isPremium ? 'Pro' : 'Free'}
                </span>
              </div>
              <p className="text-sm text-[#737373] font-light">
                {user?.email || 'N/A'}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!user?.isPremium ? (
              <Link 
                to="/#hero-section" 
                className="w-full sm:w-auto px-6 py-2.5 rounded-full font-medium text-xs tracking-wider uppercase bg-[#2640D9] hover:bg-[#6633E6] text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2640D9]/25"
              >
                <span>Upgrade Plan</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Account Verified Pro</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Settings Sections (Left Info Label + Right Rounded Container Layout) */}
      <div className="space-y-10">

        {/* SECTION 1: Personal Info & Account Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start pt-4 border-t border-[#262626]">
          {/* Left Column: Label */}
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-white">Personal Info</h2>
            <p className="text-xs text-[#737373] leading-relaxed font-light">
              View your personal profile parameters and security credentials.
            </p>
          </div>

          {/* Right Column: Card Container */}
          <div className="md:col-span-2 rounded-[28px] border border-[#262626] bg-[#0b0b0f] p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name / Username */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#737373]">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text"
                    readOnly
                    value={user?.username || ''}
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-[#050505] text-white border border-[#262626] text-sm font-normal cursor-not-allowed opacity-90"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#737373]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email"
                    readOnly
                    value={user?.email || 'N/A'}
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-[#050505] text-white border border-[#262626] text-sm font-normal cursor-not-allowed opacity-90"
                  />
                </div>
              </div>

              {/* Account Role */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Account Privilege Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#737373]">
                    <Shield className="w-4 h-4" />
                  </div>
                  <input 
                    type="text"
                    readOnly
                    value={user?.role || 'USER'}
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-[#050505] text-white border border-[#262626] text-sm font-normal cursor-not-allowed opacity-90 uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Security & Password Update */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start pt-8 border-t border-[#262626]">
          {/* Left Column: Label */}
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-white">Security & Password</h2>
            <p className="text-xs text-[#737373] leading-relaxed font-light">
              Update your account password for enhanced security and protection.
            </p>
          </div>

          {/* Right Column: Card Container with Password Form */}
          <div className="md:col-span-2 rounded-[28px] border border-[#262626] bg-[#0b0b0f] p-6 sm:p-8 space-y-6">
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#737373]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-11 pr-11 py-3 rounded-full bg-[#050505] text-white placeholder-[#737373] border border-[#262626] focus:border-[#2640D9] focus:outline-none transition-all text-sm font-normal"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#737373] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-5 py-3 rounded-full bg-[#050505] text-white placeholder-[#737373] border border-[#262626] focus:border-[#2640D9] focus:outline-none transition-all text-sm font-normal"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-5 py-3 rounded-full bg-[#050505] text-white placeholder-[#737373] border border-[#262626] focus:border-[#2640D9] focus:outline-none transition-all text-sm font-normal"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {message && (
                <div className="p-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-full font-medium text-xs tracking-wider uppercase bg-[#2640D9] hover:bg-[#6633E6] text-white shadow-lg shadow-[#2640D9]/20 transition-all"
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* SECTION 3: Subscription & Payments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start pt-8 border-t border-[#262626]">
          {/* Left Column: Label */}
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-white">Subscription & Plan</h2>
            <p className="text-xs text-[#737373] leading-relaxed font-light">
              Review your current plan tier, billing dates, and payment status.
            </p>
          </div>

          {/* Right Column: Card Container */}
          <div className="md:col-span-2 rounded-[28px] border border-[#262626] bg-[#0b0b0f] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-5 border-b border-[#262626]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2640D9]/10 text-[#8A66E6] border border-[#2640D9]/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[#737373] text-xs uppercase tracking-wider block font-medium">Active Membership</span>
                  <span className="text-lg font-medium text-white">
                    {subscription?.planName || 'Free Tier'}
                  </span>
                </div>
              </div>

              <span className={`px-4 py-1 rounded-full text-xs font-semibold border ${
                user?.isPremium 
                  ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                  : 'bg-[#2640D9]/10 text-[#8A66E6] border-[#2640D9]/20'
              }`}>
                {user?.isPremium ? 'Active Pro' : 'Free Access'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-[#050505] border border-[#262626] space-y-1">
                <span className="text-[11px] text-[#737373] block">Start Date</span>
                <span className="text-sm font-medium text-white">{subscription?.startDate || '-'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#050505] border border-[#262626] space-y-1">
                <span className="text-[11px] text-[#737373] block">Expiry Date</span>
                <span className="text-sm font-medium text-white">{subscription?.expiryDate || '-'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#050505] border border-[#262626] space-y-1">
                <span className="text-[11px] text-[#737373] block">Billing Amount</span>
                <span className="text-sm font-medium text-emerald-400">₹{subscription?.amount ?? 0}</span>
              </div>
            </div>

            {!user?.isPremium && (
              <div className="pt-2">
                <Link 
                  to="/#hero-section" 
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium text-xs tracking-wider uppercase bg-[#2640D9] hover:bg-[#6633E6] text-white transition-all shadow-lg shadow-[#2640D9]/20"
                >
                  <span>Upgrade to Premium</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;