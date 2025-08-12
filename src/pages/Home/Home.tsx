import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cog6ToothIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { Modal } from '../../components/Modal';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
};

const balanceVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200,
      delay: 0.2,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 400,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const transactionItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 400,
    },
  },
};

export const Home = () => {
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync panic mode from Settings page
  useEffect(() => {
    if (location.state?.panicMode !== undefined) {
      setIsPanicMode(location.state.panicMode);
    }
  }, [location.state]);

  const handleReceive = () => {
    if (!isPanicMode) {
      navigate('/receive');
    } else {
      setShowErrorModal(true);
    }
  };

  const handleWithdraw = () => {
    if (!isPanicMode) {
      navigate('/withdraw');
    } else {
      setShowErrorModal(true);
    }
  };

  const handleSettings = () => {
    navigate('/settings', { state: { panicMode: isPanicMode } });
  };

  const handleTransactions = () => {
    navigate('/transactions');
  };

  type Tx = {
    id: string;
    direction: 'credit' | 'debit';
    counterparty: string;
    amount: string;
    status: 'completed' | 'pending' | 'failed';
    label: string;
  };

  const recentTransactions: Tx[] = [
    { id: '1', direction: 'credit', counterparty: 'Alice', amount: '+50 USDC', status: 'completed', label: 'Received' },
    { id: '2', direction: 'debit', counterparty: 'Bob', amount: '-20 USDC', status: 'pending', label: 'Sent' },
  ];

  const computeClasses = (status: Tx['status'], direction: Tx['direction']) => {
    // Pending always yellow
    if (status === 'pending') {
      return {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/20',
        dot: 'bg-yellow-400',
        amount: 'text-yellow-400',
        stripe: 'border-l-yellow-500',
      };
    }

    // Failed always red
    if (status === 'failed') {
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/20',
        dot: 'bg-red-400',
        amount: 'text-red-400',
        stripe: 'border-l-red-500',
      };
    }

    // Completed: green for credit, red for debit
    if (direction === 'credit') {
      return {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/20',
        dot: 'bg-green-400',
        amount: 'text-green-400',
        stripe: 'border-l-green-500',
      };
    }

    return {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
      dot: 'bg-red-400',
      amount: 'text-red-400',
      stripe: 'border-l-red-500',
    };
  };

  return (
    <>
      {/* Mobile Restriction Warning */}
      <div className="app-route">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Mobile Only</h2>
          <p className="text-lg mb-6">This app is designed for mobile devices only.</p>
          <p className="text-sm text-text-secondary">Please open this app on your mobile device for the best experience.</p>
        </div>
      </div>

      {/* App Content */}
      <motion.div
        className="app-content min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="px-6 py-8">
          <motion.div
            className="flex items-center justify-between mb-8"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-lg font-medium text-text-primary">Hi, User</h1>
            </div>
            <motion.button 
              onClick={handleSettings}
              className="w-12 h-12 bg-surface border border-border rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-300 hover:border-border/60"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Cog6ToothIcon className="w-6 h-6 text-text-primary" />
            </motion.button>
          </motion.div>

          {/* Panic Mode Banner */}
          {isPanicMode && (
            <motion.div
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-sm font-medium">
                  Panic Mode Active – Disable in Settings to resume activity.
                </span>
              </div>
            </motion.div>
          )}

          {/* Balance Display */}
          <motion.div
            className="text-center mb-8"
            variants={balanceVariants}
          >
            <div className="mb-2">
              <span className="text-sm text-text-secondary">Available Balance</span>
            </div>
            <div className="text-4xl font-bold text-text-primary mb-1">
              {isPanicMode ? 'Insufficient funds' : '1,234.56 USDC'}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            variants={containerVariants}
          >
            <motion.button
              onClick={handleReceive}
              disabled={isPanicMode}
              className={`p-6 rounded-xl transition-all duration-300 ${
                isPanicMode
                  ? 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
                  : 'bg-surface border border-border text-text-primary shadow-sm hover:shadow-md'
              }`}
              variants={buttonVariants}
              whileHover={!isPanicMode ? "hover" : undefined}
              whileTap={!isPanicMode ? "tap" : undefined}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isPanicMode ? 'bg-surface-tertiary' : 'bg-surface-secondary'
                }`}>
                  <ArrowDownIcon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">Receive</span>
              </div>
            </motion.button>

            <motion.button
              onClick={handleWithdraw}
              disabled={isPanicMode}
              className={`p-6 rounded-xl transition-all duration-300 ${
                isPanicMode
                  ? 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
                  : 'bg-surface border border-border text-text-primary shadow-sm hover:shadow-md'
              }`}
              variants={buttonVariants}
              whileHover={!isPanicMode ? "hover" : undefined}
              whileTap={!isPanicMode ? "tap" : undefined}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isPanicMode ? 'bg-surface-tertiary' : 'bg-surface-secondary'
                }`}>
                  <ArrowUpIcon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">Withdraw</span>
              </div>
            </motion.button>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            className="bg-surface border border-border/20 rounded-xl p-6 shadow-sm"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center justify-between mb-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold text-text-primary">Recent Transactions</h2>
              <motion.button 
                onClick={handleTransactions}
                className="text-text-primary text-sm font-medium hover:text-text-secondary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
              </motion.button>
            </motion.div>
            
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              variants={containerVariants}
            >
              {recentTransactions.map((tx, index) => {
                const c = computeClasses(tx.status, tx.direction);
                return (
                  <motion.div
                    key={tx.id}
                    className={`flex items-center justify-between p-4 bg-surface-secondary border ${c.border} rounded-xl hover:border-border/40 transition-all duration-300 ${c.stripe} border-l-4`}
                    variants={transactionItemVariants}
                    whileHover="hover"
                    custom={index}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface border border-border/20 rounded-xl flex items-center justify-center">
                        {tx.direction === 'credit' ? (
                          <ArrowDownIcon className={`w-5 h-5 ${c.amount}`} />
                        ) : (
                          <ArrowUpIcon className={`w-5 h-5 ${c.amount}`} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">
                          {tx.direction === 'credit' ? 'From' : 'To'}: {tx.counterparty}
                        </div>
                        <div className={`text-xs inline-flex items-center gap-2 px-2 py-0.5 border rounded-full ${c.bg} ${c.text} ${c.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
                          <span className="capitalize">{tx.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold ${c.amount}`}>{tx.amount}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          type="success"
          title="Action Successful!"
          message="Your request has been processed successfully."
          actionText="Continue"
          onAction={() => setShowSuccessModal(false)}
        />

        {/* Error Modal */}
        <Modal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          type="error"
          title="Action Blocked"
          message="This action is not available while Panic Mode is active. Please disable Panic Mode in Settings to continue."
          actionText="Go to Settings"
          onAction={() => {
            setShowErrorModal(false);
            navigate('/settings');
          }}
        />
      </motion.div>
    </>
  );
};
