import { useState, useEffect } from 'react';
import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import { Dashboard } from '@/pages/Dashboard';
import { Settings } from '@/pages/Settings';
import { Sidebar } from '@/components/Sidebar';
import { PasscodeModal } from '@/components/PasscodeModal';

function Router({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <Switch>
      <Route path="/" component={() => <Dashboard toggleSidebar={toggleSidebar} />} />
      <Route path="/settings" component={() => <Settings toggleSidebar={toggleSidebar} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for now
  const [hasPasscodeEnabled, setHasPasscodeEnabled] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Fetch config on mount to check if passcode is enabled
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        setHasPasscodeEnabled(Boolean(data.require_passcode));
        
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

  // Simple function to handle authentication
  const handleAuthentication = () => {
    setIsAuthenticated(true);
    localStorage.setItem('neuralPanelAuthenticated', 'true');
  };

  return (
    <>
      <PasscodeModal 
        isOpen={hasPasscodeEnabled && !isAuthenticated} 
        onAuthenticate={handleAuthentication} // Pass this to the modal
      />
      
      <div className="flex h-screen overflow-hidden">
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        
        <div className="flex-1 overflow-hidden">
          {isAuthenticated ? <Router toggleSidebar={toggleSidebar} /> : null}
        </div>
      </div>
    </>
  );
}

export default App;
