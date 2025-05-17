import { useState, useEffect } from 'react';
import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import { Dashboard } from '@/pages/Dashboard';
import { Settings } from '@/pages/Settings';
import { Sidebar } from '@/components/Sidebar';
import { PasscodeModal } from '@/components/PasscodeModal';
import { useConfig } from '@/contexts/ConfigContext';

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
  const { hasPasscodeEnabled, isAuthenticated } = useConfig();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

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

  return (
    <>
      <PasscodeModal isOpen={hasPasscodeEnabled && !isAuthenticated} />
      
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
