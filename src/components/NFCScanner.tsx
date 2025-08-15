import React, { useState, useEffect, useCallback } from 'react';
import { WifiIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface NFCScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
  mode?: 'read' | 'write';
  writeData?: string;
  className?: string;
}

interface NFCMessage {
  records: Array<{
    recordType: string;
    data: string;
    mediaType?: string;
  }>;
}

export const NFCScanner: React.FC<NFCScannerProps> = ({
  onScan,
  onError,
  mode = 'read',
  writeData = '',
  className = ''
}) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

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

  // Read NFC data
  const readNFC = useCallback(async () => {
    if (!isSupported) return;

    try {
      setIsScanning(true);
      setStatus('scanning');
      setStatusMessage('Hold your device near an NFC tag...');

      const ndef = new (window as any).NDEFReader();
      
      await ndef.scan();
      
      ndef.addEventListener('reading', (event: any) => {
        const decoder = new TextDecoder();
        let data = '';
        
        for (const record of event.message.records) {
          if (record.recordType === 'text') {
            data = decoder.decode(record.data);
          } else if (record.recordType === 'url') {
            data = decoder.decode(record.data);
          } else {
            data = decoder.decode(record.data);
          }
        }
        
        setStatus('success');
        setStatusMessage('NFC tag read successfully!');
        onScan(data);
        
        setTimeout(() => {
          setStatus('idle');
          setStatusMessage('NFC is supported on this device');
        }, 2000);
      });

      ndef.addEventListener('readingerror', () => {
        setStatus('error');
        setStatusMessage('Failed to read NFC tag');
        onError?.('Failed to read NFC tag');
        
        setTimeout(() => {
          setStatus('idle');
          setStatusMessage('NFC is supported on this device');
        }, 3000);
      });

    } catch (error) {
      console.error('Error reading NFC:', error);
      setStatus('error');
      setStatusMessage('Error reading NFC tag');
      onError?.(error instanceof Error ? error.message : 'Unknown error');
      
      setTimeout(() => {
        setStatus('idle');
        setStatusMessage('NFC is supported on this device');
      }, 3000);
    } finally {
      setIsScanning(false);
    }
  }, [isSupported, onScan, onError]);

  // Write NFC data
  const writeNFC = useCallback(async () => {
    if (!isSupported || !writeData) return;

    try {
      setIsScanning(true);
      setStatus('scanning');
      setStatusMessage('Hold your device near an NFC tag to write...');

      const ndef = new (window as any).NDEFReader();
      
      await ndef.write({
        records: [
          {
            recordType: 'text',
            data: writeData,
            mediaType: 'text/plain'
          }
        ]
      });

      setStatus('success');
      setStatusMessage('Data written to NFC tag successfully!');
      
      setTimeout(() => {
        setStatus('idle');
        setStatusMessage('NFC is supported on this device');
      }, 2000);

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
      readNFC();
    }
  };

  // Get status icon and colors
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

      {/* Scan Button */}
      <button
        onClick={handleScanClick}
        disabled={isScanning}
        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
          isScanning
            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        }`}
      >
        {isScanning ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {mode === 'write' ? 'Writing...' : 'Scanning...'}
          </>
        ) : (
          <>
            <WifiIcon className="w-5 h-5" />
            {mode === 'write' ? 'Write to NFC Tag' : 'Scan NFC Tag'}
          </>
        )}
      </button>

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
