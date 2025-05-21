import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { QueryProvider } from '@/context/QueryContext';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import HistoryPage from '@/pages/HistoryPage';
import AdminPage from '@/pages/AdminPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'history' | 'admin'>('home');
  
  // Handle navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/admin') {
        setCurrentPage('admin');
      } else if (hash === '#/history') {
        setCurrentPage('history');
      } else {
        setCurrentPage('home');
      }
    };

    // Set initial page based on hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Cleanup listener
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <ThemeProvider>
      <QueryProvider>
        <Layout>
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'history' && <HistoryPage />}
          {currentPage === 'admin' && <AdminPage />}
        </Layout>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;