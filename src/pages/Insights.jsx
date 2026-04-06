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
  Activity,
  Flame,
  Crown,
  MousePointer2,
  Calendar,
  Layers,
  Search,
  MessageSquareQuote
} from 'lucide-react';
import { useFinance } from '../store/useFinance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, isSameMonth, parseISO, startOfMonth, subMonths } from 'date-fns';

const Insights = () => {
  const { transactions } = useFinance();
  const [activeTab, setActiveTab] = useState('monthly');
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
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    expenseTransactions.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
    const topCategory = topCategoryEntry[0];
    const topCategoryAmount = topCategoryEntry[1];

    const marchExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.includes('2024-03'))
      .reduce((acc, t) => acc + t.amount, 0);
    const aprilExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.includes('2024-04'))
      .reduce((acc, t) => acc + t.amount, 0);

    const expenseGrowth = marchExpenses > 0 ? ((aprilExpenses - marchExpenses) / marchExpenses) * 100 : 0;

    let observation = "Your cash flow is steady. You maintain a positive balance across all observed nodes.";
    if (savingsRate < 20) observation = "Caution: Your savings rate is below the 20% benchmark. Review lifestyle flux targets.";
    if (topCategoryAmount > (expenses * 0.5)) observation = `Priority Alert: ${topCategory} represents over 50% of your total spend. Optimization suggested.`;
    if (balance > 5000) observation = "Elite Liquidity: You have significant idle capital. Consider rotating into Alpha Assets.";

    return { income, expenses, balance, savingsRate, topCategory, topCategoryAmount, marchExpenses, aprilExpenses, expenseGrowth, observation };
  }, [transactions]);

  const cards = [
    { title: 'Capital Growth', value: `+${Math.abs(Math.round(insightsData.expenseGrowth))}%`, icon: TrendingUp, color: 'text-cyan-600', glow: 'shadow-cyan-500/10' },
    { title: 'Spent Analysis', value: `${Math.round((insightsData.expenses / insightsData.income) * 100)}% Used`, icon: Activity, color: 'text-violet-600', glow: 'shadow-violet-500/10' },
    { title: 'Safety Margin', value: `$${(insightsData.balance / 1000).toFixed(1)}k`, icon: ShieldCheck, color: 'text-emerald-600', glow: 'shadow-emerald-500/10' }
  ];

  const chartData = [
    { name: 'Mar (Mock)', value: insightsData.marchExpenses },
    { name: 'Apr (Mock)', value: insightsData.aprilExpenses },
    { name: 'Forecast', value: (insightsData.aprilExpenses * 0.9) },
  ];

  return (
    <div className="min-h-screen p-1 sm:p-2 bg-slate-50 text-slate-900 relative overflow-hidden font-sans rounded-t-[40px] md:rounded-none transition-colors duration-500">
      <div className="absolute top-0 right-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-violet-600/5 rounded-full blur-[100px] sm:blur-[150px] -mr-48 sm:-mr-96 -mt-48 sm:-mt-96" />
      <div className="absolute bottom-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-cyan-600/5 rounded-full blur-[80px] sm:blur-[120px] -ml-32 sm:-ml-64 -mb-32 sm:-mb-64" />

      <div className=" space-y-8 sm:space-y-10 relative z-10">

        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-4">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/5 border border-violet-500/10 text-violet-600 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Crown size={12} className="fill-current" />
              <span>Precision Analysis Engine</span>
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-slate-900">
              Insights <br />
              <span className="bg-gradient-to-r from-cyan-600 via-violet-600 to-fuchsia-600 text-transparent bg-clip-text">Calculated.</span>
            </h1>
            <p className="text-slate-500 max-w-lg font-medium text-sm sm:text-base leading-relaxed">
              Analyzing your 13 active session records. We've detected a <span className="text-indigo-600 font-bold">{Math.abs(Math.round(insightsData.expenseGrowth))}% {insightsData.expenseGrowth > 0 ? "increase" : "reduction"}</span> in monthly burn over the observation period.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <button
              onClick={handleSync}
              className="px-8 py-4 sm:py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <RefreshCcw size={16} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Recalculating...' : 'Refresh Insight Node'}
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

          <motion.div
            className="lg:col-span-8 bg-white/40 backdrop-blur-2xl border border-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 relative group overflow-hidden shadow-2xl shadow-slate-200/50"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2 leading-none">Monthly Comparison</p>
                  <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-none tracking-tight">
                    ${insightsData.aprilExpenses.toLocaleString()} <span className="text-lg text-slate-400">vs</span> ${insightsData.marchExpenses.toLocaleString()}
                  </h2>
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    <span className={`px-2 py-1 rounded text-[9px] font-black tracking-widest uppercase ${insightsData.expenseGrowth > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {insightsData.expenseGrowth > 0 ? 'Expense Up' : 'Expense Down'} {Math.abs(Math.round(insightsData.expenseGrowth))}%
                    </span>
                    <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-600 text-[9px] font-black tracking-widest uppercase italic">Diagnostic: {insightsData.topCategory} heavy</span>
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 bg-indigo-600 text-white rounded-2xl sm:rounded-3xl shadow-lg shadow-indigo-100">
                  <History size={24} />
                </div>
              </div>

              <div className="mt-12 sm:mt-20 h-[220px] sm:h-[280px] -mx-4 sm:-mx-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" hide />
                    <Tooltip
                      cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', padding: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#0f172a', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#4F46E5"
                      strokeWidth={6}
                      fillOpacity={1}
                      fill="url(#glow)"
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
            <motion.div className="bg-slate-900 border border-slate-800 p-8 rounded-[36px] flex flex-col h-full justify-between shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <MessageSquareQuote size={20} />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Key Observation</p>
                </div>
                <h3 className="text-xl font-black text-white leading-relaxed">
                  "{insightsData.observation}"
                </h3>
              </div>
              <div className="mt-10 flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500 flex items-center justify-center text-indigo-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-widest"> Analyst</p>
                  <p className="text-[9px] text-slate-500 uppercase font-black">Verified Insight</p>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            </motion.div>

            <motion.div className="bg-white border border-slate-100 p-8 rounded-[36px] flex items-center justify-between transition-colors shadow-xl">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">Highest Expenditure</p>
                <div>
                  <h4 className="text-3xl font-black text-slate-900 capitalize">{insightsData.topCategory}</h4>
                  <p className="text-lg font-black text-slate-400">${insightsData.topCategoryAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <Flame size={32} />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pb-10">

          <div className="p-8 sm:p-10 bg-indigo-600 rounded-[48px] text-white space-y-6 relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <PieChart size={32} className="text-amber-400" />
              </div>
              <h4 className="text-2xl font-black">Expense Breakdown</h4>
              <p className="text-indigo-100/70 text-sm font-medium mt-2 leading-relaxed max-w-sm">
                {insightsData.topCategory} accounts for approximately <span className="text-white font-black">{Math.round((insightsData.topCategoryAmount / insightsData.expenses) * 100)}%</span> of your total monthly expenditures.
              </p>
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-indigo-200 font-black uppercase mb-1">Efficiency Ratio</p>
                  <p className="text-lg font-black">{Math.round(insightsData.savingsRate)}%</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  Audit Pipeline <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <Sparkles size={180} className="absolute -right-20 -top-20 text-white opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
          </div>

          <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[48px] p-8 sm:p-10 flex flex-col justify-between shadow-2xl transition-colors">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">Fiscal Sentiment</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Calculated Sentiment Vector</p>
              </div>
              <Activity size={24} className="text-emerald-500" />
            </div>

            <div className="space-y-10 py-4">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 flex items-center justify-center relative shrink-0">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="rgba(0,0,0,0.05)" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="64" cy="64" r="58" stroke="#10b981" strokeWidth="8" fill="transparent"
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * (insightsData.savingsRate / 100))}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-2xl font-black">{Math.round(insightsData.savingsRate)}%</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black">Neutral Inflow</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Your current trajectory suggests a <span className="text-emerald-500 font-black">stable outcome</span> for the next 30-day node. No immediate corrective actions required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const History = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
  </svg>
);

export default Insights;
