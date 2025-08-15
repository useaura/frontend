import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  WifiIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  DocumentTextIcon,
  LinkIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

interface NFCData {
  type: 'text' | 'url' | 'wallet' | 'unknown';
  content: string;
  rawData?: any;
}

interface NFCAdvancedProps {
  onScan: (data: NFCData) => void;
  onError?: (error: string) => void;
  mode?: 'read' | 'write';
  writeData?: NFCData;
  className?: string;
  autoScan?: boolean;
}

export const NFCAdvanced: React.FC<NFCAdvancedProps> = ({
  onScan,
  onError,
  mode = 'read',
  writeData,
  className = '',
  autoScan = false
}) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [lastScannedData, setLastScannedData] = useState<NFCData | null>(null);
  const [scanHistory, setScanHistory] = useState<NFCData[]>([]);
  const ndefRef = useRef<any>(null);

  // Check if NFC is supported
  useEffect(() => {
    if ('NDEFReader' in window) {
      setIsSupported(true);
      setStatusMessage('NFC is supported on this device');
    } else {
      setIsSupported(false);
      setStatusMessage('NFC is not supported on this device');
      onError?.('NFC is not supported on this device');
    }
  }, [onError]);

  // Auto-scan functionality
  useEffect(() => {
    if (autoScan && isSupported && mode === 'read') {
      startScanning();
    }
  }, [autoScan, isSupported, mode]);

  // Parse NFC data
  const parseNFCData = useCallback((records: any[]): NFCData => {
    try {
      for (const record of records) {
        const decoder = new TextDecoder();
        let content = '';
        
        if (record.recordType === 'text') {
          content = decoder.decode(record.data);
          // Check if it's a wallet address
          if (content.startsWith('0x') && content.length === 42) {
            return { type: 'wallet', content, rawData: record };
          }
          return { type: 'text', content, rawData: record };
        } else if (record.recordType === 'url') {
          content = decoder.decode(record.data);
          return { type: 'url', content, rawData: record };
        } else {
          content = decoder.decode(record.data);
          return { type: 'unknown', content, rawData: record };
        }
      }
      return { type: 'unknown', content: 'Unknown data format', rawData: records };
    } catch (error) {
      console.error('Error parsing NFC data:', error);
      return { type: 'unknown', content: 'Error parsing data', rawData: records };
    }
  }, []);

  // Start scanning
  const startScanning = useCallback(async () => {
    if (!isSupported || isScanning) return;

    try {
      setIsScanning(true);
      setStatus('scanning');
      setStatusMessage('Hold your device near an NFC tag...');

      ndefRef.current = new (window as any).NDEFReader();
      
      await ndefRef.current.scan();
      
      ndefRef.current.addEventListener('reading', (event: any) => {
        const nfcData = parseNFCData(event.message.records);
        
        setLastScannedData(nfcData);
        setScanHistory(prev => [nfcData, ...prev.slice(0, 9)]); // Keep last 10 scans
        setStatus('success');
        setStatusMessage(`NFC tag read successfully! Type: ${nfcData.type}`);
        
        onScan(nfcData);
        
        setTimeout(() => {
          setStatus('idle');
          setStatusMessage('NFC is supported on this device');
        }, 3000);
      });

      ndefRef.current.addEventListener('readingerror', (error: any) => {
        console.error('NFC reading error:', error);
        setStatus('error');
        setStatusMessage('Failed to read NFC tag');
        onError?.('Failed to read NFC tag');
        
        setTimeout(() => {
          setStatus('idle');
          setStatusMessage('NFC is supported on this device');
        }, 3000);
      });

    } catch (error) {
      console.error('Error starting NFC scan:', error);
      setStatus('error');
      setStatusMessage('Error starting NFC scan');
      onError?.(error instanceof Error ? error.message : 'Unknown error');
      
      setTimeout(() => {
        setStatus('idle');
        setStatusMessage('NFC is supported on this device');
      }, 3000);
    } finally {
      setIsScanning(false);
    }
  }, [isSupported, isScanning, parseNFCData, onScan, onError]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    if (ndefRef.current) {
      try {
        ndefRef.current.removeEventListener('reading', () => {});
        ndefRef.current.removeEventListener('readingerror', () => {});
        ndefRef.current = null;
      } catch (error) {
        console.error('Error stopping NFC scan:', error);
      }
    }
    setIsScanning(false);
    setStatus('idle');
    setStatusMessage('NFC is supported on this device');
  }, []);

  // Write NFC data
  const writeNFC = useCallback(async () => {
    if (!isSupported || !writeData) return;

    try {
      setIsScanning(true);
      setStatus('scanning');
      setStatusMessage('Hold your device near an NFC tag to write...');

      const ndef = new (window as any).NDEFReader();
      
      const records = [{
        recordType: writeData.type === 'url' ? 'url' : 'text',
        data: writeData.content,
        mediaType: writeData.type === 'url' ? 'text/uri-list' : 'text/plain'
      }];

      await ndef.write({ records });

      setStatus('success');
      setStatusMessage('Data written to NFC tag successfully!');
      
      setTimeout(() => {
        setStatus('idle');
        setStatusMessage('NFC is supported on this device');
      }, 3000);

    } catch (error) {
      console.error('Error writing NFC:', error);
      setStatus('error');
      setStatusMessage('Error writing to NFC tag');
      onError?.(error instanceof Error ? error.message : 'Unknown error');
      
      setTimeout(() => {
        setStatus('idle');
        setStatusMessage('NFC is supported on this device');
      }, 3000);
    } finally {
      setIsScanning(false);
    }
  }, [isSupported, writeData, onError]);

  // Handle scan button click
  const handleScanClick = () => {
    if (mode === 'write') {
      writeNFC();
    } else {
      if (isScanning) {
        stopScanning();
      } else {
        startScanning();
      }
    }
  };

  // Get status display
  const getStatusDisplay = () => {
    switch (status) {
      case 'scanning':
        return {
          icon: <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />,
          textColor: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        };
      case 'success':
        return {
          icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
          textColor: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        };
      case 'error':
        return {
          icon: <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />,
          textColor: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20'
        };
      default:
        return {
          icon: <WifiIcon className="w-6 h-6 text-gray-400" />,
          textColor: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20'
        };
    }
  };

  // Get data type icon
  const getDataTypeIcon = (type: string) => {
    switch (type) {
      case 'wallet':
        return <CreditCardIcon className="w-4 h-4" />;
      case 'url':
        return <LinkIcon className="w-4 h-4" />;
      case 'text':
        return <DocumentTextIcon className="w-4 h-4" />;
      default:
        return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  const statusDisplay = getStatusDisplay();

  if (!isSupported) {
    return (
      <div className={`p-4 bg-red-500/10 border border-red-500/20 rounded-xl ${className}`}>
        <div className="flex items-center gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-red-500 font-medium">NFC Not Supported</p>
            <p className="text-red-400 text-sm">This device doesn't support NFC scanning</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Status Display */}
      <div className={`p-4 ${statusDisplay.bgColor} border ${statusDisplay.borderColor} rounded-xl`}>
        <div className="flex items-center gap-3">
          {statusDisplay.icon}
          <div>
            <p className={`${statusDisplay.textColor} font-medium`}>
              {status === 'scanning' ? 'Scanning...' : 'NFC Status'}
            </p>
            <p className={`${statusDisplay.textColor} text-sm opacity-80`}>
              {statusMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Last Scanned Data */}
      {lastScannedData && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            {getDataTypeIcon(lastScannedData.type)}
            <span className="text-green-500 font-medium capitalize">{lastScannedData.type} Data</span>
          </div>
          <p className="text-green-600 text-sm break-all">{lastScannedData.content}</p>
        </div>
      )}

      {/* Scan Button */}
      <button
        onClick={handleScanClick}
        disabled={mode === 'write' && !writeData}
        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
          isScanning
            ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
            : mode === 'write' && !writeData
            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        }`}
      >
        {isScanning ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {mode === 'write' ? 'Writing...' : 'Stop Scanning'}
          </>
        ) : (
          <>
            <WifiIcon className="w-5 h-5" />
            {mode === 'write' ? 'Write to NFC Tag' : 'Start NFC Scan'}
          </>
        )}
      </button>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">Recent Scans</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {scanHistory.map((data, index) => (
              <div key={index} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  {getDataTypeIcon(data.type)}
                  <span className="text-xs font-medium text-gray-600 capitalize">{data.type}</span>
                </div>
                <p className="text-xs text-gray-800 dark:text-gray-200 break-all">{data.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>
          {mode === 'write' 
            ? 'Hold your device near an NFC tag to write data'
            : 'Hold your device near an NFC tag to read data'
          }
        </p>
        <p className="text-xs">
          Make sure NFC is enabled in your device settings
        </p>
      </div>
    </div>
  );
};
