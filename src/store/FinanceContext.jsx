import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';

export const FinanceContext = createContext();

const STORAGE_KEY = 'finance-dashboard-v1';

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed.transactions) ? parsed.transactions : mockTransactions;
      }
    } catch (e) {
      console.error("Failed to load transactions", e);
    }
    return mockTransactions;
  });

  const [role, setRole] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.role || 'admin';
      }
    } catch (e) {
      console.error("Failed to load role", e);
    }
    return 'admin';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, role }));
  }, [transactions, role]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (updated) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      role,
      setRole,
      addTransaction,
      deleteTransaction,
      updateTransaction
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
