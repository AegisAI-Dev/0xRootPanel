import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasscodeModalProps {
  isOpen: boolean;
  onAuthenticate?: () => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({ isOpen, onAuthenticate }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    
    try {
      const res = await fetch('/api/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      
      const data = await res.json();
      
      if (data.valid) {
        if (onAuthenticate) {
          onAuthenticate();
        }
      } else {
        setError(true);
        setTimeout(() => setError(false), 3000);
      }
    } catch (error) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogTitle className="sr-only">Authentication Required</DialogTitle>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800" aria-describedby="passcode-modal-description">
        <div className="text-center mb-6">
          <div className="mb-4 text-primary-600 text-5xl">🔐</div>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white" id="passcode-dialog-title">NeuralPanel</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2" id="passcode-modal-description">Enter passcode to access dashboard</p>
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
