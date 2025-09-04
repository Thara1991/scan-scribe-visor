// Session management utilities
import { LoginResponse } from './api';

export interface UserSession {
  userID: string;
  userName: string;
  loginTime: string;
  isAuthenticated: boolean;
  expiresAt?: string; // Optional expiration time
  lastActivity?: string; // Track last user activity
}

class SessionManager {
  private static SESSION_KEY = 'emr_user_session';
  private static SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private static INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
  private static activityCallbacks: (() => void)[] = [];

  // Save session to localStorage
  static saveSession(userData: LoginResponse): void {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_TIMEOUT);
    
    const session: UserSession = {
      userID: userData.userID,
      userName: userData.userName,
      loginTime: now.toISOString(),
      isAuthenticated: true,
      expiresAt: expiresAt.toISOString(),
      lastActivity: now.toISOString(),
    };
    
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  // Update last activity time
  static updateActivity(): void {
    const session = this.getSession();
    if (session) {
      session.lastActivity = new Date().toISOString();
      try {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      } catch (error) {
        console.error('Failed to update activity:', error);
      }
    }
  }

  // Get session from localStorage
  static getSession(): UserSession | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData) as UserSession;
        
        // Check if session is still valid
        if (session.isAuthenticated && session.expiresAt) {
          const now = new Date();
          const expiresAt = new Date(session.expiresAt);
          
          if (now < expiresAt) {
            return session;
          } else {
            // Session expired, clear it
            this.clearSession();
          }
        }
      }
    } catch (error) {
      console.error('Failed to get session:', error);
    }
    
    return null;
  }

  // Check if session is inactive
  static isSessionInactive(): boolean {
    const session = this.getSession();
    if (!session || !session.lastActivity) return true;
    
    const now = new Date();
    const lastActivity = new Date(session.lastActivity);
    const timeSinceActivity = now.getTime() - lastActivity.getTime();
    
    return timeSinceActivity > this.INACTIVITY_TIMEOUT;
  }

  // Clear session (logout)
  static clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  // Get current user info
  static getCurrentUser(): UserSession | null {
    return this.getSession();
  }

  // Get session duration
  static getSessionDuration(): string {
    const session = this.getSession();
    if (!session) return '0 minutes';
    
    const loginTime = new Date(session.loginTime);
    const now = new Date();
    const diffMs = now.getTime() - loginTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  }

  // Get time since last activity
  static getTimeSinceLastActivity(): string {
    const session = this.getSession();
    if (!session || !session.lastActivity) return 'Unknown';
    
    const now = new Date();
    const lastActivity = new Date(session.lastActivity);
    const diffMs = now.getTime() - lastActivity.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    if (diffMinutes === 0) {
      return `${diffSeconds}s`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ${diffSeconds}s`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  }

  // Register activity callback
  static onActivityChange(callback: () => void): void {
    this.activityCallbacks.push(callback);
  }

  // Trigger activity callbacks
  static triggerActivityCallbacks(): void {
    this.activityCallbacks.forEach(callback => callback());
  }

  // Extend session (optional: call this periodically to keep session alive)
  static extendSession(): void {
    const session = this.getSession();
    if (session) {
      this.saveSession({ userID: session.userID, userName: session.userName });
    }
  }
}

export { SessionManager };
