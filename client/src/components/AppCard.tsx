import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { type AppWithStatus } from '@/types';
import { cn } from '@/lib/utils';

interface AppCardProps {
  app: AppWithStatus;
}

export const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const { name, description, url, icon, status } = app;

  const getStatusStyles = () => {
    switch (status) {
      case 'online':
        return {
          bgClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
          dotClass: 'bg-emerald-500',
          text: 'Online'
        };
      case 'offline':
        return {
          bgClass: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
          dotClass: 'bg-rose-500',
          text: 'Offline'
        };
      case 'loading':
        return {
          bgClass: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
          dotClass: 'bg-amber-500 animate-pulse',
          text: 'Loading'
        };
    }
  };
  
  const { bgClass, dotClass, text } = getStatusStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full">
        <div className="flex flex-col h-full">
          <div className="p-4 flex-grow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="text-3xl mr-3">{icon}</div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-white">{name}</h3>
              </div>
              <div className="flex-shrink-0">
                <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", bgClass)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full mr-1", dotClass)}></span>
                  {text}
                </span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm">{description}</p>
          </div>
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors"
            >
              Open
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
              aria-label={`Open ${name}`}
            >
              <Eye className="h-5 w-5" />
            </a>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
