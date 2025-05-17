import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Config, Application, AppWithStatus, StatusSummary } from '@/types';

const defaultContextValue = {
  config: null,
  apps: [],
  isLoading: true,
  hasPasscodeEnabled: false,
  isAuthenticated: true, // Default to true for now to show the dashboard
  checkPasscode: async () => true,
  saveConfig: async () => true,
  lastUpdated: new Date(),
  refreshStatus: () => {},
  statusSummary: { total: 0, online: 0, offline: 0 }
};

// Creating context with default values to avoid undefined checks
const ConfigContext = createContext<{
  config: Config | null;
  apps: AppWithStatus[];
  isLoading: boolean;
  hasPasscodeEnabled: boolean;
  isAuthenticated: boolean;
  checkPasscode: (passcode: string) => Promise<boolean>;
  saveConfig: (newConfig: Config) => Promise<boolean>;
  lastUpdated: Date | null;
  refreshStatus: () => void;
  statusSummary: StatusSummary;
}>(defaultContextValue);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config | null>(null);
  const [apps, setApps] = useState<AppWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for now
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  // Status summary calculation
  const statusSummary: StatusSummary = {
    total: apps.length,
    online: apps.filter(app => app.status === 'online').length,
    offline: apps.filter(app => app.status === 'offline').length
  };

  // Simplified status refresh function
  const refreshStatus = async () => {
    if (!config) return;
    
    // Set apps to loading state first
    setApps(prevApps => 
      prevApps.map(app => ({
        ...app,
        status: 'loading'
      }))
    );

    try {
      // Fetch status for each app
      const newApps = config.apps.map(app => {
        // Simulate some apps being online and some offline
        const status = Math.random() > 0.5 ? 'online' : 'offline';
        return {
          ...app,
          status
        } as AppWithStatus;
      });
      
      setApps(newApps);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing status:', error);
    }
  };

  // Simple passcode verification
  const checkPasscode = async (passcode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      
      const data = await res.json();
      if (data.valid) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking passcode:', error);
      return false;
    }
  };

  // Simplified config saving
  const saveConfig = async (newConfig: Config): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      
      if (res.ok) {
        setConfig(newConfig);
        
        // Update apps with loading status
        const newApps = newConfig.apps.map(app => ({
          ...app,
          status: 'loading'
        } as AppWithStatus));
        
        setApps(newApps);
        await refreshStatus();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/config');
        const data = await res.json();
        
        setConfig(data);
        
        // Initialize apps with random status for demonstration
        const initialApps = data.apps.map((app: Application) => {
          const status = Math.random() > 0.5 ? 'online' : 'offline';
          return {
            ...app,
            status
          } as AppWithStatus;
        });
        
        setApps(initialApps);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfig();
  }, []);

  // Refresh status periodically
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const intervalId = setInterval(() => {
      refreshStatus();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, config]);

  const hasPasscodeEnabled = Boolean(config?.require_passcode);

  return (
    <ConfigContext.Provider value={{
      config,
      apps,
      isLoading,
      hasPasscodeEnabled,
      isAuthenticated,
      checkPasscode,
      saveConfig,
      lastUpdated,
      refreshStatus,
      statusSummary
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  return context;
}
