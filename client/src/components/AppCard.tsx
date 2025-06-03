import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Eye, ExternalLink } from 'lucide-react';
import { type AppWithStatus } from '@/types';
import { cn } from '@/lib/utils';

interface AppCardProps {
  app: AppWithStatus;
}

export const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const { name, url, icon, status, description } = app;
  
  const getStatusStyles = () => {
    switch (status) {
      case 'online':
        return {
          bgClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
          dotClass: 'status-online',
          text: 'Online'
        };
      case 'offline':
        return {
          bgClass: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
          dotClass: 'status-offline',
          text: 'Offline'
        };
      case 'loading':
        return {
          bgClass: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
          dotClass: 'status-loading animate-pulse',
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
      <Card className="cyberpunk-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all overflow-hidden h-full">
        <div className="flex flex-col h-full">
          <div className="p-4 flex-grow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="text-3xl mr-3">{icon}</div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-white glitch-text" data-text={name}>{name}</h3>
              </div>
              <div className="flex-shrink-0">
                <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", bgClass)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full mr-1", dotClass)}></span>
                  {text}
                </span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-mono">{description}</p>
            <div className="mt-2 text-xs font-mono text-slate-500 dark:text-primary/60 overflow-hidden">
              <span className="opacity-70">ID::</span> {(name + url).split('').map(c => c.charCodeAt(0).toString(16)).join('').substring(0, 16)}
            </div>
            <div className="code-block">
              <div className="opacity-70"># service status check</div>
              <div className="flex justify-between">
                <span>$ ping {url.replace(/https?:\/\//g, '')}</span>
                <span className={status === 'online' ? 'text-green-400' : 'text-red-400'}>
                  {status === 'online' ? '200 OK' : '503 ERR'}
                </span>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            {status === 'online' && (
              <button
                onClick={() => window.open(url, '_blank')}
                className="terminal-prompt text-primary text-sm font-mono font-medium hover:opacity-80 transition-opacity flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>EXECUTE</span>
              </button>
            )}
            <div className="flex items-center space-x-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="terminal-prompt text-primary text-sm font-mono font-medium hover:opacity-80 transition-opacity"
              >
                Access
              </a>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label={`Open ${name}`}
              >
                <Eye className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
