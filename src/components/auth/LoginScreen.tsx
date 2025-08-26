import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Monitor, Shield, User } from "lucide-react";

interface LoginScreenProps {
  onLogin: (uid: string) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (uid && password) {
        if (password === "admin" || password === "user123") {
          onLogin(uid);
        } else {
          setError("Invalid credentials. Use 'admin' or 'user123' as password.");
        }
      } else {
        setError("Please enter both User ID and password.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-panel to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-medical">
            <Monitor className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Image EMR</h1>
          <p className="text-muted-foreground">Electronic Medical Record System</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-elevated border-panel-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Secure Login
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the EMR system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uid" className="text-sm font-medium">User ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="uid"
                    type="text"
                    placeholder="Enter your User ID"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    className="pl-10 bg-input border-border focus:ring-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border focus:ring-primary"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert className="border-destructive/20 bg-destructive/5">
                  <AlertDescription className="text-destructive text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-medical"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Login to EMR"}
              </Button>
            </form>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              Demo credentials: Use any User ID with password "admin" or "user123"
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};