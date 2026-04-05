import React, { useState, useMemo } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Search, Filter, MoreVertical, Trash2, Edit2, ArrowUpRight, ArrowDownLeft, Receipt, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const TransactionTable = () => {
  const { transactions, role, deleteTransaction } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');


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
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Global Database</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Quick search..."
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary w-full md:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer font-bold text-slate-600"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.1em]">
            <tr>
              <th className="px-6 py-5">Transaction Details</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5 text-center">Execution Date</th>
              <th className="px-6 py-5">Amount</th>
              {role === 'admin' && <th className="px-6 py-5 text-right">Administrative</th>}
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
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group cursor-default"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600 shadow-inner' : 'bg-rose-50 text-rose-600 shadow-inner'
                        }`}>
                        {t.type === 'income' ? <ArrowUpRight size={20} strokeWidth={2.5} /> : <ArrowDownLeft size={20} strokeWidth={2.5} />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{t.note}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-100 uppercase tracking-wider group-hover:bg-white group-hover:shadow-sm transition-all">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{format(new Date(t.date), 'MMM dd, yyyy')}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified</span>
                    </div>
                  </td>
                  <td className={`px-6 py-5 font-black text-base ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  {role === 'admin' && (
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group/btn">
                          <Edit2 size={18} strokeWidth={3} className="transition-all" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Delete entry?")) deleteTransaction(t.id);
                          }}
                          className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group/btn"
                        >
                          <Trash2 size={18} strokeWidth={3} className="transition-all" />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filteredData.length === 0 && !isLoading && (
          <div className="p-20 text-center">
            <div className="mx-auto w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 border-4 border-white shadow-xl">
              <Receipt size={40} strokeWidth={1} />
            </div>
            <h4 className="text-xl font-black text-slate-800 mb-2">No results found</h4>
            <p className="text-slate-400 font-medium max-w-xs mx-auto">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {filteredData.length > 0 && (
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span>Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span></span>
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
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
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
    </div>
  );
};

const Clock = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

export default TransactionTable;
