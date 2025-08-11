import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, UserIcon, CreditCardIcon, ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export const Settings = () => {
  const [settings, setSettings] = useState({
    name: 'John Doe',
    dailyLimit: '1000',
    monthlyLimit: '10000',
    panicMode: false,
    reversePinPanic: true,
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Sync panic mode from URL state if available
  useEffect(() => {
    if (location.state?.panicMode !== undefined) {
      setSettings(prev => ({ ...prev, panicMode: location.state.panicMode }));
    }
  }, [location.state]);

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // In a real app, save to backend/localStorage
    navigate('/home', { state: { panicMode: settings.panicMode } });
  };

  const handlePanicModeToggle = () => {
    const newPanicMode = !settings.panicMode;
    setSettings({ ...settings, panicMode: newPanicMode });
    
    // Show confirmation for enabling panic mode
    if (newPanicMode) {
      if (confirm('Are you sure you want to enable Panic Mode? This will disable all transactions.')) {
        setSettings({ ...settings, panicMode: true });
      }
    } else {
      setSettings({ ...settings, panicMode: false });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <button onClick={() => navigate('/home')} className="p-2">
          <ArrowLeftIcon className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold">Settings</h1>
        <button onClick={handleSave} className="text-primary font-medium">
          Save
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Profile Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <UserIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Profile Settings</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Card Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <CreditCardIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Card Settings</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Daily Transaction Limit (USDC)
            </label>
            <input
              type="number"
              value={settings.dailyLimit}
              onChange={(e) => setSettings({ ...settings, dailyLimit: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Monthly Transaction Limit (USDC)
            </label>
            <input
              type="number"
              value={settings.monthlyLimit}
              onChange={(e) => setSettings({ ...settings, monthlyLimit: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Panic Mode</div>
              <div className="text-sm text-gray-400">Disable all transactions</div>
            </div>
            <button
              onClick={handlePanicModeToggle}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.panicMode ? 'bg-red-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.panicMode ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheckIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
          
          <button className="w-full text-left bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
            <div className="font-medium">Change Card PIN</div>
            <div className="text-sm text-gray-400">Update your 4-digit PIN</div>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Reverse PIN Trigger Panic Mode</div>
              <div className="text-sm text-gray-400">Enter PIN backwards to activate panic mode</div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, reversePinPanic: !settings.reversePinPanic })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.reversePinPanic ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.reversePinPanic ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        {/* About & Help */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <InformationCircleIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">About & Help</h2>
          </div>
          
          <button className="w-full text-left bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
            <div className="font-medium">FAQs</div>
            <div className="text-sm text-gray-400">Frequently asked questions</div>
          </button>
          
          <button className="w-full text-left bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
            <div className="font-medium">Contact Support</div>
            <div className="text-sm text-gray-400">Get help from our team</div>
          </button>
          
          <button className="w-full text-left bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
            <div className="font-medium">Terms of Service</div>
            <div className="text-sm text-gray-400">Read our terms and conditions</div>
          </button>
        </div>
      </div>
    </div>
  );
};
