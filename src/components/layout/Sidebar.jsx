import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, Settings, TrendingUp, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/' },
    { name: 'Transactions', icon: Receipt, path: '/transactions' },
    { name: 'Insights', icon: BarChart3, path: '/insights' },
  ];

  const sidebarContent = (
    <>
      <div className="p-4 md:p-6 flex items-center space-x-2 border-b border-slate-200 md:border-b-0">
        <div className="bg-primary p-2 rounded-lg text-white">
          <TrendingUp size={24} />
        </div>
        <span className="text-lg md:text-xl font-bold tracking-tight text-slate-800">Antigravity</span>
      </div>

      <nav className="flex-1 mt-4 md:mt-6 px-3 md:px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                ? 'bg-primary text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-primary grayscale-[0.2] hover:grayscale-0'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 md:p-6 border-t border-slate-200 md:border-t-0">
        <div className="bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-semibold">Pro Plan Active</p>
          <div className="mt-2 text-xs md:text-sm text-slate-700">Unlimited tracking enabled.</div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="hidden md:flex h-screen w-64 bg-white border-r border-slate-200 flex-col fixed left-0 top-0 z-50">
        {sidebarContent}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="md:hidden fixed left-0 top-0 h-screen w-64 bg-white z-50 flex flex-col shadow-xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
