import { useState } from "react";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { MainInterface } from "@/components/layout/MainInterface";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = (uid: string) => {
    setCurrentUser(uid);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser("");
    setIsAuthenticated(false);
  };

  return (
    <>
      {!isAuthenticated ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <MainInterface currentUser={currentUser} onLogout={handleLogout} />
      )}
    </>
  );
};

export default Index;
