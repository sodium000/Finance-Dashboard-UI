import React, { useState } from 'react';
import { useFinance } from '../../store/useFinance';
import { User, Bell, Search, ShieldCheck, Eye, SearchIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { role, setRole } = useFinance();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="h-20 bg-white/95 border-b border-slate-100 sticky top-0 z-40 px-4 sm:px-6 md:px-10 flex items-center justify-between ml-0 md:ml-64 shadow-sm backdrop-blur-md">

      <div className="hidden lg:flex items-center space-x-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 w-full max-w-[400px] focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:bg-white transition-all">
        <Search className="text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Global database search..."
          className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 w-full placeholder:text-slate-400 uppercase tracking-widest"
        />
      </div>

      <button
        onClick={() => setShowMobileSearch(true)}
        className="lg:hidden p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <SearchIcon size={20} />
      </button>

      <div className="flex items-center gap-2 sm:gap-6">
        <div className="flex bg-slate-50 p-1.5 rounded-[20px] items-center border border-slate-100 shadow-inner">
          <button
            onClick={() => setRole('admin')}
            className={`flex items-center justify-center p-2 sm:px-4 sm:py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${role === 'admin'
              ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-100 font-black'
              : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <ShieldCheck size={16} className={role === 'admin' ? 'sm:mr-2' : ''} />
            <span className="hidden sm:inline">Admin</span>
          </button>
          <button
            onClick={() => setRole('viewer')}
            className={`flex items-center justify-center p-2 sm:px-4 sm:py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${role === 'viewer'
              ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-100 font-black'
              : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <Eye size={16} className={role === 'viewer' ? 'sm:mr-2' : ''} />
            <span className="hidden sm:inline">Viewer</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-1">
          <button className="text-slate-400 hover:text-slate-900 p-2.5 bg-slate-50 rounded-2xl border border-slate-100 relative group transition-all active:scale-95">
            <Bell size={20} strokeWidth={2.5} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/10"></span>
          </button>

          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-100 cursor-pointer group">
            <div className="w-11 h-11 rounded-[18px] bg-indigo-50 border border-indigo-100/50 p-0.5 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <User size={18} fill="currentColor" className="text-white opacity-40" />
              </div>
            </div>
            <div className="hidden lg:block">
              <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Tanmoy</p>
              <p className="text-[9px] text-indigo-500 font-black uppercase tracking-[0.2em]">{role}</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 h-32 bg-white/95 backdrop-blur-xl z-[100] px-6 flex items-center gap-4 shadow-2xl border-b border-slate-200 lg:hidden"
          >
            <div className="flex-1 flex items-center bg-slate-50 px-6 py-4 rounded-[24px] border border-slate-200">
              <Search className="text-slate-400" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Global database search..."
                className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-full ml-4 uppercase tracking-widest placeholder:text-slate-300"
              />
            </div>
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-4 bg-slate-900 text-white rounded-[24px] shadow-lg active:scale-90 transition-transform"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
