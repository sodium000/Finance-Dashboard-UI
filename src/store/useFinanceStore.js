import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions } from '../data/mockData';

export const useFinanceStore = create(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: 'admin', // admin | viewer
      setRole: (role) => set({ role }),
      addTransaction: (transaction) => set((state) => ({ 
        transactions: [transaction, ...state.transactions] 
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      updateTransaction: (updated) => set((state) => ({
        transactions: state.transactions.map(t => t.id === updated.id ? updated : t)
      }))
    }),
    { name: 'finance-storage' }
  )
);
