# NFC Implementation Guide

This document outlines the NFC (Near Field Communication) implementation in the AuraPay frontend application.

## Overview

The NFC implementation provides the ability to read and write NFC tags, with special support for wallet addresses, URLs, and text data. It's designed to work with the Web NFC API and provides a seamless user experience for contactless data transfer.

## Components

### 1. NFCScanner (`src/components/NFCScanner.tsx`)
A basic NFC component that provides simple read/write functionality.

**Features:**
- Read NFC tags
- Write data to NFC tags
- Status indicators
- Error handling
- Device compatibility checking

**Props:**
```typescript
interface NFCScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
  mode?: 'read' | 'write';
  writeData?: string;
  className?: string;
}
```

### 2. NFCAdvanced (`src/components/NFCAdvanced.tsx`)
An advanced NFC component with enhanced features.

**Features:**
- Advanced data parsing
- Scan history
- Data type detection (wallet, URL, text)
- Auto-scan capability
- Better error handling
- Visual data type indicators

**Props:**
```typescript
interface NFCAdvancedProps {
  onScan: (data: NFCData) => void;
  onError?: (error: string) => void;
  mode?: 'read' | 'write';
  writeData?: NFCData;
  className?: string;
  autoScan?: boolean;
}
```

### 3. NFC Page (`src/pages/NFC/NFC.tsx`)
A dedicated page for NFC operations with three modes:
- **Read Mode**: Scan and read NFC tags
- **Write Mode**: Write data to NFC tags
- **History Mode**: View scan history with actions

## Custom Hook

### useNFC (`src/hooks/useNFC.ts`)
A custom React hook that provides NFC functionality with state management.

**Features:**
- NFC support detection
- Scanning state management
- Data parsing utilities
- Scan history management
- Wallet address validation

**Usage:**
```typescript
const {
  isSupported,
  isScanning,
  status,
  statusMessage,
  lastScannedData,
  scanHistory,
  startScanning,
  writeNFC,
  clearHistory,
  isValidWalletAddress
} = useNFC();
```

## Integration Points

### 1. Receive Page
- Added NFC scanning option in the receive flow
- Can scan NFC tags to get wallet addresses
- Integrates with existing card-based receive flow

### 2. Withdraw Page
- NFC scanner button next to address input
- Modal-based NFC scanning
- Auto-fills receiver address from scanned data

### 3. Home Page
- New NFC button for quick access to NFC functionality
- Integrates with existing navigation system

## Data Types Supported

### 1. Wallet Address
- Format: `0x` followed by 40 hexadecimal characters
- Example: `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6`
- Automatically detected and categorized

### 2. URL
- Standard web URLs
- Example: `https://example.com`
- Opens in browser when clicked

### 3. Text
- Plain text content
- Can be any string data
- Copied to clipboard

### 4. Unknown
- Fallback for unrecognized data formats
- Raw data display

## Browser Compatibility

The implementation uses the Web NFC API, which is currently supported in:
- Chrome for Android (version 89+)
- Edge for Android (version 89+)
- Samsung Internet (version 15+)

**Note:** Desktop browsers and iOS Safari do not support Web NFC API.

## Security Considerations

1. **HTTPS Required**: Web NFC API only works over HTTPS
2. **User Permission**: Requires explicit user consent for NFC operations
3. **Data Validation**: All scanned data is validated before processing
4. **Error Handling**: Comprehensive error handling for failed operations

## Usage Examples

### Basic NFC Scanning
```typescript
import { NFCScanner } from '../components/NFCScanner';

<NFCScanner
  onScan={(data) => console.log('Scanned:', data)}
  onError={(error) => console.error('Error:', error)}
/>
```

### Advanced NFC with Data Parsing
```typescript
import { NFCAdvanced } from '../components/NFCAdvanced';

<NFCAdvanced
  onScan={(nfcData) => {
    if (nfcData.type === 'wallet') {
      // Handle wallet address
      setWalletAddress(nfcData.content);
    }
  }}
  mode="read"
  autoScan={true}
/>
```

### Using the Custom Hook
```typescript
import { useNFC } from '../hooks/useNFC';

const MyComponent = () => {
  const { startScanning, isScanning, lastScannedData } = useNFC();

  const handleScan = () => {
    startScanning();
  };

  return (
    <div>
      <button onClick={handleScan} disabled={isScanning}>
        {isScanning ? 'Scanning...' : 'Start NFC Scan'}
      </button>
      {lastScannedData && (
        <p>Last scan: {lastScannedData.content}</p>
      )}
    </div>
  );
};
```

## Error Handling

The implementation includes comprehensive error handling for:
- Unsupported devices
- Permission denied
- Network errors
- Invalid data formats
- Hardware failures

## Future Enhancements

1. **QR Code Integration**: Combine NFC with QR code scanning
2. **Data Encryption**: Support for encrypted NFC data
3. **Batch Operations**: Multiple tag scanning
4. **Offline Support**: Cache scanned data for offline use
5. **Analytics**: Track NFC usage patterns

## Troubleshooting

### Common Issues

1. **"NFC Not Supported"**
   - Ensure device has NFC hardware
   - Check browser compatibility
   - Verify HTTPS connection

2. **"Permission Denied"**
   - Grant NFC permission in browser
   - Check device NFC settings
   - Restart browser

3. **"Scan Failed"**
   - Ensure NFC is enabled on device
   - Check tag compatibility
   - Verify tag positioning

### Debug Mode

Enable console logging for debugging:
```typescript
// Add to component
useEffect(() => {
  console.log('NFC Status:', { isSupported, isScanning, status });
}, [isSupported, isScanning, status]);
```

## Contributing

When extending NFC functionality:
1. Follow existing component patterns
2. Add proper TypeScript types
3. Include error handling
4. Test on multiple devices
5. Update this documentation

## Resources

- [Web NFC API Specification](https://w3c.github.io/web-nfc/)
- [Chrome NFC Documentation](https://developer.chrome.com/docs/capabilities/web-apis/web-nfc/)
- [NFC Forum Standards](https://nfc-forum.org/our-work/specifications-and-application-documents/)
