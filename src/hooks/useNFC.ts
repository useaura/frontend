import { useState, useEffect, useCallback } from 'react';

interface NFCData {
  type: 'text' | 'url' | 'wallet' | 'unknown';
  content: string;
  rawData?: any;
}

interface NFCStatus {
  isSupported: boolean;
  isScanning: boolean;
  status: 'idle' | 'scanning' | 'success' | 'error';
  statusMessage: string;
}

export const useNFC = () => {
  const [status, setStatus] = useState<NFCStatus>({
    isSupported: false,
    isScanning: false,
    status: 'idle',
    statusMessage: 'Checking NFC support...'
  });

  const [lastScannedData, setLastScannedData] = useState<NFCData | null>(null);
  const [scanHistory, setScanHistory] = useState<NFCData[]>([]);

  // Check NFC support on mount
  useEffect(() => {
    if ('NDEFReader' in window) {
      setStatus(prev => ({
        ...prev,
        isSupported: true,
        statusMessage: 'NFC is supported on this device'
      }));
    } else {
      setStatus(prev => ({
        ...prev,
        isSupported: false,
        statusMessage: 'NFC is not supported on this device'
      }));
    }
  }, []);

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
  const startScanning = useCallback(async (): Promise<void> => {
    if (!status.isSupported || status.isScanning) return;

    try {
      setStatus(prev => ({
        ...prev,
        isScanning: true,
        status: 'scanning',
        statusMessage: 'Hold your device near an NFC tag...'
      }));

      const ndef = new (window as any).NDEFReader();
      
      await ndef.scan();
      
      ndef.addEventListener('reading', (event: any) => {
        const nfcData = parseNFCData(event.message.records);
        
        setLastScannedData(nfcData);
        setScanHistory(prev => [nfcData, ...prev.slice(0, 19)]); // Keep last 20 scans
        
        setStatus(prev => ({
          ...prev,
          status: 'success',
          statusMessage: `NFC tag read successfully! Type: ${nfcData.type}`
        }));
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setStatus(prev => ({
            ...prev,
            status: 'idle',
            statusMessage: 'NFC is supported on this device'
          }));
        }, 3000);
      });

      ndef.addEventListener('readingerror', (error: any) => {
        console.error('NFC reading error:', error);
        setStatus(prev => ({
          ...prev,
          status: 'error',
          statusMessage: 'Failed to read NFC tag'
        }));
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setStatus(prev => ({
            ...prev,
            status: 'idle',
            statusMessage: 'NFC is supported on this device'
          }));
        }, 3000);
      });

    } catch (error) {
      console.error('Error starting NFC scan:', error);
      setStatus(prev => ({
        ...prev,
        status: 'error',
        statusMessage: error instanceof Error ? error.message : 'Unknown error'
      }));
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          status: 'idle',
          statusMessage: 'NFC is supported on this device'
        }));
      }, 3000);
    } finally {
      setStatus(prev => ({
        ...prev,
        isScanning: false
      }));
    }
  }, [status.isSupported, status.isScanning, parseNFCData]);

  // Write NFC data
  const writeNFC = useCallback(async (data: NFCData): Promise<void> => {
    if (!status.isSupported || !data.content) return;

    try {
      setStatus(prev => ({
        ...prev,
        isScanning: true,
        status: 'scanning',
        statusMessage: 'Hold your device near an NFC tag to write...'
      }));

      const ndef = new (window as any).NDEFReader();
      
      const records = [{
        recordType: data.type === 'url' ? 'url' : 'text',
        data: data.content,
        mediaType: data.type === 'url' ? 'text/uri-list' : 'text/plain'
      }];

      await ndef.write({ records });

      setStatus(prev => ({
        ...prev,
        status: 'success',
        statusMessage: 'Data written to NFC tag successfully!'
      }));
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          status: 'idle',
          statusMessage: 'NFC is supported on this device'
        }));
      }, 3000);

    } catch (error) {
      console.error('Error writing NFC:', error);
      setStatus(prev => ({
        ...prev,
        status: 'error',
        statusMessage: error instanceof Error ? error.message : 'Unknown error'
      }));
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          status: 'idle',
          statusMessage: 'NFC is supported on this device'
        }));
      }, 3000);
    } finally {
      setStatus(prev => ({
        ...prev,
        isScanning: false
      }));
    }
  }, [status.isSupported]);

  // Clear scan history
  const clearHistory = useCallback(() => {
    setScanHistory([]);
    setLastScannedData(null);
  }, []);

  // Validate wallet address
  const isValidWalletAddress = useCallback((address: string): boolean => {
    return address.startsWith('0x') && address.length === 42;
  }, []);

  return {
    // Status
    isSupported: status.isSupported,
    isScanning: status.isScanning,
    status: status.status,
    statusMessage: status.statusMessage,
    
    // Data
    lastScannedData,
    scanHistory,
    
    // Actions
    startScanning,
    writeNFC,
    clearHistory,
    isValidWalletAddress,
    
    // Utilities
    parseNFCData
  };
};
