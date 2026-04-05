import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  AlertCircle,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  CircleDollarSign,
  PieChart,
  Lightbulb,
  ShieldCheck,
  RefreshCcw,
  Wallet,
  CheckCircle2,
  Trophy,
  Activity
} from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const Insights = () => {
  const { transactions } = useFinanceStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const insightsData = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    const categoryTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

    return { income, expenses, balance, savingsRate, topCategory };
  }, [transactions]);

  const cards = [
    { title: 'Spending Health', value: 'Excellent', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Savings Target', value: '75% Met', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { title: 'Total Budgeted', value: '$8,250.00', icon: CircleDollarSign, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' }
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Reduce Coffee Spending',
      desc: 'You spent 15% more on coffee this week than your average.',
      potential: 'Save $45/mo',
      icon: AlertCircle,
      type: 'warning'
    },
    {
      id: 2,
      title: 'Auto-Invest Dividend',
      desc: 'You have $500 in dividends waiting. Auto-investing can yield 8% annually.',
      potential: 'Gain +$40/yr',
      icon: TrendingUp,
      type: 'opportunity'
    },
    {
      id: 3,
      title: 'Utility Bill Optimization',
      desc: 'A better plan for your internet might save you over $20 monthly.',
      potential: 'Save $240/yr',
      icon: Lightbulb,
      type: 'tip'
    }
  ];

  const monthlyData = [
    { name: 'Week 1', spending: 400 },
    { name: 'Week 2', spending: 300 },
    { name: 'Week 3', spending: 600 },
    { name: 'Week 4', spending: 450 },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      <section className="relative overflow-hidden group">
        {/* Abstract Background Shapes */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-1000" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] group-hover:bg-rose-500/20 transition-all duration-1000" />

        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span> Insights Engine 4.0</span>
            </motion.div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Financial <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600">Intelligence.</span>
            </h1>
            <p className="text-slate-500 max-w-lg font-medium text-lg leading-relaxed">
              Deep dive into your financial habits. We've analyzed your 13 transactions to help you build a stronger portfolio.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSync}
              className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-3xl font-black text-[11px] uppercase tracking-widest text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-all group"
            >
              <RefreshCcw size={16} className={`${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span>{isSyncing ? 'Analyzing...' : 'Recalculate'}</span>
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all">
              <Zap size={16} fill="currentColor" className="text-amber-400" />
              <span>Full Analytics Report</span>
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <motion.div
          className="lg:col-span-1 bg-white p-8 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center justify-center text-center space-y-6"
          whileHover={{ y: -5 }}
        >
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Health Factor</h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
              <motion.circle
                cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                className="text-emerald-500"
                strokeDasharray={552}
                initial={{ strokeDashoffset: 552 }}
                animate={{ strokeDashoffset: 552 - (552 * (insightsData.savingsRate / 100)) }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-slate-900">{Math.round(insightsData.savingsRate)}%</span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Savings Rate</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-black text-slate-800">Elite Tier Position</p>
            <p className="text-xs text-slate-400 font-medium">Top 5% of our users track like you.</p>
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-3 bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40"
          whileHover={{ y: -5 }}
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="spending" stroke="#6366f1" fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Capital Overview</p>
                <h3 className="text-5xl font-black">${insightsData.balance.toLocaleString()}</h3>
                <p className="text-slate-400 flex items-center gap-1.5 text-xs">
                  <Activity size={14} className="text-emerald-500" />
                  Increased by 12.5% this month
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Monthly Burn</p>
                  <p className="text-rose-400 font-black text-lg">-${insightsData.expenses.toLocaleString()}</p>
                </div>
                <div className="text-right border-l border-slate-800 pl-4">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Net Inflow</p>
                  <p className="text-emerald-400 font-black text-lg">+${insightsData.income.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-8 border-t border-slate-800/50">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Top Category</p>
                <p className="text-sm font-bold text-white">{insightsData.topCategory[0]}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Anomaly Detection</p>
                <p className="text-sm font-bold text-emerald-400">Stable</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Forecast</p>
                <p className="text-sm font-bold text-white">+$2.1k Est.</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Fiscal Safety</p>
                <div className="flex gap-1">
                  <div className="w-4 h-1.5 bg-emerald-500 rounded-full" />
                  <div className="w-4 h-1.5 bg-emerald-500 rounded-full" />
                  <div className="w-4 h-1.5 bg-emerald-500 rounded-full opacity-30" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">Optimization Tips</h3>
            <button className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">View All Plans</button>
          </div>

          <div className="grid gap-4">
            {recommendations.map((rec) => (
              <motion.div
                key={rec.id}
                whileHover={{ x: 10 }}
                className="bg-white border border-slate-100 p-6 rounded-[32px] flex items-center justify-between gap-6 shadow-xl shadow-slate-200/20 group cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${rec.type === 'warning' ? 'bg-rose-50 text-rose-500' : rec.type === 'opportunity' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-500'}`}>
                    <rec.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-800 text-base">{rec.title}</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs">{rec.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-black uppercase tracking-widest ${rec.type === 'warning' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {rec.potential}
                  </p>
                  <div className="flex justify-end mt-1 text-slate-300 group-hover:text-slate-900 transition-colors">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">Budget Allocation</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Goals (4/5)</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
              <PieChart size={24} />
            </div>
          </div>

          <div className="space-y-8">
            {[
              { name: 'Housing & Rent', used: 1200, limit: 1500, color: 'bg-indigo-600' },
              { name: 'Food & Dining', used: 450, limit: 600, color: 'bg-emerald-500' },
              { name: 'Transportation', used: 180, limit: 200, color: 'bg-amber-500' },
              { name: 'Entertainment', used: 320, limit: 300, color: 'bg-rose-500' },
            ].map((item) => (
              <div key={item.name} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-black text-slate-800 leading-none mb-1">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{Math.round((item.used / item.limit) * 100)}% Consumed</p>
                  </div>
                  <p className="text-sm font-black text-slate-900">
                    ${item.used} <span className="text-slate-300 font-bold">/ ${item.limit}</span>
                  </p>
                </div>
                <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.used / item.limit) * 100, 100)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.used > item.limit ? 'bg-rose-500' : item.color} shadow-lg shadow-black/5`}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-5 bg-slate-50 text-slate-800 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all border border-slate-200/50">
            Update Budget Strategy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
        <motion.div whileHover={{ y: -8 }} className="p-8 bg-indigo-600 rounded-[40px] text-white space-y-6 relative overflow-hidden group shadow-2xl shadow-indigo-200">
          <div className="relative z-10">
            <Trophy size={32} className="text-amber-400 mb-4" />
            <h4 className="text-xl font-black">Financial Milestone</h4>
            <p className="text-indigo-100 text-sm font-medium mt-2 leading-relaxed">
              You've maintained a positive balance for 4 months straight. This unlocks your "Fiscal Wizard" badge.
            </p>
            <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/20 px-5 py-2 rounded-full hover:bg-white/30 transition-all">
              Claim Reward <ArrowUpRight size={14} />
            </button>
          </div>
          <CircleDollarSign size={180} className="absolute -right-20 -bottom-20 text-white opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
        </motion.div>

        <motion.div whileHover={{ y: -8 }} className="p-8 bg-white border border-slate-100 rounded-[40px] space-y-6 shadow-2xl shadow-slate-200/40 relative group">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
            <ShieldCheck size={28} />
          </div>
          <h4 className="text-xl font-black text-slate-900">Security Insights</h4>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            We've detected 2 recurring subscriptions you haven't used in 30 days. Cancel them to save extra.
          </p>
          <button className="text-rose-500 font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
            Review Protection <ChevronRight size={16} />
          </button>
        </motion.div>

        <motion.div whileHover={{ y: -8 }} className="p-8 bg-white border border-slate-100 rounded-[40px] space-y-6 shadow-2xl shadow-slate-200/40 relative group">
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
            <Lightbulb size={28} />
          </div>
          <h4 className="text-xl font-black text-slate-900">Custom Alerts</h4>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Get notified when any single transaction exceeds $500. Set custom thresholds for peace of mind.
          </p>
          <button className="text-amber-500 font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
            Setup Alerts <ChevronRight size={16} />
          </button>
        </motion.div>
      </div>

    </div>
  );
};

export default Insights;
