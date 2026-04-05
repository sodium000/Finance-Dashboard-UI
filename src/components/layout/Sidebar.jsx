import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, Settings, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/' },
    { name: 'Transactions', icon: Receipt, path: '/transactions' },
    { name: 'Insights', icon: BarChart3, path: '/insights' },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center space-x-2">
        <div className="bg-primary p-2 rounded-lg text-white">
          <TrendingUp size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">Antigravity Finance</span>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
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

      <div className="p-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-semibold">Pro Plan Active</p>
          <div className="mt-2 text-sm text-slate-700">Unlimited tracking enabled.</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
