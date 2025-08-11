import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cog6ToothIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

export const Home = () => {
  const [isPanicMode, setIsPanicMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync panic mode from Settings page
  useEffect(() => {
    if (location.state?.panicMode !== undefined) {
      setIsPanicMode(location.state.panicMode);
    }
  }, [location.state]);

  const handleReceive = () => {
    if (!isPanicMode) {
      navigate('/receive');
    }
  };

  const handleWithdraw = () => {
    if (!isPanicMode) {
      navigate('/withdraw');
    }
  };

  const handleSettings = () => {
    navigate('/settings', { state: { panicMode: isPanicMode } });
  };

  const handleTransactions = () => {
    navigate('/transactions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Hi, User</h1>
            <p className="text-text-secondary">Welcome back!</p>
          </div>
          <button 
            onClick={handleSettings}
            className="w-12 h-12 bg-white rounded-2xl shadow-soft flex items-center justify-center hover:shadow-medium transition-all duration-300 hover:-translate-y-0.5"
          >
            <Cog6ToothIcon className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Panic Mode Banner */}
        {isPanicMode && (
          <div className="bg-error-50 border border-error-200 rounded-2xl p-4 mb-6 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-error-800">Panic Mode Active</p>
                <p className="text-sm text-error-600">Disable in Settings to resume activity</p>
              </div>
            </div>
          </div>
        )}

        {/* Balance Card */}
        <div className="glass-effect rounded-3xl p-8 mb-8 text-center card-hover">
          {isPanicMode ? (
            <div className="text-error-600">
              <div className="text-4xl font-bold mb-2">Insufficient funds</div>
              <div className="text-text-secondary">Available Balance</div>
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-text-primary mb-2">$1,250.00</div>
              <div className="text-text-secondary mb-4">Available Balance</div>
              <div className="flex items-center justify-center gap-2 text-success-600">
                <ArrowUpIcon className="w-4 h-4" />
                <span className="text-sm font-medium">+2.5% from last month</span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleReceive}
            disabled={isPanicMode}
            className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
              isPanicMode
                ? 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
                : 'bg-gradient-to-br from-success-500 to-success-600 text-white shadow-glow hover:shadow-large hover:-translate-y-1'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                isPanicMode ? 'bg-surface-tertiary' : 'bg-white/20'
              }`}>
                <ArrowDownIcon className="w-6 h-6" />
              </div>
              <span className="font-semibold text-lg">Receive</span>
            </div>
          </button>
          
          <button
            onClick={handleWithdraw}
            disabled={isPanicMode}
            className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
              isPanicMode
                ? 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
                : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-glow hover:shadow-large hover:-translate-y-1'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                isPanicMode ? 'bg-surface-tertiary' : 'bg-white/20'
              }`}>
                <ArrowUpIcon className="w-6 h-6" />
              </div>
              <span className="font-semibold text-lg">Withdraw</span>
            </div>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="glass-effect rounded-3xl p-6 card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Recent Transactions</h2>
            <button 
              onClick={handleTransactions}
              className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Transaction 1 */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                  <ArrowDownIcon className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <div className="font-medium text-text-primary">From: Alice</div>
                  <div className="text-sm text-text-secondary">Received</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-success-600">+50 USDC</div>
                <div className="text-xs text-text-tertiary">Completed</div>
              </div>
            </div>
            
            {/* Transaction 2 */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-error-100 rounded-xl flex items-center justify-center">
                  <ArrowUpIcon className="w-5 h-5 text-error-600" />
                </div>
                <div>
                  <div className="font-medium text-text-primary">To: Bob</div>
                  <div className="text-sm text-text-secondary">Sent</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-error-600">-20 USDC</div>
                <div className="text-xs text-text-tertiary">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
