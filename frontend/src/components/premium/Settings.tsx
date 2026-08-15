import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/lib/api';
import { ShieldCheck, Lock, CreditCard, Sparkles, Eye, EyeOff, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
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
    <div className="space-y-8 w-full max-w-5xl mx-auto pt-2 pb-12">
      <SEO 
        title="Account Settings & Subscription"
        description="Manage your NexaFlow AI account settings, password security, and active subscription plan."
        canonical="/premium/settings"
        noindex={true}
      />
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border bg-gradient-to-r from-[#2640D9]/10 via-[#0b0b0f]/50 to-[#0b0b0f] border-[#2640D9]/20 shadow-xl shadow-black/40 text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#2640D9]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#2640D9]/5 text-[#8A66E6] border border-[#2640D9]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-white font-['Outfit']">
            Account Settings & Preferences
          </h1>
          <p className="text-xs max-w-2xl leading-relaxed text-[#737373] font-normal">
            Manage your subscription details, update account credentials, and monitor usage limits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Subscription & Account Info Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl p-6 border bg-[#0b0b0f] border-[#262626] text-white space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2640D9]/5 text-[#8A66E6] border border-[#2640D9]/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[#737373] text-xs uppercase tracking-wider font-semibold block mb-0.5">Current Plan</span>
                  <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border ${
                    user?.isPremium 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-[#2640D9]/5 text-[#8A66E6] border-[#2640D9]/20'
                  }`}>
                    {subscription?.planName || 'Free'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#262626] text-xs font-normal">
              <div className="flex justify-between items-center text-gray-300">
                <span className="text-[#737373]">Start Date</span>
                <span className="font-semibold text-white">{subscription?.startDate || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span className="text-[#737373]">Expiry Date</span>
                <span className="font-semibold text-white">{subscription?.expiryDate || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span className="text-[#737373]">Monthly Amount</span>
                <span className="font-semibold text-emerald-400">₹{subscription?.amount ?? 0}</span>
              </div>
            </div>

            {!user?.isPremium && (
              <Link 
                to="/#hero-section" 
                className="w-full mt-2 py-3 px-4 rounded-full font-bold text-xs tracking-widest uppercase bg-[#2640D9] hover:bg-[#6633E6] text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2640D9]/20"
              >
                <span>Upgrade to Premium</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="rounded-3xl p-6 border bg-[#0b0b0f] border-[#262626] text-white space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#2640D9]/5 text-[#8A66E6] border border-[#2640D9]/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white font-['Outfit']">Security & Role</h3>
                <span className="text-[10px] text-[#737373]">Account Privilege</span>
              </div>
            </div>
            <div className="text-xs text-gray-300 space-y-2 pt-2 border-t border-[#262626] font-normal">
              <div className="flex justify-between">
                <span className="text-[#737373]">Username:</span>
                <span className="font-semibold text-white">{user?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Email:</span>
                <span className="font-semibold text-white">{user?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Account Role:</span>
                <span className="font-semibold text-[#C968F7] uppercase">{user?.role || 'USER'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 border bg-[#0b0b0f] border-[#262626] text-white space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#262626]">
            <div className="w-10 h-10 rounded-xl bg-[#2640D9]/5 text-[#8A66E6] border border-[#2640D9]/20 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white font-['Outfit']">Security & Password</h3>
              <p className="text-xs text-[#737373]">Update your account password for enhanced protection</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#737373] mb-1.5 uppercase tracking-widest">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pr-10 pl-5 py-3 rounded-full bg-[#050505] text-white placeholder-[#737373] border border-[#262626] focus:border-[#2640D9] focus:outline-none transition-all text-xs sm:text-sm font-normal"
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

            <div>
              <label className="block text-[10px] font-bold text-[#737373] mb-1.5 uppercase tracking-widest">
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-5 py-3 rounded-full bg-[#050505] text-white placeholder-[#737373] border border-[#262626] focus:border-[#2640D9] focus:outline-none transition-all text-xs sm:text-sm font-normal"
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#737373] mb-1.5 uppercase tracking-widest">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-5 py-3 rounded-full bg-[#050505] text-white placeholder-[#737373] border border-[#262626] focus:border-[#6366F1] focus:outline-none transition-all text-xs sm:text-sm font-normal"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {message && (
              <div className="p-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full font-bold text-xs tracking-widest uppercase bg-[#2640D9] hover:bg-[#6633E6] text-white shadow-lg shadow-[#2640D9]/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;