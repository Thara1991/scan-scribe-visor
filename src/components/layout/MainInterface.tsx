import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Monitor, 
  FileImage, 
  Printer, 
  Settings, 
  User, 
  LogOut,
  Search,
  Hospital
} from "lucide-react";
import { EMRViewer } from "../modules/EMRViewer";
import { EMRPrint } from "../modules/EMRPrint";
import { AdminTools } from "../modules/AdminTools";

interface MainInterfaceProps {
  currentUser: string;
  onLogout: () => void;
}

type ModuleType = "viewer" | "print" | "admin";

export const MainInterface = ({ currentUser, onLogout }: MainInterfaceProps) => {
  const [activeModule, setActiveModule] = useState<ModuleType>("viewer");

  const modules = [
    {
      id: "viewer" as ModuleType,
      name: "EMR Viewer",
      icon: FileImage,
      description: "View and annotate patient documents"
    },
    {
      id: "print" as ModuleType,
      name: "EMR Print",
      icon: Printer,
      description: "Print patient reports and documents"
    },
    {
      id: "admin" as ModuleType,
      name: "Admin Tools",
      icon: Settings,
      description: "System administration and user management"
    }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case "viewer":
        return <EMRViewer />;
      case "print":
        return <EMRPrint />;
      case "admin":
        return <AdminTools />;
      default:
        return <EMRViewer />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header/Menu Bar */}
      <header className="bg-toolbar border-b border-toolbar-border shadow-panel">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-toolbar-foreground">Image EMR System</h1>
                <p className="text-xs text-muted-foreground">Electronic Medical Records</p>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-panel rounded-lg border border-panel-border">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-panel-foreground">{currentUser}</span>
                <Badge variant="secondary" className="text-xs">Online</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              
              return (
                <Button
                  key={module.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveModule(module.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all
                    ${isActive 
                      ? "bg-primary text-primary-foreground shadow-medical" 
                      : "text-toolbar-foreground hover:bg-panel hover:text-panel-foreground"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {module.name}
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-viewer p-4">
        <div className="h-full bg-card rounded-lg border border-border shadow-panel">
          {renderActiveModule()}
        </div>
      </main>

      {/* Status Bar */}
      <footer className="bg-toolbar border-t border-toolbar-border px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Hospital className="w-3 h-3" />
              Connected to EMR Database
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>Module: {modules.find(m => m.id === activeModule)?.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Ready</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};