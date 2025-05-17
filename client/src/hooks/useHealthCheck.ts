import { useState, useEffect } from 'react';
import { Status } from '@/types';

export function useHealthCheck(url: string, refreshInterval = 60000) {
  const [status, setStatus] = useState<Status>('loading');
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const checkStatus = async () => {
    try {
      setStatus('loading');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`/api/check-status?url=${encodeURIComponent(url)}`);
      clearTimeout(timeoutId);
      
      const data = await response.json();
      setStatus(data.status);
      setLastChecked(new Date());
    } catch (error) {
      setStatus('offline');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkStatus();
    
    const intervalId = setInterval(() => {
      checkStatus();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [url, refreshInterval]);

  return { status, lastChecked, refreshStatus: checkStatus };
}
