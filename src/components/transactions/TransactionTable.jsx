import React, { useState, useMemo } from 'react';
import { useFinance } from '../../store/useFinance';
import { Search, Filter, MoreVertical, Trash2, Edit2, ArrowUpRight, ArrowDownLeft, Receipt, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import TransactionModal from './TransactionModal';

const TransactionTable = () => {
  const { transactions, role, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.note.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative border border-slate-200 rounded-xl px-4 py-2 bg-slate-50 flex items-center">
             <Search size={16} className="text-slate-400 mr-2" />
             <input 
               type="text" 
               placeholder="Table lookup..." 
               className="bg-transparent outline-none text-xs font-black uppercase tracking-widest text-slate-700 w-full"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <select
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer text-slate-600 transition-all"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Global Nodes</option>
            <option value="income">Inflow Only</option>
            <option value="expense">Outflow Only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-black tracking-[0.1em]">
            <tr>
              <th className="px-6 py-5 text-center w-16">#</th>
              <th className="px-6 py-5">Node Identity</th>
              <th className="px-6 py-5">Source Sector</th>
              <th className="px-6 py-5">State</th>
              <th className="px-6 py-5">Magnitude</th>
              {role === 'admin' && <th className="px-6 py-5 text-right pr-12">Operations</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {paginatedData.map((t, idx) => (
                <motion.tr
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-5 text-center">
                    <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase">{(currentPage - 1) * itemsPerPage + idx + 1}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                        {t.type === 'income' ? <ArrowUpRight size={20} strokeWidth={2.5} /> : <ArrowDownLeft size={20} strokeWidth={2.5} />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-slate-100 leading-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase">{t.note}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                          <Receipt className="w-3 h-3" />
                          {t.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black px-3 py-1.5 bg-slate-100 rounded-lg text-slate-500 uppercase tracking-widest">{t.category}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified</span>
                    </div>
                  </td>
                  <td className={`px-6 py-5 font-black text-base ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  {role === 'admin' && (
                    <td className="px-6 py-5 text-right pr-12">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(t);
                            setIsModalOpen(true);
                          }}
                          className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm border border-transparent hover:border-slate-100"
                        >
                          <Edit2 size={18} strokeWidth={3} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Delete entry?")) deleteTransaction(t.id);
                          }}
                          className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm border border-transparent hover:border-rose-100"
                        >
                          <Trash2 size={18} strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="p-20 text-center">
            <div className="mx-auto w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 border-4 border-white shadow-xl">
              <Search size={40} />
            </div>
            <h4 className="text-xl font-black text-slate-900 uppercase">Registry Miss</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Zero datasets match current parameters</p>
          </div>
        )}
      </div>

      {filteredData.length > 0 && (
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="text-slate-900">{currentPage}</span> / <span className="text-slate-900">{totalPages} Nodes</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span><span className="text-slate-900">{filteredData.length}</span> Total Entries</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${currentPage === i + 1
                      ? 'bg-slate-900 text-white shadow-lg scale-110'
                      : 'text-slate-400 hover:bg-white hover:text-slate-900 border border-transparent shadow-sm'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <TransactionModal 
        open={isModalOpen} 
        handleClose={() => setIsModalOpen(false)} 
        transactionToEdit={selectedTx}
      />
    </div>
  );
};

export default TransactionTable;