import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter as FilterIcon,
  ChevronDown,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  Trash2,
  Edit2,
  Calendar,
  X,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Layers,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
  History,
  Info,
  Lock,
  ChevronLeft,
  ChevronRight,
  Hash,
  RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { mockTransactions, categories } from '../data/mockData';
import { useFinanceStore } from '../store/useFinanceStore';

const Transactions = () => {
  const { role, transactions: storeTransactions, deleteTransaction } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const allTransactions = useMemo(() => {
    return (storeTransactions && storeTransactions.length > 0)
      ? storeTransactions
      : mockTransactions;
  }, [storeTransactions]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchesType = selectedType === 'All' || t.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [allTransactions, searchTerm, selectedCategory, selectedType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedType]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const stats = [
    {
      label: 'Monthly Income',
      amount: allTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
      change: '+12.5%',
      icon: ArrowUpRight,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50'
    },
    {
      label: 'Monthly Expenses',
      amount: allTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
      change: '+8.2%',
      icon: ArrowDownLeft,
      color: 'bg-rose-500',
      lightColor: 'bg-rose-50'
    },
    {
      label: 'Net Balance',
      amount: allTransactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0),
      change: '+2.4%',
      icon: CreditCard,
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50'
    }
  ];

  const isAdmin = role === 'admin';

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const tableElement = document.getElementById('transaction-table');
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation(); // Don't trigger slide-over
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  const handleExport = () => {
    if (!isAdmin) return;
    alert("Exporting " + filteredTransactions.length + " transactions to CSV...");
  };

  const handleAddEntry = () => {
    if (!isAdmin) return;
    alert("This would open a 'New Transaction' modal.");
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">

      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-[101] shadow-2xl overflow-y-auto"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${selectedTx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      <Info size={20} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Transaction Details</h2>
                  </div>
                  <button
                    onClick={() => setSelectedTx(null)}
                    className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-900"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="bg-slate-50 rounded-[32px] p-8 text-center space-y-4 border border-slate-100">
                  <div className={`w-20 h-20 mx-auto rounded-[24px] flex items-center justify-center shadow-lg ${selectedTx.type === 'income' ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-rose-500 text-white shadow-rose-100'}`}>
                    {selectedTx.type === 'income' ? <ArrowUpRight size={40} strokeWidth={3} /> : <ArrowDownLeft size={40} strokeWidth={3} />}
                  </div>
                  <div>
                    <h3 className={`text-4xl font-black leading-tight ${selectedTx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {selectedTx.type === 'income' ? '+' : '-'}${selectedTx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[11px]">{selectedTx.note}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Category</p>
                    <p className="font-bold text-slate-800">{selectedTx.category}</p>
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</p>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <CheckCircle2 size={14} fill="currentColor" className="text-emerald-50" />
                      <span className="text-[13px]">Completed</span>
                    </div>
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Date & Time</p>
                    <p className="font-bold text-slate-800">{format(new Date(selectedTx.date), 'MMM dd, yyyy')}</p>
                    <p className="text-[10px] text-slate-400">14:30 PM EST</p>
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Reference ID</p>
                    <p className="font-bold text-slate-800 text-xs">TX-{selectedTx.id}-BFA</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Audit Logs</h4>
                  <div className="space-y-4">
                    {[
                      { action: 'Transaction Created', date: 'Oct 12, 2023 - 10:24', icon: History },
                      { action: 'Security Verification passed', date: 'Oct 12, 2023 - 10:25', icon: ShieldCheck },
                      { action: 'Funds Transferred Successfully', date: 'Oct 12, 2023 - 10:26', icon: Zap }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-last:bg-indigo-50 group-last:text-indigo-600 border border-slate-100`}>
                            <item.icon size={18} />
                          </div>
                          {i < 2 && <div className="absolute left-1/2 top-10 w-[1px] h-4 bg-slate-100 -translate-x-1/2" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{item.action}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                    Download Receipt
                  </button>
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        handleDelete(e, selectedTx.id);
                        setSelectedTx(null);
                      }}
                      className="px-6 py-4 border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm tracking-wider uppercase">
            <Layers size={16} />
            <span>Financial Manager</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Transactions History</h1>
          <p className="text-slate-500 max-w-md font-medium">Detailed view of all your financial movements and spending habits.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            disabled={!isAdmin}
            onClick={handleExport}
            title={isAdmin ? "Export transactions" : "Admin access required"}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-white border rounded-2xl font-bold transition-all active:scale-95 shadow-sm ${isAdmin ? 'border-slate-200 text-slate-700 hover:bg-slate-50' : 'border-slate-100 text-slate-300 cursor-not-allowed opacity-60'
              }`}
          >
            {isAdmin ? <Download size={18} /> : <Lock size={18} />}
            <span>Export CSV</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleAddEntry}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 hover:shadow-slate-300 transition-all active:scale-95"
            >
              <Plus size={20} />
              <span>Add Entry</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden group bg-white p-7 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40"
          >
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-4">
                <div className={`w-14 h-14 ${stat.lightColor} rounded-[22px] flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                  <stat.icon size={28} className={stat.label.includes('Income') ? 'text-emerald-600' : stat.label.includes('Expenses') ? 'text-rose-600' : 'text-indigo-600'} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 leading-none">
                    ${stat.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-black ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
            <div className={`absolute -right-4 -bottom-4 w-28 h-28 ${stat.lightColor} opacity-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
          </motion.div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white p-3 rounded-[32px] shadow-2xl shadow-slate-200/40">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Filter by description, ID or category..."
              className="w-full pl-16 pr-8 py-5 rounded-[22px] border-transparent bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-200 transition-all font-bold text-slate-700 placeholder:text-slate-400 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto p-1 lg:p-0">
            <div className="flex bg-slate-50 p-1.5 rounded-[22px] border border-slate-100 flex-1 lg:flex-none">
              <button
                onClick={() => setSelectedType('All')}
                className={`flex-1 lg:flex-none px-6 py-3 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all ${selectedType === 'All' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              > All </button>
              <button
                onClick={() => setSelectedType('income')}
                className={`flex-1 lg:flex-none px-6 py-3 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all ${selectedType === 'income' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
              > Income </button>
              <button
                onClick={() => setSelectedType('expense')}
                className={`flex-1 lg:flex-none px-6 py-3 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all ${selectedType === 'expense' ? 'bg-white shadow-md text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
              > Expenses </button>
            </div>

            <div className="relative hidden sm:block">
              <select
                className="appearance-none pl-8 pr-14 py-4.5 rounded-[22px] border-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900/5 transition-all text-slate-700 font-black uppercase tracking-widest text-[10px] cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-4.5 rounded-[22px] border transition-all ${showFilters ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              <FilterIcon size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative group" id="transaction-table">
        <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 to-slate-100 rounded-[48px] blur-xl opacity-20 transition duration-1000"></div>
        <div className="relative bg-white/95 backdrop-blur-md rounded-[48px] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="pl-12 pr-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center w-20">#</th>
                  <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Details</th>
                  <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Categorize</th>
                  <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Execution</th>
                  <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-right">Magnitude</th>
                  <th className="px-6 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">State</th>
                  <th className="pl-6 pr-12 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="pl-12 pr-6 py-8"><div className="h-6 bg-slate-100 rounded w-6 mx-auto"></div></td>
                      <td className="px-6 py-8"><div className="h-12 bg-slate-100 rounded-2xl w-56"></div></td>
                      <td className="px-6 py-8"><div className="h-7 bg-slate-100 rounded-xl w-28"></div></td>
                      <td className="px-6 py-8"><div className="h-7 bg-slate-100 rounded-xl w-36 mx-auto"></div></td>
                      <td className="px-6 py-8 text-right"><div className="h-7 bg-slate-100 rounded-xl w-24 ml-auto"></div></td>
                      <td className="px-6 py-8"><div className="h-7 bg-slate-100 rounded-xl w-28 mx-auto"></div></td>
                      <td className="pl-6 pr-12 py-8"><div className="h-12 bg-slate-100 rounded-2xl w-12 ml-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  <AnimatePresence mode="popLayout">
                    {paginatedTransactions.length > 0 ? (
                      paginatedTransactions.map((transaction, idx) => {
                        const serialNumber = (currentPage - 1) * itemsPerPage + idx + 1;
                        return (
                          <motion.tr
                            key={transaction.id}
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ delay: idx * 0.04 }}
                            onClick={() => setSelectedTx(transaction)}
                            className="group hover:bg-slate-50/70 transition-all duration-300 cursor-pointer"
                          >
                            <td className="pl-12 pr-6 py-8 text-center">
                              <span className="text-sm font-black text-slate-300 group-hover:text-amber-500 transition-colors">
                                {serialNumber.toString().padStart(2, '0')}
                              </span>
                            </td>
                            <td className="px-6 py-8">
                              <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 flex-shrink-0 rounded-[22px] flex items-center justify-center transition-all group-hover:scale-110 ${transaction.type === 'income' ? 'bg-emerald-50 text-emerald-600 shadow-inner' : 'bg-rose-50 text-rose-600 shadow-inner'}`}>
                                  {transaction.type === 'income' ? <ArrowUpRight size={24} strokeWidth={2.5} /> : <ArrowDownLeft size={24} strokeWidth={2.5} />}
                                </div>
                                <div className="space-y-0.5">
                                  <p className="font-black text-slate-800 text-base leading-tight hover:text-indigo-600 transition-colors">{transaction.note}</p>
                                  <p className="text-[11px] font-black text-slate-400 uppercase flex items-center gap-1.5 tracking-wider">
                                    <Clock size={11} className="text-slate-300" />
                                    REF# {transaction.id}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-8">
                              <div className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-black uppercase tracking-wider group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                {transaction.category}
                              </div>
                            </td>
                            <td className="px-6 py-8 text-center">
                              <div className="flex flex-col items-center">
                                <span className="text-[15px] font-black text-slate-800 tracking-tight leading-none mb-1">
                                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                </span>
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">14:30 PM</span>
                              </div>
                            </td>
                            <td className="px-6 py-8 text-right">
                              <span className={`text-xl font-black tracking-tight ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            </td>
                            <td className="px-6 py-8">
                              <div className="flex justify-center">
                                <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase tracking-wider ring-1 ring-emerald-100/50 group-hover:bg-white group-hover:shadow-sm transition-all">
                                  <CheckCircle2 size={14} fill="currentColor" className="text-emerald-100 stroke-emerald-600" />
                                  Success
                                </span>
                              </div>
                            </td>
                            <td className="pl-6 pr-12 py-8 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                {isAdmin && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        alert("Edit transaction: " + transaction.id);
                                      }}
                                      className="flex items-center justify-center w-11 h-11 rounded-2xl text-slate-300 hover:bg-white hover:text-indigo-600 hover:shadow-xl transition-all border border-transparent hover:border-slate-100 group/btn"
                                    >
                                      <Edit2 size={18} strokeWidth={2.5} />
                                    </button>
                                    <button
                                      onClick={(e) => handleDelete(e, transaction.id)}
                                      className="flex items-center justify-center w-11 h-11 rounded-2xl text-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:shadow-xl transition-all border border-transparent hover:border-rose-100"
                                    >
                                      <Trash2 size={18} strokeWidth={2.5} />
                                    </button>
                                  </>
                                )}
                                {!isAdmin && <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Locked</div>}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-32 text-center px-10">
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center justify-center max-sm mx-auto space-y-6"
                          >
                            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center border-4 border-white shadow-2xl">
                              <AlertCircle size={40} className="text-slate-200" strokeWidth={1} />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-2xl font-black text-slate-900">Zero entries matches</h3>
                              <p className="text-sm font-medium text-slate-400 leading-relaxed">
                                We couldn't find any financial records matching your current active filters.
                              </p>
                            </div>
                            <button
                              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedType('All'); }}
                              className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 hover:shadow-xl transition-all active:scale-95 shadow-lg shadow-slate-200"
                            >
                              Reset Data Pipeline
                            </button>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-10 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-10">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Showing <span className="text-slate-900 font-bold">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="text-slate-900 font-bold">{filteredTransactions.length}</span> total entries
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  localStorage.removeItem('finance-storage');
                  window.location.href = '/transactions'; 
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors shadow-sm active:scale-95"
              >
                <RotateCcw size={14} />
                Reset & Sync
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-700 hover:text-indigo-600 transition-colors disabled:opacity-20 disabled:cursor-not-allowed group"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Previous
              </button>

              <div className="flex items-center bg-white p-1.5 rounded-[22px] shadow-sm border border-slate-100">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-11 h-11 flex items-center justify-center rounded-2xl font-black text-sm transition-all ${currentPage === page
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-900 hover:text-indigo-600 transition-colors disabled:opacity-20 disabled:cursor-not-allowed group"
              >
                Next
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="flex flex-col items-center justify-center gap-4 py-10 opacity-40">
        <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
          <Clock size={16} strokeWidth={2.5} />
          <span>Real-time Secure Sync Active</span>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
        </div>
        <div className="flex gap-4">
          <ExternalLink size={14} className="text-slate-300" />
          <ShieldCheck size={14} className="text-slate-300" />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
