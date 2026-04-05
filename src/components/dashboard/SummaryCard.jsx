import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCard = ({ title, amount, type, icon: Icon, trend }) => {
  const isIncome = type === 'income';
  const isBalance = type === 'balance';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, cubicBezier: [0.4, 0, 0.2, 1] }}
      className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-2 md:gap-0">
        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl flex-shrink-0 ${
          isIncome ? 'bg-emerald-50 text-emerald-600' : 
          isBalance ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
        }`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center space-x-1 text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1.5 rounded-full flex-shrink-0 ${
          trend >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
        }`}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>

      <div className="mt-6 md:mt-8">
        <p className="text-[10px] md:text-sm font-semibold text-slate-400 tracking-wider uppercase">{title}</p>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-2 break-words">
          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <p className="text-[9px] md:text-xs text-slate-500 mt-1">vs last month</p>
      </div>
    </motion.div>
  );
};

export default SummaryCard;
