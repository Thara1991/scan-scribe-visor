import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Users, 
  UserPlus,
  UserX,
  Edit,
  Shield,
  Database,
  Activity,
  BarChart3,
  FileText,
  Calendar,
  AlertTriangle
} from "lucide-react";

export const AdminTools = () => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserUid, setNewUserUid] = useState("");
  const [newUserRole, setNewUserRole] = useState("");

  // Mock data
  const mockUsers = [
    {
      id: "u001",
      uid: "admin001",
      name: "Dr. Sarah Wilson",
      role: "Administrator",
      department: "IT",
      active: true,
      lastLogin: "2024-01-15 09:30"
    },
    {
      id: "u002", 
      uid: "doc001",
      name: "Dr. John Smith",
      role: "Doctor",
      department: "Cardiology",
      active: true,
      lastLogin: "2024-01-15 14:20"
    },
    {
      id: "u003",
      uid: "nurse001", 
      name: "Mary Johnson",
      role: "Nurse",
      department: "Emergency",
      active: true,
      lastLogin: "2024-01-15 11:45"
    },
    {
      id: "u004",
      uid: "tech001",
      name: "Robert Davis",
      role: "Technician",
      department: "Radiology",
      active: false,
      lastLogin: "2024-01-10 16:30"
    }
  ];

  const mockDoctors = [
    { id: "d001", code: "SMITH", name: "Dr. John Smith", department: "Cardiology" },
    { id: "d002", code: "JOHNSON", name: "Dr. Emily Johnson", department: "Radiology" },
    { id: "d003", code: "WILSON", name: "Dr. Sarah Wilson", department: "Emergency" },
    { id: "d004", code: "BROWN", name: "Dr. Michael Brown", department: "Surgery" }
  ];

  const mockSystemStats = {
    totalUsers: 24,
    activeUsers: 18,
    totalPatients: 1247,
    todayVisits: 42,
    systemUptime: "99.8%",
    diskUsage: "68%"
  };

  const handleToggleUser = (userId: string) => {
    // Toggle user active status
    console.log("Toggle user:", userId);
  };

  const handleAddUser = () => {
    if (newUserName && newUserUid && newUserRole) {
      console.log("Add user:", { name: newUserName, uid: newUserUid, role: newUserRole });
      setNewUserName("");
      setNewUserUid("");
      setNewUserRole("");
    }
  };

  return (
    <div className="h-full p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Admin Tools</h2>
          <Badge variant="secondary" className="ml-2">Administrator Only</Badge>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="doctors" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Doctor Master
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              System Status
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Admin Reports
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Add New User */}
            <Card className="border-border shadow-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  Add New User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">User ID</Label>
                    <Input
                      placeholder="Enter User ID"
                      value={newUserUid}
                      onChange={(e) => setNewUserUid(e.target.value)}
                      className="mt-1 bg-input border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <Input
                      placeholder="Enter Full Name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="mt-1 bg-input border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Role</Label>
                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                      <SelectTrigger className="mt-1 bg-input border-border">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrator">Administrator</SelectItem>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Nurse">Nurse</SelectItem>
                        <SelectItem value="Technician">Technician</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleAddUser}
                      className="bg-primary hover:bg-primary-hover w-full"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card className="border-border shadow-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  System Users ({mockUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-panel rounded-lg border border-panel-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="grid grid-cols-4 gap-8 flex-1">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground font-mono">{user.uid}</div>
                          </div>
                          <div>
                            <Badge variant={user.role === "Administrator" ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">{user.department}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Last Login</div>
                            <div className="text-sm">{user.lastLogin}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.active}
                              onCheckedChange={() => handleToggleUser(user.id)}
                            />
                            <span className="text-sm">
                              {user.active ? "Active" : "Disabled"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <UserX className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doctor Master Tab */}
          <TabsContent value="doctors" className="space-y-6">
            <Card className="border-border shadow-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Doctor Master List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="flex items-center justify-between p-4 bg-panel rounded-lg border border-panel-border"
                    >
                      <div className="grid grid-cols-3 gap-8 flex-1">
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground font-mono">{doctor.code}</div>
                        </div>
                        <div>
                          <Badge variant="outline">{doctor.department}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="bg-success">Active</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Status Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <Card className="border-border shadow-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-primary" />
                    User Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Users:</span>
                    <span className="font-semibold">{mockSystemStats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Users:</span>
                    <span className="font-semibold text-success">{mockSystemStats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inactive Users:</span>
                    <span className="font-semibold text-warning">
                      {mockSystemStats.totalUsers - mockSystemStats.activeUsers}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-primary" />
                    System Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Patients:</span>
                    <span className="font-semibold">{mockSystemStats.totalPatients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Today's Visits:</span>
                    <span className="font-semibold text-accent">{mockSystemStats.todayVisits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">System Uptime:</span>
                    <span className="font-semibold text-success">{mockSystemStats.systemUptime}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="w-5 h-5 text-primary" />
                    System Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Disk Usage:</span>
                    <span className="font-semibold text-warning">{mockSystemStats.diskUsage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database Status:</span>
                    <Badge variant="default" className="bg-success">Online</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Backup Status:</span>
                    <Badge variant="default" className="bg-success">Current</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Alerts */}
            <Card className="border-border shadow-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span className="text-sm">Disk usage approaching 70% - consider cleanup</span>
                    <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                  </div>
                  <div className="text-sm text-muted-foreground p-3 text-center">
                    All other systems operating normally
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="border-border shadow-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Administrative Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8 text-primary" />
                    <span>User Activity Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center gap-2">
                    <Calendar className="w-8 h-8 text-primary" />
                    <span>System Usage Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center gap-2">
                    <Database className="w-8 h-8 text-primary" />
                    <span>Database Statistics</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center gap-2">
                    <Shield className="w-8 h-8 text-primary" />
                    <span>Security Audit Log</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};