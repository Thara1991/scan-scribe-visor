import { useState, useEffect } from "react";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { MainInterface } from "@/components/layout/MainInterface";
import { LoginResponse } from "@/lib/api";
import { SessionManager, UserSession } from "@/lib/session";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on component mount
  useEffect(() => {
    const existingSession = SessionManager.getSession();
    if (existingSession) {
      setCurrentUser(existingSession);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: LoginResponse) => {
    // Save session
    SessionManager.saveSession(userData);
    
    // Update state
    const session = SessionManager.getSession();
    setCurrentUser(session);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear session
    SessionManager.clearSession();
    
    // Update state
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Show loading while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-panel to-muted flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-medical animate-pulse">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <MainInterface currentUser={currentUser?.userName || ''} onLogout={handleLogout} />
      )}
    </>
  );
};

export default Index;
