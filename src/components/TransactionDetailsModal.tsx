import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  ArrowDownIcon, 
  ArrowUpIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export interface TransactionDetails {
  id: string;
  type: 'sent' | 'received';
  counterparty: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  narration?: string;
  transactionHash?: string;
  fee?: string;
  timestamp?: string;
  network?: string;
  confirmations?: number;
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionDetails | null;
}

export const TransactionDetailsModal = ({ isOpen, onClose, transaction }: TransactionDetailsModalProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!transaction) return null;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          border: 'border-green-500/20',
          dot: 'bg-green-400',
        };
      case 'pending':
        return {
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-400',
          border: 'border-yellow-500/20',
          dot: 'bg-yellow-400',
        };
      case 'failed':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/20',
          dot: 'bg-red-400',
        };
      default:
        return {
          bg: 'bg-surface-secondary',
          text: 'text-text-secondary',
          border: 'border-border/20',
          dot: 'bg-text-secondary',
        };
    }
  };

  const statusColors = getStatusColor(transaction.status);
  const isReceived = transaction.type === 'received';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const CopyButton = ({ text, field, label }: { text: string; field: string; label: string }) => (
    <motion.button
      onClick={() => copyToClipboard(text, field)}
      className="flex items-center gap-2 text-text-primary hover:text-text-secondary transition-colors p-2 hover:bg-surface-secondary rounded-lg"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {copiedField === field ? (
        <CheckIcon className="w-4 h-4 text-green-400" />
      ) : (
        <ClipboardDocumentIcon className="w-4 h-4" />
      )}
      <span className="text-sm">
        {copiedField === field ? 'Copied!' : `Copy ${label}`}
      </span>
    </motion.button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface border border-border/20 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/20">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isReceived ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                  {isReceived ? (
                    <ArrowDownIcon className={`w-6 h-6 ${isReceived ? 'text-green-400' : 'text-red-400'}`} />
                  ) : (
                    <ArrowUpIcon className={`w-6 h-6 ${isReceived ? 'text-green-400' : 'text-red-400'}`} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">
                    {isReceived ? 'Received' : 'Sent'}
                  </h2>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full ${statusColors.bg} ${statusColors.text} ${statusColors.border} mt-1`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`}></span>
                    <span className="capitalize text-xs font-medium">{transaction.status}</span>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-surface-secondary rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <XMarkIcon className="w-6 h-6 text-text-secondary" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Amount */}
              <motion.div
                className="text-center py-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className={`text-4xl font-bold mb-2 ${
                  isReceived ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.amount} USDC
                </div>
                {transaction.fee && (
                  <div className="text-sm text-text-secondary">
                    Network fee: {transaction.fee}
                  </div>
                )}
              </motion.div>

              {/* Transaction Details */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Counterparty */}
                <div className="flex justify-between items-center py-3 border-b border-border/10">
                  <span className="text-text-secondary">{isReceived ? 'From' : 'To'}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary font-medium">{transaction.counterparty}</span>
                    <CopyButton text={transaction.counterparty} field="counterparty" label="Address" />
                  </div>
                </div>

                {/* Date */}
                <div className="flex justify-between items-center py-3 border-b border-border/10">
                  <span className="text-text-secondary">Date</span>
                  <span className="text-text-primary">{formatDate(transaction.date)}</span>
                </div>

                {/* Transaction ID */}
                <div className="flex justify-between items-center py-3 border-b border-border/10">
                  <span className="text-text-secondary">Transaction ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary font-mono text-sm">
                      {transaction.id}
                    </span>
                    <CopyButton text={transaction.id} field="id" label="ID" />
                  </div>
                </div>

                {/* Transaction Hash */}
                {transaction.transactionHash && (
                  <div className="flex justify-between items-center py-3 border-b border-border/10">
                    <span className="text-text-secondary">Hash</span>
                    <div className="flex items-center gap-2">
                      <span className="text-text-primary font-mono text-sm">
                        {transaction.transactionHash.slice(0, 8)}...{transaction.transactionHash.slice(-8)}
                      </span>
                      <CopyButton text={transaction.transactionHash} field="hash" label="Hash" />
                    </div>
                  </div>
                )}

                {/* Network */}
                {transaction.network && (
                  <div className="flex justify-between items-center py-3 border-b border-border/10">
                    <span className="text-text-secondary">Network</span>
                    <span className="text-text-primary">{transaction.network}</span>
                  </div>
                )}

                {/* Confirmations */}
                {transaction.confirmations !== undefined && (
                  <div className="flex justify-between items-center py-3 border-b border-border/10">
                    <span className="text-text-secondary">Confirmations</span>
                    <span className="text-text-primary">{transaction.confirmations}/12</span>
                  </div>
                )}

                {/* Narration */}
                {transaction.narration && (
                  <div className="py-3">
                    <span className="text-text-secondary block mb-2">Note</span>
                    <div className="bg-surface-secondary border border-border/20 rounded-xl p-4">
                      <span className="text-text-primary">{transaction.narration}</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Actions */}
              <motion.div
                className="flex gap-3 pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  className="flex-1 bg-text-primary text-background py-3 px-4 rounded-xl font-medium hover:bg-text-secondary transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // In a real app, this would open the transaction in a blockchain explorer
                    window.open(`https://etherscan.io/tx/${transaction.transactionHash || transaction.id}`, '_blank');
                  }}
                >
                  View on Explorer
                </motion.button>
                <motion.button
                  className="flex-1 bg-surface-secondary border border-border/20 text-text-primary py-3 px-4 rounded-xl font-medium hover:bg-surface-tertiary transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                >
                  Close
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
