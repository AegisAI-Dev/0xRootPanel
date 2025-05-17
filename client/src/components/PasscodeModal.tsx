import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useConfig } from '@/contexts/ConfigContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PasscodeModalProps {
  isOpen: boolean;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({ isOpen }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checkPasscode } = useConfig();

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    
    const isValid = await checkPasscode(passcode);
    
    if (!isValid) {
      setError(true);
      setIsSubmitting(false);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800">
        <div className="text-center mb-6">
          <div className="mb-4 text-primary-600 text-5xl">🔐</div>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">NeuralPanel</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Enter passcode to access dashboard</p>
        </div>
        
        <form onSubmit={handlePasscodeSubmit}>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-700 border border-transparent focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:text-white text-center text-lg tracking-widest"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Checking...' : 'Unlock Dashboard'}
          </Button>
        </form>
        
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center text-rose-500 flex items-center justify-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              <span>Incorrect passcode. Please try again.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
