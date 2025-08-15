import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, WifiIcon } from '@heroicons/react/24/outline';
import { NFCScanner } from '../../components/NFCScanner';

type WithdrawStep = 'details' | 'preview' | 'pin';

export const Withdraw = () => {
  const [currentStep, setCurrentStep] = useState<WithdrawStep>('details');
  const [withdrawData, setWithdrawData] = useState({
    receiverAddress: '',
    amount: '',
    fee: '0.50',
  });
  const [pin, setPin] = useState('');
  const [showNFCScanner, setShowNFCScanner] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we have receiver address from navigation state (e.g., from NFC scan)
  useEffect(() => {
    if (location.state?.receiverAddress) {
      setWithdrawData(prev => ({
        ...prev,
        receiverAddress: location.state.receiverAddress
      }));
    }
  }, [location.state]);

  const handleContinue = () => {
    if (currentStep === 'details') {
      if (withdrawData.receiverAddress && withdrawData.amount) {
        setCurrentStep('preview');
      }
    } else if (currentStep === 'preview') {
      setCurrentStep('pin');
    } else if (currentStep === 'pin') {
      if (pin.length === 4) {
        // Process withdrawal
        console.log('Processing withdrawal:', { ...withdrawData, pin });
        navigate('/home');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      navigate('/home');
      return;
    }
    if (currentStep === 'preview') setCurrentStep('details');
    else if (currentStep === 'pin') setCurrentStep('preview');
  };

  const renderDetailsStep = () => (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Receiver Wallet Address
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={withdrawData.receiverAddress}
            onChange={(e) => setWithdrawData({ ...withdrawData, receiverAddress: e.target.value })}
            placeholder="Enter wallet address"
            className="flex-1 bg-surface border border-border/20 rounded-xl px-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border/60"
          />
          <button
            onClick={() => setShowNFCScanner(true)}
            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors flex items-center gap-2"
          >
            <WifiIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Scan</span>
          </button>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Amount
        </label>
        <input
          type="number"
          value={withdrawData.amount}
          onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
          placeholder="0.00"
          className="w-full bg-surface border border-border/20 rounded-xl px-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border/60"
        />
      </div>
    </>
  );

  const renderPreviewStep = () => (
    <div className="mb-6">
      <div className="bg-surface border border-border/20 rounded-xl p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-text-secondary">Amount:</span>
          <span className="font-semibold text-text-primary">{withdrawData.amount} USDC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Fee:</span>
          <span className="font-semibold text-text-primary">{withdrawData.fee} USDC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Receiver:</span>
          <span className="font-semibold text-sm text-text-primary">
            {withdrawData.receiverAddress.slice(0, 8)}...{withdrawData.receiverAddress.slice(-6)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Chain:</span>
          <span className="font-semibold text-text-primary">Ethereum</span>
        </div>
      </div>
      <button
        onClick={() => setCurrentStep('details')}
        className="text-text-primary text-sm font-medium mt-4"
      >
        Edit Details
      </button>
    </div>
  );

  const renderPinStep = () => (
    <div className="mb-6">
      <div className="text-center mb-6">
        <p className="text-sm text-text-secondary mb-4">
          This will authorise the withdrawal
        </p>
        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 ${
                index < pin.length ? 'bg-surface border-border' : 'border-border/40'
              }`}
            />
          ))}
        </div>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value.slice(0, 4))}
          className="opacity-0 absolute pointer-events-none"
          autoFocus
        />
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'details': return 'Withdraw USDC';
      case 'preview': return 'Confirm Withdrawal';
      case 'pin': return 'Enter Wallet PIN';
      default: return '';
    }
  };

  const canContinue = () => {
    switch (currentStep) {
      case 'details': return withdrawData.receiverAddress && withdrawData.amount;
      case 'preview': return true;
      case 'pin': return pin.length === 4;
      default: return false;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/20">
        <button onClick={handleBack} className="p-2">
          <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">{getStepTitle()}</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {currentStep === 'details' && renderDetailsStep()}
        {currentStep === 'preview' && renderPreviewStep()}
        {currentStep === 'pin' && renderPinStep()}
      </div>

      {/* Continue Button */}
      <div className="p-4 border-t border-border/20">
        <button
          onClick={handleContinue}
          disabled={!canContinue()}
          className={`w-full py-4 rounded-xl font-bold ${
            canContinue()
              ? 'bg-surface border border-border text-text-primary'
              : 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>

      {/* NFC Scanner Modal */}
      {showNFCScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-border/20 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Scan NFC Tag</h3>
              <button
                onClick={() => setShowNFCScanner(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>
            
            <NFCScanner
              onScan={(data) => {
                console.log('NFC Data scanned:', data);
                if (data.startsWith('0x') && data.length === 42) {
                  // It's a wallet address
                  setWithdrawData(prev => ({ ...prev, receiverAddress: data }));
                  setShowNFCScanner(false);
                } else {
                  alert(`Scanned data: ${data}\n\nThis doesn't appear to be a valid wallet address.`);
                }
              }}
              onError={(error) => {
                console.error('NFC Error:', error);
                alert(`NFC Error: ${error}`);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
