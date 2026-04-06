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
import { useFinance } from '../store/useFinance';
import TransactionModal from '../components/transactions/TransactionModal';

const Transactions = () => {
  const { role, transactions: storeTransactions, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

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
    { label: 'Monthly Income', amount: allTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0), icon: ArrowUpRight, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Monthly Expenses', amount: allTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0), icon: ArrowDownLeft, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
    { label: 'Net balance', amount: allTransactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0), icon: CreditCard, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' }
  ];

  const isAdmin = role === 'admin';

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEdit = (e, tx) => {
    e.stopPropagation();
    setTransactionToEdit(tx);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Note'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      format(new Date(tx.date), 'yyyy-MM-dd'),
      tx.type,
      tx.category,
      tx.amount,
      `"${tx.note.replace(/"/g, '""')}"` // Wrap note in quotes and escape internal quotes
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_export_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className=" space-y-6 sm:space-y-10 pb-20 p-1 sm:p-2 animate-in fade-in duration-700">
      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTx(null)} className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[100] cursor-pointer" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white dark:bg-slate-900 z-[101] shadow-2xl overflow-y-auto">
              <div className="p-6 sm:p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Transaction Details</h2>
                  <button onClick={() => setSelectedTx(null)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                    <X size={24} />
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-[32px] p-8 text-center space-y-4 border border-slate-100 dark:border-slate-700">
                  <div className={`w-20 h-20 mx-auto rounded-[24px] flex items-center justify-center shadow-lg ${selectedTx.type === 'income' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {selectedTx.type === 'income' ? <ArrowUpRight size={40} /> : <ArrowDownLeft size={40} />}
                  </div>
                  <div>
                    <h3 className={`text-4xl font-black ${selectedTx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {selectedTx.type === 'income' ? '+' : '-'}${selectedTx.amount.toLocaleString()}
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest mt-2">{selectedTx.note}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[24px]">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">State</p>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm"><CheckCircle2 size={14} /> Global Clear</div>
                  </div>
                  <div className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[24px]">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Category</p>
                    <p className="font-black text-slate-800 dark:text-slate-200 text-sm">{selectedTx.category}</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl dark:shadow-none">Pipeline Report</button>
                  {isAdmin && (
                    <button onClick={(e) => { handleDelete(e, selectedTx.id); setSelectedTx(null); }} className="px-6 py-4 border border-slate-200 dark:border-slate-700 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all flex items-center justify-center">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4 transition-colors">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] leading-none px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-full w-fit">
            <Layers size={14} />
            <span>Fiscal Control Cluster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Global Log.</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm text-sm">Analytical dataset representing your last 13 active fiscal sessions.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button onClick={handleExportCSV} disabled={!isAdmin} className={`px-6 py-4 bg-white dark:bg-slate-900 border rounded-[22px] font-black text-[11px] uppercase tracking-widest shadow-sm transition-all flex items-center justify-center gap-2 ${isAdmin ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700' : 'text-slate-300 dark:text-slate-600 border-slate-100 dark:border-slate-800 opacity-60'}`}>
            {isAdmin ? <Download size={18} /> : <Lock size={18} />}
            <span>Export CSV</span>
          </button>
          {isAdmin && (
            <button onClick={handleOpenAdd} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[22px] font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-slate-900/20 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
              <Plus size={20} strokeWidth={3} />
              <span>Initialize Node</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden group transition-colors">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-[24px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner`}>
                <stat.icon size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-3">Diagnostic: {stat.label}</p>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-none">${stat.amount.toLocaleString()}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800 p-4 rounded-[40px] shadow-2xl shadow-slate-200/40 dark:shadow-none flex flex-col lg:flex-row items-stretch lg:items-center gap-4 transition-colors">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={20} strokeWidth={2.5} />
          <input type="text" placeholder="Search database index..." className="w-full pl-16 pr-8 py-5 rounded-[24px] bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-slate-900/5 dark:focus:ring-white/5 text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex bg-slate-50 dark:bg-slate-800 p-2 rounded-[24px] border border-slate-100 dark:border-slate-700 flex-1 sm:flex-none">
            {['All', 'income', 'expense'].map(t => (
              <button key={t} onClick={() => setSelectedType(t)} className={`flex-1 sm:flex-none px-7 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md ring-1 ring-slate-100 dark:ring-slate-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                {t}
              </button>
            ))}
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="appearance-none px-8 py-5 rounded-[24px] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 cursor-pointer focus:ring-2 focus:ring-slate-900/5 dark:focus:ring-white/5 transition-all">
            <option value="All">All Clusters</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-[56px] border border-white dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/40 dark:shadow-none transition-colors duration-300">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="pl-12 pr-6 py-8 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest text-center w-24">#</th>
                <th className="px-6 py-8 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Transaction Signature</th>
                <th className="px-6 py-8 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Sector</th>
                <th className="px-6 py-8 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest text-center">Execution Date</th>
                <th className="px-6 py-8 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest text-right">Magnitude</th>
                <th className="pl-6 pr-12 py-8 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              <AnimatePresence mode="popLayout">
                {paginatedTransactions.map((tx, idx) => {
                  const serial = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <motion.tr key={tx.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ delay: idx * 0.05 }} onClick={() => setSelectedTx(tx)} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors duration-200">
                      <td className="pl-12 pr-6 py-8 text-center text-sm font-black text-slate-400 dark:text-slate-500 hover:text-blue-400 transition-colors uppercase">{serial.toString().padStart(2, '0')}</td>
                      <td className="px-6 py-8">
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner ${tx.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500'}`}>
                            {tx.type === 'income' ? <ArrowUpRight size={22} strokeWidth={2.5} /> : <ArrowDownLeft size={22} strokeWidth={2.5} />}
                          </div>
                          <div>
                            <p className="text-base font-black text-slate-800 dark:text-slate-200 leading-none mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{tx.note}</p>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{tx.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <span className="text-[10px] font-black px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:bg-white dark:group-hover:bg-slate-700 transition-all">{tx.category}</span>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <div className="flex flex-col">
                          <span className="text-[15px] font-black text-slate-800 dark:text-slate-300 leading-none">{format(new Date(tx.date), 'MMM dd, yyyy')}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Verified Node</span>
                        </div>
                      </td>
                      <td className="px-6 py-8 text-right">
                        <span className={`text-xl font-black tracking-tight ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="pl-6 pr-12 py-8 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {isAdmin ? (
                            <>
                              <button onClick={(e) => handleEdit(e, tx)} className="p-3 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm"><Edit2 size={18} strokeWidth={2.5} /></button>
                              <button onClick={e => handleDelete(e, tx.id)} className="p-3 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all shadow-sm"><Trash2 size={18} strokeWidth={2.5} /></button>
                            </>
                          ) : <span className="text-[10px] font-black text-slate-200 dark:text-slate-800 uppercase tracking-[0.2em] italic">Encrypted</span>}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="p-10 sm:p-12 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-10 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center md:text-left">
            Index <span className="text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="text-slate-900 dark:text-white">{filteredTransactions.length}</span> records
            <button onClick={() => { localStorage.removeItem('finance-storage'); window.location.reload(); }} className="block mt-3 text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 hover:underline transition-all items-center gap-1.5 mx-auto md:mx-0"><RotateCcw size={14} /> Reset Cache Cluster</button>
          </div>

          <div className="flex items-center gap-8">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors disabled:opacity-20 group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Prev
            </button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => handlePageChange(i + 1)} className={`w-12 h-12 rounded-[20px] font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-110' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-transparent shadow-sm'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white hover:text-indigo-600 transition-colors disabled:opacity-20 group">
              Next <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      <TransactionModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
};

export default Transactions;
