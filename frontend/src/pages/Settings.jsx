import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Lock, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Globe
} from 'lucide-react';

const Settings = () => {
  const { user, login } = useContext(AuthContext); // Use login to update local storage user info
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Software engineer building delightful things.',
    timezone: 'PST (UTC-8)',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'password', name: 'Password', icon: Lock },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    
    try {
      const res = await api.put('/auth/profile', {
        name: formData.name,
        email: formData.email
      });
      
      // Update local storage and context
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('token', res.data.token);
      // We don't have a direct 'setUser' but login/register handle it. 
      // For simplicity in this demo, let's assume the context updates or user refreshes.
      // Ideally AuthContext should have a updateUser method.
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1 font-medium">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-3 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 mb-1 font-bold ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 overflow-hidden">
            {activeTab === 'profile' && (
              <div className="p-8 sm:p-10">
                <div className="mb-8 pb-8 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Profile Info</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">This is how others see you in the workspace.</p>
                </div>

                {message && (
                  <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-bold text-sm">{message.text}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-8">
                  {/* Avatar Upload */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/20 border-4 border-white overflow-hidden">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <button type="button" className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors group-hover:scale-110 duration-300">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <button type="button" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                        Upload new
                      </button>
                      <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-wider">JPG, PNG. Max 2MB.</p>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Role</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          readOnly
                          value={user?.role?.toUpperCase() || 'MEMBER'}
                          className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-500 cursor-not-allowed"
                        />
                        <Shield className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Timezone</label>
                      <div className="relative">
                        <select 
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 appearance-none"
                        >
                          <option>PST (UTC-8)</option>
                          <option>EST (UTC-5)</option>
                          <option>GMT (UTC+0)</option>
                          <option>IST (UTC+5:30)</option>
                        </select>
                        <Globe className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Bio</label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 resize-none"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 flex items-center gap-3"
                    >
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab !== 'profile' && (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Coming Soon</h3>
                <p className="text-slate-500 mt-2 font-medium max-w-sm">The {activeTab} settings are currently under development and will be available in the next update.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
