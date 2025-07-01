import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UsageData {
  used: number;
  total: number;
  unit: string;
  period: string;
}

export const TelenetUsageWidget: React.FC = () => {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/telenet-usage')
      .then(res => res.json())
      .then(json => {
        // Pas dit aan op basis van het echte response formaat
        setData({
          used: json?.internet?.used ?? 0,
          total: json?.internet?.total ?? 0,
          unit: json?.internet?.unit ?? 'GB',
          period: json?.internet?.period ?? '',
        });
        setError(null);
      })
      .catch(() => setError('Kan usage data niet ophalen'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      className="absolute top-16 right-8 z-30 bg-gradient-to-br from-yellow-400/80 to-pink-600/80 dark:from-yellow-500/80 dark:to-pink-700/80 rounded-xl shadow-xl px-6 py-3 w-[420px] h-[80px] border-2 border-pink-400/60 cyberpunk-glow flex flex-row items-center"
      initial={{ opacity: 0, y: -30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      <div className="flex items-center gap-3 mr-6">
        <span className="text-3xl animate-spin-slow">⚡</span>
        <span className="font-mono text-xl tracking-widest text-pink-900 dark:text-yellow-200 cyber-flicker">Telenet Usage</span>
      </div>
      <div className="flex-1 flex flex-col items-end justify-center">
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-yellow-900 dark:text-yellow-200 font-mono animate-pulse"
            >
              Laden...
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-700 dark:text-red-300 font-mono"
            >
              {error}
            </motion.div>
          ) : data ? (
            <motion.div
              key="data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-end"
            >
              <span className="text-2xl font-bold text-pink-700 dark:text-yellow-200">
                {Math.round((data.used / data.total) * 100)}%
              </span>
              <span className="text-xs font-mono text-pink-900 dark:text-yellow-100">
                {data.used} / {data.total} {data.unit}
              </span>
              <span className="text-xs font-mono text-pink-900 dark:text-yellow-100 opacity-80">
                Periode: {data.period}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 