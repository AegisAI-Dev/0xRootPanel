import React from 'react';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from './ThemeToggle';
import { ChevronLeft, LayoutDashboard, Settings, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const [location] = useLocation();

  return (
    <aside className={cn(
      "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-primary/20 fixed inset-y-0 left-0 z-20 transition-all duration-300 ease-in-out md:relative matrix-bg",
      isCollapsed ? "w-0 -translate-x-full md:w-0 md:translate-x-0" : "w-64 translate-x-0"
    )}>
      <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-primary/20">
        <div className="flex items-center space-x-3">
          <div className="text-2xl cyber-flicker">🧠</div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-primary glitch-text" data-text="0xRootPanel">0xRootPanel</h1>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-primary/10 text-slate-500 dark:text-primary relative group"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="absolute inset-0 rounded-md border border-primary/0 group-hover:border-primary/50 transition-all duration-300"></span>
        </button>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/">
              <div className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer",
                location === "/" 
                  ? "bg-primary-50 dark:bg-primary/10 text-primary-700 dark:text-primary border dark:border-primary/50" 
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-primary/5"
              )}>
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-mono tracking-wide">SYS://Dashboard</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <div className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer",
                location === "/settings" 
                  ? "bg-primary-50 dark:bg-primary/10 text-primary-700 dark:text-primary border dark:border-primary/50" 
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-primary/5"
              )}>
                <Settings className="h-5 w-5" />
                <span className="font-mono tracking-wide">CFG://Settings</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <div className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer",
                location === "/about" 
                  ? "bg-primary-50 dark:bg-primary/10 text-primary-700 dark:text-primary border dark:border-primary/50" 
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-primary/5"
              )}>
                <Info className="h-5 w-5" />
                <span className="font-mono tracking-wide">INFO://System</span>
              </div>
            </Link>
          </li>
        </ul>
        
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-primary/20">
          <div className="flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-primary/80 font-mono">
            <span className="terminal-prompt">SYSTEM::THEME</span>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </aside>
  );
};
