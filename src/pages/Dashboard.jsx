import React, { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import SummaryCard from '../components/dashboard/SummaryCard';
import { SpendingTrendChart, CategoryPieChart } from '../components/dashboard/Charts';
import TransactionTable from '../components/transactions/TransactionTable';
import { Wallet, TrendingUp, TrendingDown, LayoutDashboard, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AddTransactionModal from '../components/transactions/AddTransactionModal';

const Dashboard = () => {
  const { transactions, role } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totals = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'income') acc.income += curr.amount;
      else acc.expense += curr.amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [transactions]);

  const balance = totals.income - totals.expense;

  return (
    <div className="space-y-8 p-1 sm:p-2">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary text-white rounded-xl shadow-lg">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Financial Overview</h1>
            <p className="text-sm text-slate-500">Welcome back, track your spending and income here.</p>
          </div>
        </div>

        {role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        )}
      </motion.div>

      <AddTransactionModal open={isModalOpen} handleClose={() => setIsModalOpen(false)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Balance" 
          amount={balance} 
          type="balance" 
          icon={Wallet} 
          trend={12} 
        />
        <SummaryCard 
          title="Total Income" 
          amount={totals.income} 
          type="income" 
          icon={TrendingUp} 
          trend={8.5} 
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={totals.expense} 
          type="expense" 
          icon={TrendingDown} 
          trend={-4.2} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Spending Trends</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">Real-time</span>
          </div>
          <SpendingTrendChart />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Spending Breakdown</h3>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-tighter">By Category</span>
          </div>
          <CategoryPieChart />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <TransactionTable />
      </motion.div>
    </div>
  );
};

export default Dashboard;
