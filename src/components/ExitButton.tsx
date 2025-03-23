
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useLockdown } from './LockdownProvider';

const ExitButton: React.FC = () => {
  const { requestExit } = useLockdown();
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={requestExit} 
      className="border-red-700 hover:bg-red-900/30 text-red-500"
    >
      <LogOut size={16} className="mr-1" />
      Exit Secure Mode
    </Button>
  );
};

export default ExitButton;
