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
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 matrix-bg scan-line" aria-describedby="passcode-modal-description">
        <div className="text-center mb-6">
          <div className="mb-4 text-primary text-5xl cyber-flicker">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-primary glitch-text" data-text="NeuralPanel" id="passcode-dialog-title">NeuralPanel</h2>
          <p className="text-slate-600 dark:text-primary/80 mt-2 font-mono" id="passcode-modal-description">AUTHORIZATION REQUIRED</p>
        </div>
        
        <form onSubmit={handlePasscodeSubmit}>
          <div className="mb-4">
            <div className="code-block mb-3">
              <div className="opacity-70"># system authorization</div>
              <div>$ sudo access --auth-level=root</div>
            </div>
            <Input
              type="password"
              placeholder="ENTER_SECURE_PASSCODE"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-black/50 border border-transparent focus:border-primary focus:ring-2 focus:ring-primary dark:text-primary text-center text-lg tracking-widest font-mono"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          <Button 
            type="submit" 
            className="w-full neon-button bg-transparent border-primary text-primary py-3 px-4 uppercase tracking-widest font-mono"
            disabled={isSubmitting}
          >
            {isSubmitting ? '[ Authenticating... ]' : '[ Execute Authentication ]'}
          </Button>
        </form>
        
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 code-block text-destructive border-destructive/50"
            >
              <div className="text-xs opacity-80"># authentication failure</div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span className="font-mono">ERROR: INVALID_CREDENTIALS [code:403]</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
