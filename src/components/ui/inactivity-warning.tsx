import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock } from 'lucide-react';

interface InactivityWarningProps {
  isOpen: boolean;
  onStayActive: () => void;
  onLogout: () => void;
  timeRemaining: number;
}

export const InactivityWarning = ({ isOpen, onStayActive, onLogout, timeRemaining }: InactivityWarningProps) => {
  const [countdown, setCountdown] = useState(30); // 30 second warning
  const progress = ((30 - countdown) / 30) * 100;

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onLogout();
    }
  }, [isOpen, countdown, onLogout]);

  const handleStayActive = () => {
    onStayActive();
    setCountdown(30); // Reset countdown
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Session Timeout Warning
          </DialogTitle>
          <DialogDescription>
            You have been inactive for {Math.floor(timeRemaining / 60000)} minutes. 
            Your session will automatically end in {countdown} seconds for security reasons.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Time remaining:</span>
              <span className="font-mono">{countdown}s</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleStayActive} className="flex-1">
              Stay Active
            </Button>
            <Button variant="outline" onClick={onLogout} className="flex-1">
              Logout Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
