import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

type Transaction = {
  id: string;
  type: 'sent' | 'received';
  counterparty: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  narration?: string;
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'received',
    counterparty: 'Alice Smith',
    amount: '+150.00',
    date: '2024-01-15',
    status: 'completed',
    narration: 'Payment for services',
  },
  {
    id: '2',
    type: 'sent',
    counterparty: 'Bob Johnson',
    amount: '-75.50',
    date: '2024-01-14',
    status: 'completed',
    narration: 'Dinner payment',
  },
  {
    id: '3',
    type: 'received',
    counterparty: '0x742d35...b4d8b6',
    amount: '+500.00',
    date: '2024-01-13',
    status: 'completed',
  },
  {
    id: '4',
    type: 'sent',
    counterparty: 'Carol Wilson',
    amount: '-200.00',
    date: '2024-01-12',
    status: 'pending',
    narration: 'Rent payment',
  },
  {
    id: '5',
    type: 'sent',
    counterparty: 'David Brown',
    amount: '-50.00',
    date: '2024-01-11',
    status: 'failed',
    narration: 'Coffee',
  },
];

export const Transactions = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-text-primary';
      case 'pending': return 'text-text-secondary';
      case 'failed': return 'text-text-tertiary';
      default: return 'text-text-tertiary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'pending': return '⏳';
      case 'failed': return '✗';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/20">
        <button onClick={() => navigate('/home')} className="p-2">
          <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">Transactions</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <div className="space-y-3">
          {mockTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-surface border border-border/20 rounded-xl p-4 hover:bg-surface-secondary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Transaction Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    transaction.type === 'received' ? 'bg-surface-secondary' : 'bg-surface-secondary'
                  }`}>
                    {transaction.type === 'received' ? (
                      <ArrowDownIcon className="w-5 h-5 text-text-primary" />
                    ) : (
                      <ArrowUpIcon className="w-5 h-5 text-text-primary" />
                    )}
                  </div>
                  
                  {/* Transaction Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-text-primary">
                        {transaction.type === 'received' ? 'From' : 'To'}: {transaction.counterparty}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)} bg-surface-secondary`}>
                        {getStatusIcon(transaction.status)} {transaction.status}
                      </span>
                    </div>
                    {transaction.narration && (
                      <div className="text-sm text-text-secondary">{transaction.narration}</div>
                    )}
                    <div className="text-xs text-text-tertiary">{formatDate(transaction.date)}</div>
                  </div>
                </div>
                
                {/* Amount */}
                <div className="text-right">
                  <div className={`font-bold text-lg ${
                    transaction.type === 'received' ? 'text-text-primary' : 'text-text-primary'
                  }`}>
                    {transaction.amount} USDC
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More */}
        <div className="text-center mt-8">
          <button className="text-text-primary text-sm font-medium">
            Load More Transactions
          </button>
        </div>
      </div>
    </div>
  );
};
