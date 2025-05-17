import React from 'react';
import { Header } from '@/components/Header';
import { StatusCard } from '@/components/StatusCard';
import { AppCard } from '@/components/AppCard';
import { useConfig } from '@/contexts/ConfigContext';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import { motion } from 'framer-motion';

interface DashboardProps {
  toggleSidebar: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ toggleSidebar }) => {
  const { apps, lastUpdated, statusSummary } = useConfig();

  const formattedLastChecked = lastUpdated 
    ? formatTimeAgo(lastUpdated) 
    : 'never';

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <Header title="Dashboard" toggleSidebar={toggleSidebar} />
      
      <div className="p-4 md:p-6">
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
          <h2 className="text-lg font-medium text-slate-800 dark:text-white">Self-Hosted Applications</h2>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Last checked: <span>{formattedLastChecked}</span>
          </div>
        </div>

        {/* App Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {apps.map((app, index) => (
            <AppCard key={`${app.name}-${index}`} app={app} />
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
