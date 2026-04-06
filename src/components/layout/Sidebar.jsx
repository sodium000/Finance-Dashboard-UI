import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, TrendingUp, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/' },
    { name: 'Transactions', icon: Receipt, path: '/transactions' },
    { name: 'Insights', icon: BarChart3, path: '/insights' },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white transition-colors duration-300">
      <div className="p-6 md:p-10 flex items-center space-x-3 mb-6">
        <div className="bg-primary p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
          <TrendingUp size={24} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-black tracking-tight text-slate-800">Zorvyn</span>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 border border-transparent ${isActive
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 font-bold'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <item.icon size={22} />
            <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-8">
        <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] relative z-10">Secure Node</p>
          <div className="mt-2 text-sm text-white font-bold relative z-10 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Active Session
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="h-screen w-64 bg-white border-r border-slate-100 hidden md:flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300 shadow-sm">
        {sidebarContent}
      </aside>

      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl z-50 active:scale-90 transition-transform"
      >
        <Menu size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-[101] shadow-2xl md:hidden overflow-y-auto"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={24} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
