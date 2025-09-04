import { useEffect, useRef } from 'react';
import { SessionManager } from '@/lib/session';

export const useActivityTracker = (onInactivity: () => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  // const INACTIVITY_TIMEOUT = 5000; // 5 seconds

  const resetTimer = () => {
    console.log('Activity detected - resetting timer');
    
    // Update activity in session
    SessionManager.updateActivity();
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      console.log('Inactivity timeout reached - triggering warning');
      onInactivity();
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    console.log('Setting up activity tracker with', INACTIVITY_TIMEOUT, 'ms timeout');
    
    // Events to track for user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus',
      'input',
      'change'
    ];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onInactivity]);

  return { resetTimer };
};
