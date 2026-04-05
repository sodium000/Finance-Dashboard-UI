import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { User, Bell, Search, ShieldCheck, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { role, setRole } = useFinanceStore();

  return (
    <header className="h-16 md:h-20 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 md:px-10 flex items-center justify-between md:ml-64 shadow-sm backdrop-blur-md bg-white/80">
      {/* Search Bar - Hidden on small screens */}
      <div className="hidden sm:flex items-center space-x-4 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 flex-1 max-w-md focus-within:ring-2 focus-within:ring-primary transition-all">
        <Search className="text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
        />
      </div>

      {/* Mobile Search Icon */}
      <button className="sm:hidden text-slate-500 hover:text-primary transition-colors">
        <Search size={20} />
      </button>

      <div className="flex items-center space-x-3 md:space-x-6 ml-auto md:ml-0">
        {/* Role Toggle */}
        <div className="hidden md:flex bg-slate-100 p-1 rounded-xl items-center border border-slate-200">
          <button 
            onClick={() => setRole('admin')}
            className={`flex items-center space-x-2 px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm transition-all whitespace-nowrap ${
              role === 'admin' 
              ? 'bg-white text-primary shadow-sm font-bold' 
              : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck size={16} />
            <span className="hidden sm:inline">Admin</span>
          </button>
          <button 
            onClick={() => setRole('viewer')}
            className={`flex items-center space-x-2 px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm transition-all whitespace-nowrap ${
              role === 'viewer' 
              ? 'bg-white text-primary shadow-sm font-bold' 
              : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Eye size={16} />
            <span className="hidden sm:inline">Viewer</span>
          </button>
        </div>

        {/* Mobile Role Toggle */}
        <div className="md:hidden flex bg-slate-100 p-1 rounded-lg items-center border border-slate-200 gap-1">
          <button 
            onClick={() => setRole('admin')}
            className={`p-1.5 rounded transition-all ${
              role === 'admin' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-slate-500'
            }`}
          >
            <ShieldCheck size={16} />
          </button>
          <button 
            onClick={() => setRole('viewer')}
            className={`p-1.5 rounded transition-all ${
              role === 'viewer' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-slate-500'
            }`}
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Notification */}
        <button className="text-slate-500 hover:text-primary transition-colors p-2 hover:bg-slate-50 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer group">
          <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-indigo-100 border-2 border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <User size={18} />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-slate-800">Tanmoy</p>
            <p className="text-xs text-slate-500 capitalize">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
