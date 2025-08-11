import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, QrCodeIcon, CreditCardIcon } from '@heroicons/react/24/outline';

type ReceiveStep = 'options' | 'address' | 'card-amount' | 'card-waiting' | 'card-pin';

export const Receive = () => {
  const [currentStep, setCurrentStep] = useState<ReceiveStep>('options');
  const [receiveData, setReceiveData] = useState({
    amount: '',
    narration: '',
    receiver: 'John Doe',
  });
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const renderOptionsStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-lg text-gray-300">Choose how you want to receive</p>
      </div>
      
      <button
        onClick={() => setCurrentStep('address')}
        className="w-full bg-white/5 border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <QrCodeIcon className="w-6 h-6 text-black" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-lg">Receive with Address</div>
            <div className="text-sm text-gray-400">Share your wallet address</div>
          </div>
        </div>
      </button>

      <button
        onClick={() => setCurrentStep('card-amount')}
        className="w-full bg-white/5 border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
            <CreditCardIcon className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-lg">Receive with Card</div>
            <div className="text-sm text-gray-400">NFC card transfer</div>
          </div>
        </div>
      </button>
    </div>
  );

  const renderAddressStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Your Wallet Address</h2>
        <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
          <QrCodeIcon className="w-24 h-24 text-gray-800" />
        </div>
        <div className="bg-white/5 rounded-lg p-3 mb-4">
          <div className="text-sm text-gray-300 mb-2">Wallet Address</div>
          <div className="font-mono text-sm break-all">
            0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
          </div>
        </div>
        <button className="text-primary text-sm font-medium">Copy Address</button>
      </div>
      
      <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-4 text-left">
        <p className="text-sm text-yellow-300">
          ⚠️ Ensure you send on Ethereum to avoid loss of funds.
        </p>
      </div>
    </div>
  );

  const renderCardAmountStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount to Receive
        </label>
        <input
          type="number"
          value={receiveData.amount}
          onChange={(e) => setReceiveData({ ...receiveData, amount: e.target.value })}
          placeholder="0.00"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary text-center text-2xl font-bold"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Narration (optional)
        </label>
        <input
          type="text"
          value={receiveData.narration}
          onChange={(e) => setReceiveData({ ...receiveData, narration: e.target.value })}
          placeholder="Enter narration"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
        />
      </div>
    </div>
  );

  const renderCardWaitingStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <div className="text-3xl font-bold mb-4">{receiveData.amount} USDC</div>
        <div className="text-lg text-gray-300 mb-8">Waiting to Scan NFC Card...</div>
        <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <button
          onClick={() => setCurrentStep('card-pin')}
          className="text-primary text-sm font-medium"
        >
          Open Camera to Scan QR
        </button>
      </div>
    </div>
  );

  const renderCardPinStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <p className="text-sm text-gray-300 mb-4">
          Entering your PIN will authorise a transfer of {receiveData.amount} USDC to {receiveData.receiver}.
        </p>
        <div className="flex justify-center gap-3 mb-6">
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
      case 'options': return 'Receive USDC';
      case 'address': return 'Your Wallet Address';
      case 'card-amount': return 'Receive with Card';
      case 'card-waiting': return 'Receive with Card';
      case 'card-pin': return 'Enter PIN';
      default: return '';
    }
  };

  const canContinue = () => {
    switch (currentStep) {
      case 'card-amount': return receiveData.amount;
      case 'card-pin': return pin.length === 4;
      default: return true;
    }
  };

  const handleContinue = () => {
    if (currentStep === 'card-amount') {
      if (receiveData.amount) {
        setCurrentStep('card-waiting');
      }
    } else if (currentStep === 'card-pin') {
      if (pin.length === 4) {
        // Process receive
        console.log('Processing receive:', { ...receiveData, pin });
        navigate('/home');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {currentStep !== 'options' && (
          <button
            onClick={() => {
              if (currentStep === 'address') setCurrentStep('options');
              else if (currentStep === 'card-amount') setCurrentStep('options');
              else if (currentStep === 'card-waiting') setCurrentStep('card-amount');
              else if (currentStep === 'card-pin') setCurrentStep('card-waiting');
            }}
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
        {currentStep === 'options' && renderOptionsStep()}
        {currentStep === 'address' && renderAddressStep()}
        {currentStep === 'card-amount' && renderCardAmountStep()}
        {currentStep === 'card-waiting' && renderCardWaitingStep()}
        {currentStep === 'card-pin' && renderCardPinStep()}
      </div>

      {/* Continue Button */}
      {(currentStep === 'card-amount' || currentStep === 'card-pin') && (
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
      )}
    </div>
  );
};
