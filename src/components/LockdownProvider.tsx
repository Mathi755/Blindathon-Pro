
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, AlertCircle } from 'lucide-react';

// Context type definitions
type LockdownContextType = {
  isLocked: boolean;
  requestExit: () => void;
};

// Create the context with default values
const LockdownContext = createContext<LockdownContextType>({
  isLocked: false,
  requestExit: () => {},
});

// Custom hook to use the lockdown context
export const useLockdown = () => useContext(LockdownContext);

// Admin password - in a real app, this would be stored securely
const ADMIN_PASSWORD = 'admin123';

export const LockdownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  
  // Function to handle exit request
  const requestExit = () => {
    setShowExitDialog(true);
    setPassword('');
    setPasswordError(false);
  };
  
  // Function to verify admin password
  const handleVerifyPassword = () => {
    if (password === ADMIN_PASSWORD) {
      setIsLocked(false);
      setShowExitDialog(false);
      toast.success('Lockdown disabled by admin');
      // In a real app, you might want to log this action
    } else {
      setPasswordError(true);
      toast.error('Incorrect admin password');
    }
  };
  
  // Handle browser back/forward buttons and tab closing
  useEffect(() => {
    if (!isLocked) return;
    
    // Handle page visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isLocked) {
        toast('Attempting to leave the secure environment', {
          description: 'This action will be logged',
          icon: <AlertCircle className="text-yellow-500" />,
        });
      }
    };
    
    // Handle browser back button
    const handlePopState = (e: PopStateEvent) => {
      if (isLocked) {
        e.preventDefault();
        toast.warning('Navigation blocked in secure environment', {
          description: 'Admin approval required to exit',
        });
        // Push a new state to prevent going back
        window.history.pushState(null, '', window.location.pathname);
      }
    };
    
    // Handle beforeunload (closing the tab or browser)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLocked) {
        e.preventDefault();
        // Standard way to show a confirmation dialog when leaving
        e.returnValue = 'Changes you made may not be saved.';
        return e.returnValue;
      }
    };
    
    // Add all event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Initial push state to prevent leaving
    window.history.pushState(null, '', window.location.pathname);
    
    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isLocked]);
  
  return (
    <LockdownContext.Provider value={{ isLocked, requestExit }}>
      {children}
      
      {/* Admin Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-slate-900 border border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Lock className="text-red-500" size={20} />
              Admin Authentication Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Enter the admin password to exit the secure coding environment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`bg-slate-800 border ${passwordError ? 'border-red-600' : 'border-slate-700'}`}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">Incorrect password. Please try again.</p>
            )}
          </div>
          
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleVerifyPassword}
            >
              Verify & Exit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Lockdown Status Indicator */}
      {isLocked && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-full border border-slate-700 shadow-lg z-50">
          <Lock size={16} className="text-red-500" />
          <span className="text-xs text-slate-300">Secure Mode Active</span>
        </div>
      )}
    </LockdownContext.Provider>
  );
};

export default LockdownProvider;
