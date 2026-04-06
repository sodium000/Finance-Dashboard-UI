import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import { gsap } from 'gsap';

import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import { FinanceProvider } from './store/FinanceContext';

const App = () => {
  useEffect(() => {
    gsap.to('.app-container', {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.2
    });
  }, []);

  return (
    <FinanceProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="app-container min-h-screen bg-slate-50 flex opacity-0 selection:bg-indigo-100">
          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0">
            <Navbar />

            <main className="p-4 sm:p-6 md:pl-4 md:pr-8 md:py-8 ml-0 md:ml-64 space-y-10 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/insights" element={<Insights />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </FinanceProvider>
  );
};

export default App;
