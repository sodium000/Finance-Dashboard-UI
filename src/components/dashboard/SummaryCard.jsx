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
      className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className={`p-4 rounded-2xl ${
          isIncome ? 'bg-emerald-50 text-emerald-600' : 
          isBalance ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
        }`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center space-x-1 text-[10px] font-black uppercase tracking-tight px-3 py-1.5 rounded-full ${
          trend >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
        }`}>
          {trend >= 0 ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
          <span>{Math.abs(trend)}% Target Flow</span>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase leading-none">{title}</p>
        <h2 className="text-4xl font-black text-slate-900 mt-3 tracking-tight">
          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h2>
      </div>
    </motion.div>
  );
};

export default SummaryCard;
