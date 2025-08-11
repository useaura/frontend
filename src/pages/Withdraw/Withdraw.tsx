import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type WithdrawStep = 'details' | 'preview' | 'pin';

export const Withdraw = () => {
  const [currentStep, setCurrentStep] = useState<WithdrawStep>('details');
  const [withdrawData, setWithdrawData] = useState({
    receiverAddress: '',
    amount: '',
    fee: '0.50',
  });
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

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

  const renderDetailsStep = () => (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Receiver Wallet Address
        </label>
        <input
          type="text"
          value={withdrawData.receiverAddress}
          onChange={(e) => setWithdrawData({ ...withdrawData, receiverAddress: e.target.value })}
          placeholder="Enter wallet address"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount
        </label>
        <input
          type="number"
          value={withdrawData.amount}
          onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
          placeholder="0.00"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
        />
      </div>
    </>
  );

  const renderPreviewStep = () => (
    <div className="mb-6">
      <div className="bg-white/5 rounded-xl p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-300">Amount:</span>
          <span className="font-semibold">{withdrawData.amount} USDC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Fee:</span>
          <span className="font-semibold">{withdrawData.fee} USDC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Receiver:</span>
          <span className="font-semibold text-sm">
            {withdrawData.receiverAddress.slice(0, 8)}...{withdrawData.receiverAddress.slice(-6)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Chain:</span>
          <span className="font-semibold">Ethereum</span>
        </div>
      </div>
      <button
        onClick={() => setCurrentStep('details')}
        className="text-primary text-sm font-medium mt-4"
      >
        Edit Details
      </button>
    </div>
  );

  const renderPinStep = () => (
    <div className="mb-6">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-300 mb-4">
          This will authorise the withdrawal
        </p>
        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 ${
                index < pin.length ? 'bg-primary border-primary' : 'border-gray-400'
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
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {currentStep !== 'details' && (
          <button
            onClick={() => setCurrentStep(currentStep === 'preview' ? 'details' : 'preview')}
            className="p-2"
          >
            <ArrowLeftIcon className="w-6 h-6 text-white" />
          </button>
        )}
        <h1 className="text-lg font-semibold">{getStepTitle()}</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {currentStep === 'details' && renderDetailsStep()}
        {currentStep === 'preview' && renderPreviewStep()}
        {currentStep === 'pin' && renderPinStep()}
      </div>

      {/* Continue Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleContinue}
          disabled={!canContinue()}
          className={`w-full py-4 rounded-xl font-bold ${
            canContinue()
              ? 'bg-primary text-black'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
