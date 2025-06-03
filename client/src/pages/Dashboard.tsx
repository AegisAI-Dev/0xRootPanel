import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { StatusCard } from '@/components/StatusCard';
import { AppCard } from '@/components/AppCard';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import { motion } from 'framer-motion';
import { AppWithStatus, StatusSummary } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardProps {
  toggleSidebar: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ toggleSidebar }) => {
  const [apps, setApps] = useState<AppWithStatus[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Calculate status summary based on apps array
  const statusSummary: StatusSummary = {
    total: apps.length,
    online: apps.filter(app => app.status === 'online').length,
    offline: apps.filter(app => app.status === 'offline').length
  };
  
  // Function to refresh app statuses
  const refreshStatus = async () => {
    try {
      setIsLoading(true);
      
      // Fetch configuration to get apps
      const configRes = await fetch('/api/config');
      
      if (!configRes.ok) {
        throw new Error(`Failed to fetch configuration: ${configRes.status}`);
      }
      
      const configData = await configRes.json();
      
      // Check status for each app
      const appsWithStatus = await Promise.all(
        configData.apps.map(async (app: any) => {
          try {
            const endpoint = app.status_endpoint || app.url;
            const res = await fetch(`/api/check-status?url=${encodeURIComponent(endpoint)}`);
            const data = await res.json();
            
            return {
              ...app,
              status: data.status
            };
          } catch (error) {
            console.error(`Error checking status for ${app.name}:`, error);
            return {
              ...app,
              status: 'offline'
            };
          }
        })
      );
      
      setApps(appsWithStatus);
      setLastUpdated(new Date());
      
      // Show success toast when manually refreshed (not on initial load)
      if (lastUpdated !== null) {
        toast({
          title: "Status Updated",
          description: `Updated status for ${appsWithStatus.length} applications`,
        });
      }
    } catch (error) {
      console.error('Error refreshing status:', error);
      toast({
        title: "Error",
        description: "Failed to refresh application status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load and periodic refresh
  useEffect(() => {
    refreshStatus();
    
    const intervalId = setInterval(() => {
      refreshStatus();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const formattedLastChecked = lastUpdated 
    ? formatTimeAgo(lastUpdated) 
    : 'never';

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 matrix-bg scan-line">
      <Header title="Dashboard" toggleSidebar={toggleSidebar} onRefresh={refreshStatus} />
      
      <div className="p-4 md:p-6">
        {/* ASCII Art Header */}
        <div className="hidden md:block mb-6">
          <pre className="text-primary text-xs font-mono opacity-70 leading-tight whitespace-pre overflow-x-auto">
{`
     ██████╗ ██╗  ██╗██████╗  ██████╗  ██████╗ ████████╗██████╗  █████╗ ███╗   ██╗███████╗██╗     
    ██╔═████╗╚██╗██╔╝██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██║     
    ██║██╔██║ ╚███╔╝ ██████╔╝██║   ██║██║   ██║   ██║   ██████╔╝███████║██╔██╗ ██║█████╗  ██║     
    ████╔╝██║ ██╔██╗ ██╔══██╗██║   ██║██║   ██║   ██║   ██╔═══╝ ██╔══██║██║╚██╗██║██╔══╝  ██║     
    ╚██████╔╝██╔╝ ██╗██║  ██║╚██████╔╝╚██████╔╝   ██║   ██║     ██║  ██║██║ ╚████║███████╗███████╗
     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝
                            [SYSTEM VERSION 3.7.2] - SECURE DASHBOARD ACCESS
`}
          </pre>
        </div>
        {/* Status Summary */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatusCard 
            title="Total Applications" 
            count={statusSummary.total} 
            type="total" 
          />
          <StatusCard 
            title="Online" 
            count={statusSummary.online} 
            type="online" 
          />
          <StatusCard 
            title="Offline" 
            count={statusSummary.offline} 
            type="offline" 
          />
        </motion.div>

        {/* Last Checked Timestamp */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-slate-800 dark:text-primary terminal-prompt hacker-typing">Self-Hosted Applications</h2>
          <div className="text-sm text-slate-500 dark:text-primary/80 cyber-flicker font-mono">
            [SYS::TIMESTAMP] <span className="text-primary">{formattedLastChecked}</span>
          </div>
        </div>

        {/* App Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {apps.map((app, index) => (
            <AppCard key={app.name} app={app} />
          ))}
          {apps.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400">
              No applications configured. Add some in Settings.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
