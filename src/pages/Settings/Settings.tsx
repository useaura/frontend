import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Modal } from '../../components/Modal';
import { settingsApi, type Profile } from '../../lib/settings';

export const Settings = () => {
  const [settings, setSettings] = useState({
    name: '',
    dailyLimit: '',
    monthlyLimit: '',
    panicMode: false,
    reversePinPanic: false,
  });
  const [isPinFlowOpen, setIsPinFlowOpen] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPinSuccess, setShowPinSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  // const location = useLocation();

  // Load profile on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const profile: Profile = await settingsApi.getProfile();
        if (!mounted) return;
        setSettings({
          name: profile.displayName || '',
          dailyLimit: profile.cardLimits ? String(profile.cardLimits.dailyLimit) : '',
          monthlyLimit: profile.cardLimits ? String(profile.cardLimits.monthlyLimit) : '',
          panicMode: profile.controls.panicMode,
          reversePinPanic: profile.controls.reversePinEnabled,
        });
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    try {
      setError(null);
      // Save display name
      if (settings.name.trim().length > 0) {
        await settingsApi.updateDisplayName(settings.name.trim());
      }

      // Save limits (only send provided values)
      const daily = settings.dailyLimit.trim() !== '' ? Number(settings.dailyLimit) : undefined;
      const monthly = settings.monthlyLimit.trim() !== '' ? Number(settings.monthlyLimit) : undefined;
      if (daily !== undefined || monthly !== undefined) {
        await settingsApi.updateCardLimits(daily, monthly);
      }

      navigate('/home', { state: { panicMode: settings.panicMode } });
    } catch (e: any) {
      setError(e?.message || 'Failed to save settings');
    } finally {
      // no-op
    }
  };

  const handlePanicModeToggle = async () => {
    const newPanicMode = !settings.panicMode;
    // Optimistic update
    setSettings(prev => ({ ...prev, panicMode: newPanicMode }));
    try {
      if (newPanicMode) {
        const ok = confirm('Enable Panic Mode? This disables all transactions.');
        if (!ok) {
          setSettings(prev => ({ ...prev, panicMode: !newPanicMode }));
          return;
        }
      }
      await settingsApi.togglePanicMode(newPanicMode);
    } catch (e: any) {
      setSettings(prev => ({ ...prev, panicMode: !newPanicMode }));
      setError(e?.message || 'Failed to update panic mode');
    }
  };

  const resetPinFlow = () => {
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    setIsPinFlowOpen(false);
  };

  const canSavePin = () => {
    const pinRegex = /^\d{4}$/;
    return pinRegex.test(oldPin) && pinRegex.test(newPin) && newPin === confirmPin;
  };

  const handleSavePin = async () => {
    if (!canSavePin()) return;
    try {
      await settingsApi.changePin(oldPin, newPin);
      resetPinFlow();
      setShowPinSuccess(true);
    } catch (e: any) {
      setError(e?.message || 'Failed to change PIN');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/30">
        <button onClick={() => navigate('/home')} className="p-2 hover:bg-surface-secondary transition-colors">
          <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-lg font-medium text-text-primary">Settings</h1>
        <button 
          onClick={handleSave}
          className="px-3 py-1 border border-border rounded-xl text-sm text-text-primary hover:bg-surface-secondary transition-colors"
        >
          Save
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-0 py-8 space-y-8">
        {error && (
          <div className="mx-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
        {loading && (
          <div className="mx-6 text-sm text-text-secondary">Loading settings…</div>
        )}
        {/* Profile */}
        <div className="bg-surface-primary border border-border/20 p-6 shadow-sm rounded-xl">
          <h2 className="text-sm font-semibold text-text-secondary mb-4">Profile</h2>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            className="input-field"
            placeholder="Your name"
          />
        </div>

        {/* Card Limits */}
        <div className="bg-surface-primary border border-border/20 p-6 shadow-sm rounded-xl">
          <h2 className="text-sm font-semibold text-text-secondary mb-4">Card Limits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Daily Limit (USDC)
              </label>
              <input
                type="number"
                value={settings.dailyLimit}
                onChange={(e) => setSettings({ ...settings, dailyLimit: e.target.value })}
                className="input-field"
                placeholder="e.g. 1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Monthly Limit (USDC)
              </label>
              <input
                type="number"
                value={settings.monthlyLimit}
                onChange={(e) => setSettings({ ...settings, monthlyLimit: e.target.value })}
                className="input-field"
                placeholder="e.g. 10000"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-surface-primary border border-border/20 p-2 shadow-sm rounded-xl">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-text-secondary">Controls</h2>
          <div className="divide-y divide-border/20">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <div className="font-medium text-text-primary">Panic Mode</div>
                <div className="text-sm text-text-secondary">Disable all transactions</div>
              </div>
              <button
                onClick={handlePanicModeToggle}
                className={`w-14 h-7 transition-all duration-300 ${
                  settings.panicMode ? 'bg-red-600' : 'bg-surface-secondary'
                } rounded-xl`}
              >
                <div className={`w-6 h-6 bg-surface transition-transform duration-300 ${
                  settings.panicMode ? 'translate-x-7' : 'translate-x-1'
                } rounded-xl`} />
              </button>
            </div>
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <div className="font-medium text-text-primary">Reverse PIN triggers Panic Mode</div>
                <div className="text-sm text-text-secondary">Enter PIN backwards to activate panic mode</div>
              </div>
              <button
                onClick={async () => {
                  const next = !settings.reversePinPanic;
                  setSettings(prev => ({ ...prev, reversePinPanic: next }));
                  try {
                    await settingsApi.toggleReversePin(next);
                  } catch (e: any) {
                    setSettings(prev => ({ ...prev, reversePinPanic: !next }));
                    setError(e?.message || 'Failed to update reverse PIN setting');
                  }
                }}
                className={`w-14 h-7 transition-all duration-300 ${
                  settings.reversePinPanic ? 'bg-blue-600' : 'bg-surface-secondary'
                } rounded-xl`}
              >
                <div className={`w-6 h-6 bg-surface transition-transform duration-300 ${
                  settings.reversePinPanic ? 'translate-x-7' : 'translate-x-1'
                } rounded-xl`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-surface-primary border border-border/20 p-2 shadow-sm rounded-xl">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-text-secondary">Security</h2>
          <button
            onClick={() => setIsPinFlowOpen(true)}
            className="w-full text-left px-4 py-4 hover:bg-surface-secondary transition-colors"
          >
            <div className="font-medium text-text-primary">Change Card PIN</div>
            <div className="text-sm text-text-secondary">Update your 4-digit PIN</div>
          </button>
        </div>
      </div>

      {/* Change PIN Modal */}
      {isPinFlowOpen && (
        <div className="modal-overlay" onClick={resetPinFlow}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4 text-text-primary">Change Card PIN</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Current PIN</label>
                <input
                  type="password"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                  className="input-field"
                  placeholder="••••"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">New PIN</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                    className="input-field"
                    placeholder="••••"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Confirm PIN</label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                    className="input-field"
                    placeholder="••••"
                  />
                </div>
              </div>
              {!canSavePin() && (
                <p className="text-sm text-text-secondary">Enter 4 digits for each field. New PINs must match.</p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={resetPinFlow}
                  className="flex-1 py-3 px-4 bg-surface-secondary text-text-primary rounded-xl font-medium hover:bg-surface-tertiary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePin}
                  disabled={!canSavePin()}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                    canSavePin()
                      ? 'bg-text-primary text-background hover:bg-text-secondary'
                      : 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
                  }`}
                >
                  Save PIN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showPinSuccess}
        onClose={() => setShowPinSuccess(false)}
        type="success"
        title="PIN Updated"
        message="Your card PIN has been updated successfully."
        actionText="Done"
        onAction={() => setShowPinSuccess(false)}
      />
    </div>
  );
};
