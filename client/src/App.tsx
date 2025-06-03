import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { Dashboard } from '@/pages/Dashboard';
import { Settings } from '@/pages/Settings';
import { About } from '@/pages/About';
import { Sidebar } from '@/components/Sidebar';
import { PasscodeModal } from '@/components/PasscodeModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import '@/styles/cyberpunk.css';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Fetch config on mount to check if passcode is enabled
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        
        // Check for stored authentication
        const hasAuth = localStorage.getItem('neuralPanelAuthenticated') === 'true';
        if (data.require_passcode && !hasAuth) {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
    
    fetchConfig();
  }, []);

  // Handle responsive sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    setIsPasscodeModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <PasscodeModal 
        isOpen={isPasscodeModalOpen} 
        onAuthenticate={handleAuthenticate} 
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
        
        <Switch>
          <Route path="/" component={() => <Dashboard toggleSidebar={toggleSidebar} />} />
          <Route path="/settings" component={() => <Settings toggleSidebar={toggleSidebar} />} />
          <Route path="/about" component={() => <About toggleSidebar={toggleSidebar} />} />
        </Switch>
      </div>
    </ErrorBoundary>
  );
}

export default App;
