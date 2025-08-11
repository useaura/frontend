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
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/30">
        <button onClick={() => navigate('/home')} className="p-2 hover:bg-surface-secondary transition-colors hover:scale-105">
          <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-xl font-semibold text-text-primary">Settings</h1>
        <button 
          onClick={handleSave}
          className="text-text-primary font-medium hover:text-text-secondary transition-colors hover:scale-105"
        >
          Save
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 space-y-8">
        {/* Profile Settings */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-surface border border-border/20 rounded-xl flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Profile Settings</h2>
          </div>
          
          <div className="bg-surface-primary border border-border/20 p-6 shadow-sm rounded-xl">
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Display Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        {/* Card Settings */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-surface border border-border/20 rounded-xl flex items-center justify-center">
              <CreditCardIcon className="w-5 h-5 text-text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Card Settings</h2>
          </div>
          
          <div className="bg-surface-primary border border-border/20 p-6 shadow-sm rounded-xl">
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Daily Transaction Limit (USDC)
            </label>
            <input
              type="number"
              value={settings.dailyLimit}
              onChange={(e) => setSettings({ ...settings, dailyLimit: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div className="bg-surface-primary border border-border/20 p-6 shadow-sm rounded-xl">
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Monthly Transaction Limit (USDC)
            </label>
            <input
              type="number"
              value={settings.monthlyLimit}
              onChange={(e) => setSettings({ ...settings, monthlyLimit: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div className="bg-surface-primary border border-border/20 p-6 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-text-primary">Panic Mode</div>
                <div className="text-sm text-text-secondary">Disable all transactions</div>
              </div>
              <button
                onClick={handlePanicModeToggle}
                className={`w-14 h-7 transition-all duration-300 ${
                  settings.panicMode ? 'bg-surface-tertiary' : 'bg-surface-secondary'
                }`}
              >
                <div className={`w-6 h-6 bg-surface transition-transform duration-300 ${
                  settings.panicMode ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-surface border border-border/20 rounded-xl flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Security</h2>
          </div>
          
          <button className="w-full text-left bg-surface-primary border border-border/20 p-6 shadow-sm hover:border-border/40 transition-colors rounded-xl">
            <div className="font-medium text-text-primary">Change Card PIN</div>
            <div className="text-sm text-text-secondary">Update your 4-digit PIN</div>
          </button>
          
          <div className="bg-surface-primary border border-border/20 p-6 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-text-primary">Reverse PIN Trigger Panic Mode</div>
                <div className="text-sm text-text-secondary">Enter PIN backwards to activate panic mode</div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, reversePinPanic: !settings.reversePinPanic })}
                className={`w-14 h-7 transition-all duration-300 ${
                  settings.reversePinPanic ? 'bg-surface-tertiary' : 'bg-surface-secondary'
                }`}
              >
                <div className={`w-6 h-6 bg-surface transition-transform duration-300 ${
                  settings.reversePinPanic ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* About & Help */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-surface border border-border/20 rounded-xl flex items-center justify-center">
              <InformationCircleIcon className="w-5 h-5 text-text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">About & Help</h2>
          </div>
          
          <button className="w-full text-left bg-surface-primary border border-border/20 p-6 shadow-sm hover:border-border/40 transition-colors rounded-xl">
            <div className="font-medium text-text-primary">FAQs</div>
            <div className="text-sm text-text-secondary">Frequently asked questions</div>
          </button>
          
          <button className="w-full text-left bg-surface-primary border border-border/20 p-6 shadow-sm hover:border-border/40 transition-colors rounded-xl">
            <div className="font-medium text-text-primary">Contact Support</div>
            <div className="text-sm text-text-secondary">Get help from our team</div>
          </button>
          
          <button className="w-full text-left bg-surface-primary border border-border/20 p-6 shadow-sm hover:border-border/40 transition-colors rounded-xl">
            <div className="font-medium text-text-primary">Terms of Service</div>
            <div className="text-sm text-text-secondary">Read our terms and conditions</div>
          </button>
        </div>
      </div>
    </div>
  );
};
