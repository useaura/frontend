import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, WifiIcon, DocumentTextIcon, LinkIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { NFCScanner } from '../../components/NFCScanner';
import { NFCAdvanced } from '../../components/NFCAdvanced';
import { useNFC } from '../../hooks/useNFC';

interface NFCData {
  type: 'text' | 'url' | 'wallet' | 'unknown';
  content: string;
  rawData?: any;
}

export const NFCDemo = () => {
  const [demoMode, setDemoMode] = useState<'basic' | 'advanced' | 'hook'>('basic');
  const [writeData, setWriteData] = useState<NFCData>({
    type: 'text',
    content: ''
  });
  const navigate = useNavigate();

  // Using the custom hook
  const {
    isSupported: hookSupported,
    isScanning: hookScanning,
    status: hookStatus,
    statusMessage: hookStatusMessage,
    lastScannedData: hookLastData,
    scanHistory: hookScanHistory,
    startScanning: hookStartScanning,
    writeNFC: hookWriteNFC,
    clearHistory: hookClearHistory,
    isValidWalletAddress
  } = useNFC();

  const handleBasicScan = (data: string) => {
    console.log('Basic NFC Scan:', data);
    alert(`Basic NFC Scan Result: ${data}`);
  };

  const handleAdvancedScan = (data: NFCData) => {
    console.log('Advanced NFC Scan:', data);
    alert(`Advanced NFC Scan Result:\nType: ${data.type}\nContent: ${data.content}`);
  };

  const handleHookScan = () => {
    if (hookScanning) return;
    hookStartScanning();
  };

  const handleWriteDataChange = (field: keyof NFCData, value: string) => {
    setWriteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderBasicDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2 text-text-primary">Basic NFC Scanner</h2>
        <p className="text-text-secondary">Simple NFC reading and writing functionality</p>
      </div>
      
      <NFCScanner
        onScan={handleBasicScan}
        onError={(error) => alert(`NFC Error: ${error}`)}
        mode="read"
      />
    </div>
  );

  const renderAdvancedDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2 text-text-primary">Advanced NFC Scanner</h2>
        <p className="text-text-secondary">Enhanced NFC functionality with data parsing and history</p>
      </div>
      
      <NFCAdvanced
        onScan={handleAdvancedScan}
        onError={(error) => alert(`NFC Error: ${error}`)}
        mode="read"
        autoScan={false}
      />
    </div>
  );

  const renderHookDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2 text-text-primary">Custom Hook Demo</h2>
        <p className="text-text-secondary">Using the useNFC custom hook for NFC operations</p>
      </div>

      {/* Status Display */}
      <div className="p-4 bg-surface border border-border/20 rounded-xl">
        <h3 className="font-semibold mb-3 text-text-primary">NFC Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Supported:</span>
            <span className={hookSupported ? 'text-green-500' : 'text-red-500'}>
              {hookSupported ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Status:</span>
            <span className={`capitalize ${
              hookStatus === 'success' ? 'text-green-500' : 
              hookStatus === 'error' ? 'text-red-500' : 
              hookStatus === 'scanning' ? 'text-blue-500' : 'text-text-secondary'
            }`}>
              {hookStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Message:</span>
            <span className="text-text-primary">{hookStatusMessage}</span>
          </div>
        </div>
      </div>

      {/* Scan Controls */}
      <div className="space-y-4">
        <button
          onClick={handleHookScan}
          disabled={!hookSupported || hookScanning}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
            hookScanning
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
              : !hookSupported
              ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {hookScanning ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <WifiIcon className="w-5 h-5" />
              Start NFC Scan
            </>
          )}
        </button>

        <button
          onClick={hookClearHistory}
          disabled={hookScanHistory.length === 0}
          className="w-full py-3 px-6 rounded-xl font-medium bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Scan History
        </button>
      </div>

      {/* Last Scanned Data */}
      {hookLastData && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            {hookLastData.type === 'wallet' && <CreditCardIcon className="w-5 h-5 text-blue-500" />}
            {hookLastData.type === 'url' && <LinkIcon className="w-5 h-5 text-green-500" />}
            {hookLastData.type === 'text' && <DocumentTextIcon className="w-5 h-5 text-purple-500" />}
            <span className="text-green-500 font-medium capitalize">Last Scan: {hookLastData.type}</span>
          </div>
          <p className="text-green-600 text-sm break-all">{hookLastData.content}</p>
        </div>
      )}

      {/* Scan History */}
      {hookScanHistory.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">Scan History ({hookScanHistory.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {hookScanHistory.map((data, index) => (
              <div key={index} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  {data.type === 'wallet' && <CreditCardIcon className="w-4 h-4 text-blue-500" />}
                  {data.type === 'url' && <LinkIcon className="w-4 h-4 text-green-500" />}
                  {data.type === 'text' && <DocumentTextIcon className="w-4 h-4 text-purple-500" />}
                  <span className="text-xs font-medium text-gray-600 capitalize">{data.type}</span>
                  <span className="text-xs text-gray-500 ml-auto">#{index + 1}</span>
                </div>
                <p className="text-xs text-gray-800 dark:text-gray-200 break-all">{data.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderWriteDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2 text-text-primary">Write to NFC Tags</h2>
        <p className="text-text-secondary">Write data to NFC tags for easy sharing</p>
      </div>

      {/* Write Data Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Data Type
          </label>
          <select
            value={writeData.type}
            onChange={(e) => handleWriteDataChange('type', e.target.value as NFCData['type'])}
            className="w-full bg-surface border border-border/20 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-border/60"
          >
            <option value="text">Text</option>
            <option value="url">URL</option>
            <option value="wallet">Wallet Address</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Content
          </label>
          <input
            type="text"
            value={writeData.content}
            onChange={(e) => handleWriteDataChange('content', e.target.value)}
            placeholder={
              writeData.type === 'url' ? 'https://example.com' :
              writeData.type === 'wallet' ? '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' :
              'Enter text content'
            }
            className="w-full bg-surface border border-border/20 rounded-xl px-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border/60"
          />
        </div>

        {/* Data Preview */}
        {writeData.content && (
          <div className="p-4 bg-surface-secondary border border-border/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              {writeData.type === 'wallet' && <CreditCardIcon className="w-4 h-4 text-blue-500" />}
              {writeData.type === 'url' && <LinkIcon className="w-4 h-4 text-green-500" />}
              {writeData.type === 'text' && <DocumentTextIcon className="w-4 h-4 text-purple-500" />}
              <span className="text-sm font-medium text-text-secondary capitalize">{writeData.type} Preview</span>
            </div>
            <p className="text-sm text-text-primary break-all">{writeData.content}</p>
          </div>
        )}
      </div>

      <NFCAdvanced
        onScan={handleAdvancedScan}
        onError={(error) => alert(`NFC Error: ${error}`)}
        mode="write"
        writeData={writeData.content ? writeData : undefined}
      />
    </div>
  );

  const getDemoTitle = () => {
    switch (demoMode) {
      case 'basic': return 'Basic NFC Demo';
      case 'advanced': return 'Advanced NFC Demo';
      case 'hook': return 'Custom Hook Demo';
      case 'write': return 'NFC Writer Demo';
      default: return 'NFC Demo';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/20">
        <button onClick={() => navigate('/nfc')} className="p-2">
          <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">{getDemoTitle()}</h1>
        <div className="w-10" />
      </div>

      {/* Mode Selector */}
      <div className="flex border-b border-border/20">
        {(['basic', 'advanced', 'hook', 'write'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setDemoMode(mode)}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
              demoMode === mode
                ? 'text-text-primary border-b-2 border-blue-500'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {mode === 'basic' && <WifiIcon className="w-5 h-5" />}
            {mode === 'advanced' && <DocumentTextIcon className="w-5 h-5" />}
            {mode === 'hook' && <CreditCardIcon className="w-5 h-5" />}
            {mode === 'write' && <LinkIcon className="w-5 h-5" />}
            <span className="capitalize">{mode}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {demoMode === 'basic' && renderBasicDemo()}
        {demoMode === 'advanced' && renderAdvancedDemo()}
        {demoMode === 'hook' && renderHookDemo()}
        {demoMode === 'write' && renderWriteDemo()}
      </div>
    </div>
  );
};
