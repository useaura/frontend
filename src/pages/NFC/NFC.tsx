import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, WifiIcon, DocumentTextIcon, LinkIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { NFCAdvanced } from '../../components/NFCAdvanced';

interface NFCData {
  type: 'text' | 'url' | 'wallet' | 'unknown';
  content: string;
  rawData?: any;
}

type NFCMode = 'read' | 'write' | 'history';

export const NFC = () => {
  const [currentMode, setCurrentMode] = useState<NFCMode>('read');
  const [writeData, setWriteData] = useState<NFCData>({
    type: 'text',
    content: ''
  });
  const [scanHistory, setScanHistory] = useState<NFCData[]>([]);
  const navigate = useNavigate();

  const handleScan = (data: NFCData) => {
    setScanHistory(prev => [data, ...prev.slice(0, 19)]); // Keep last 20 scans
  };

  const handleError = (error: string) => {
    console.error('NFC Error:', error);
    // You could add toast notifications here
  };

  const handleWriteDataChange = (field: keyof NFCData, value: string) => {
    setWriteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderReadMode = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2 text-text-primary">Scan NFC Tags</h2>
        <p className="text-text-secondary">Hold your device near an NFC tag to read its data</p>
      </div>
      
      <NFCAdvanced
        onScan={handleScan}
        onError={handleError}
        mode="read"
        autoScan={false}
      />
    </div>
  );

  const renderWriteMode = () => (
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
        onScan={handleScan}
        onError={handleError}
        mode="write"
        writeData={writeData.content ? writeData : undefined}
      />
    </div>
  );

  const renderHistoryMode = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2 text-text-primary">Scan History</h2>
        <p className="text-text-secondary">View your recent NFC scans</p>
      </div>

      {scanHistory.length === 0 ? (
        <div className="text-center py-12">
          <WifiIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-text-secondary">No scans yet</p>
          <p className="text-sm text-text-tertiary">Start scanning NFC tags to see them here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scanHistory.map((data, index) => (
            <div key={index} className="p-4 bg-surface border border-border/20 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                {data.type === 'wallet' && <CreditCardIcon className="w-5 h-5 text-blue-500" />}
                {data.type === 'url' && <LinkIcon className="w-5 h-5 text-green-500" />}
                {data.type === 'text' && <DocumentTextIcon className="w-5 h-5 text-purple-500" />}
                <span className="text-sm font-medium text-text-secondary capitalize">{data.type}</span>
                <span className="text-xs text-text-tertiary ml-auto">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <p className="text-text-primary break-all">{data.content}</p>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigator.clipboard.writeText(data.content)}
                  className="px-3 py-1 text-xs bg-surface-secondary border border-border/20 rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
                >
                  Copy
                </button>
                {data.type === 'wallet' && (
                  <button
                    onClick={() => navigate('/withdraw', { state: { receiverAddress: data.content } })}
                    className="px-3 py-1 text-xs bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-500 hover:bg-blue-500/20 transition-colors"
                  >
                    Send To
                  </button>
                )}
                {data.type === 'url' && (
                  <button
                    onClick={() => window.open(data.content, '_blank')}
                    className="px-3 py-1 text-xs bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 hover:bg-green-500/20 transition-colors"
                  >
                    Open Link
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const getModeTitle = () => {
    switch (currentMode) {
      case 'read': return 'NFC Scanner';
      case 'write': return 'NFC Writer';
      case 'history': return 'Scan History';
      default: return 'NFC';
    }
  };

  const getModeIcon = () => {
    switch (currentMode) {
      case 'read': return <WifiIcon className="w-5 h-5" />;
      case 'write': return <DocumentTextIcon className="w-5 h-5" />;
      case 'history': return <CreditCardIcon className="w-5 h-5" />;
      default: return <WifiIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/20">
        <button onClick={() => navigate('/home')} className="p-2">
          <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">{getModeTitle()}</h1>
        <button
          onClick={() => navigate('/nfc/demo')}
          className="px-3 py-1 text-sm bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-500 hover:bg-blue-500/20 transition-colors"
        >
          Demo
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex border-b border-border/20">
        {(['read', 'write', 'history'] as NFCMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setCurrentMode(mode)}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
              currentMode === mode
                ? 'text-text-primary border-b-2 border-blue-500'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {getModeIcon()}
            <span className="capitalize">{mode}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {currentMode === 'read' && renderReadMode()}
        {currentMode === 'write' && renderWriteMode()}
        {currentMode === 'history' && renderHistoryMode()}
      </div>
    </div>
  );
};
