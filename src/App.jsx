import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import { gsap } from 'gsap';

const Transactions = () => (
  <div className="p-10 text-center animate-pulse">
    <h2 className="text-3xl font-black text-slate-800">Transactions Management</h2>
    <p className="mt-4 text-slate-500 italic">This section will include advanced table features, bulk actions, and deep filtering.</p>
  </div>
);

const Insights = () => (
  <div className="p-10 text-center animate-pulse">
    <h2 className="text-3xl font-black text-slate-800">Financial Insights</h2>
    <p className="mt-4 text-slate-500 italic">Generating personalized AI insights based on your spending patterns...</p>
  </div>
);

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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-container min-h-screen bg-slate-50 flex opacity-0"> 
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="p-6 sm:p-10 ml-0 md:ml-64 space-y-10 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/insights" element={<Insights />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
