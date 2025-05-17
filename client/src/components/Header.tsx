import React from 'react';
import { MobileThemeToggle } from './ThemeToggle';
import { Menu, RefreshCw } from 'lucide-react';

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, toggleSidebar, onRefresh }) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 dark:border-primary/30 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3 md:py-4">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-3 md:hidden p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-primary/10 text-slate-500 dark:text-primary"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-primary md:hidden tracking-wide glitch-text" data-text="0xRootPanel">0xRootPanel</h1>
          <h1 className="text-xl font-bold text-slate-800 dark:text-primary hidden md:block tracking-wide glitch-text" data-text={title}>{title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
            title="Refresh Status"
            aria-label="Refresh status"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <div className="md:hidden">
            <MobileThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
