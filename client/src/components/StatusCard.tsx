import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AppWindow, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  count: number;
  type: 'total' | 'online' | 'offline';
}

export const StatusCard: React.FC<StatusCardProps> = ({ title, count, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'total':
        return <AppWindow className="h-5 w-5" />;
      case 'online':
        return <CheckCircle className="h-5 w-5" />;
      case 'offline':
        return <XCircle className="h-5 w-5" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'total':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400';
      case 'online':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500';
      case 'offline':
        return 'bg-rose-50 dark:bg-rose-500/10 text-rose-500';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'total':
        return 'text-slate-800 dark:text-white';
      case 'online':
        return 'text-emerald-500';
      case 'offline':
        return 'text-rose-500';
    }
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardContent className="p-4">
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-end justify-between">
          <div className={cn("text-3xl font-semibold", getTextColor())}>{count}</div>
          <div className={cn("p-1.5 rounded-lg", getBgColor())}>
            {getIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
