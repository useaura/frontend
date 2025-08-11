import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cog6ToothIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { Modal } from '../../components/Modal';

export const Home = () => {
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
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
    } else {
      setShowErrorModal(true);
    }
  };

  const handleWithdraw = () => {
    if (!isPanicMode) {
      navigate('/withdraw');
    } else {
      setShowErrorModal(true);
    }
  };

  const handleSettings = () => {
    navigate('/settings', { state: { panicMode: isPanicMode } });
  };

  const handleTransactions = () => {
    navigate('/transactions');
  };

  type Tx = {
    id: string;
    direction: 'credit' | 'debit';
    counterparty: string;
    amount: string;
    status: 'completed' | 'pending' | 'failed';
    label: string;
  };

  const recentTransactions: Tx[] = [
    { id: '1', direction: 'credit', counterparty: 'Alice', amount: '+50 USDC', status: 'completed', label: 'Received' },
    { id: '2', direction: 'debit', counterparty: 'Bob', amount: '-20 USDC', status: 'pending', label: 'Sent' },
  ];

  const computeClasses = (status: Tx['status'], direction: Tx['direction']) => {
    // Pending always yellow
    if (status === 'pending') {
      return {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/20',
        dot: 'bg-yellow-400',
        amount: 'text-yellow-400',
        stripe: 'border-l-yellow-500',
      };
    }

    // Failed always red
    if (status === 'failed') {
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/20',
        dot: 'bg-red-400',
        amount: 'text-red-400',
        stripe: 'border-l-red-500',
      };
    }

    // Completed: green for credit, red for debit
    if (direction === 'credit') {
      return {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/20',
        dot: 'bg-green-400',
        amount: 'text-green-400',
        stripe: 'border-l-green-500',
      };
    }

    return {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
      dot: 'bg-red-400',
      amount: 'text-red-400',
      stripe: 'border-l-red-500',
    };
  };

  return (
    <>
      {/* Mobile Restriction Warning */}
      <div className="app-route">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Mobile Only</h2>
          <p className="text-lg mb-6">This app is designed for mobile devices only.</p>
          <p className="text-sm text-text-secondary">Please open this app on your mobile device for the best experience.</p>
        </div>
      </div>

      {/* App Content */}
      <div className="app-content min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
        {/* Header */}
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-lg font-medium text-text-primary">Hi, User</h1>
            </div>
            <button 
              onClick={handleSettings}
              className="w-12 h-12 bg-surface border border-border rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-border/60 hover:scale-105"
            >
              <Cog6ToothIcon className="w-6 h-6 text-text-secondary" />
            </button>
          </div>

          {/* Panic Mode Banner */}
          {isPanicMode && (
            <div className="bg-surface border border-border/20 rounded-xl p-4 mb-6 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface border border-border/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Panic Mode Active</p>
                  <p className="text-sm text-text-secondary">Disable in Settings to resume activity</p>
                </div>
              </div>
            </div>
          )}

          {/* Balance Card */}
          <div className="bg-surface border border-border/20 rounded-xl p-8 mb-8 text-center shadow-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {isPanicMode ? (
              <div className="text-text-secondary">
                <div className="text-4xl font-bold">$0.00</div>
              </div>
            ) : (
              <div className="text-4xl font-bold text-text-primary">$1,250.00</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={handleReceive}
              disabled={isPanicMode}
              className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 ${
                isPanicMode
                  ? 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
                  : 'bg-surface border border-border text-text-primary shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isPanicMode ? 'bg-surface-tertiary' : 'bg-surface-secondary'
                }`}>
                  <ArrowDownIcon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">Receive</span>
              </div>
            </button>
            
            <button
              onClick={handleWithdraw}
              disabled={isPanicMode}
              className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 ${
                isPanicMode
                  ? 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
                  : 'bg-surface border border-border text-text-primary shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isPanicMode ? 'bg-surface-tertiary' : 'bg-surface-secondary'
                }`}>
                  <ArrowUpIcon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">Withdraw</span>
              </div>
            </button>
          </div>

          {/* Recent Transactions */}
          <div className="bg-surface border border-border/20 rounded-xl p-6 shadow-sm animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">Recent Transactions</h2>
              <button 
                onClick={handleTransactions}
                className="text-text-primary text-sm font-medium hover:text-text-secondary transition-colors hover:scale-105"
              >
                View All
              </button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {recentTransactions.map((tx) => {
                const c = computeClasses(tx.status, tx.direction);
                return (
                  <div
                    key={tx.id}
                    className={`flex items-center justify-between p-4 bg-surface-secondary border ${c.border} rounded-xl hover:border-border/40 transition-all duration-300 hover:scale-[1.01] ${c.stripe} border-l-4`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface border border-border/20 rounded-xl flex items-center justify-center">
                        {tx.direction === 'credit' ? (
                          <ArrowDownIcon className={`w-5 h-5 ${c.amount}`} />
                        ) : (
                          <ArrowUpIcon className={`w-5 h-5 ${c.amount}`} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">
                          {tx.direction === 'credit' ? 'From' : 'To'}: {tx.counterparty}
                        </div>
                        <div className={`text-xs inline-flex items-center gap-2 px-2 py-0.5 border rounded-full ${c.bg} ${c.text} ${c.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
                          <span className="capitalize">{tx.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold ${c.amount}`}>{tx.amount}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          type="success"
          title="Action Successful!"
          message="Your request has been processed successfully."
          actionText="Continue"
          onAction={() => setShowSuccessModal(false)}
        />

        {/* Error Modal */}
        <Modal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          type="error"
          title="Action Blocked"
          message="This action is not available while Panic Mode is active. Please disable Panic Mode in Settings to continue."
          actionText="Go to Settings"
          onAction={() => {
            setShowErrorModal(false);
            navigate('/settings');
          }}
        />
      </div>
    </>
  );
};
