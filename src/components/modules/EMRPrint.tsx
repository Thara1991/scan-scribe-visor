import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Printer, 
  Search, 
  Filter,
  FileText,
  Calendar,
  User,
  Stethoscope,
  Download,
  Eye,
  CheckSquare
} from "lucide-react";
import { PatientMainInfo } from "@/types/patient";

interface EMRPrintProps {
  currentPatient: string;
  patientData: PatientMainInfo | null;
}

export const EMRPrint = ({ currentPatient, patientData }: EMRPrintProps) => {
  const [searchHN, setSearchHN] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [filterType, setFilterType] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  // Mock data
  const mockPatient = {
    hn: "HN001234",
    name: "John Doe",
    age: 45,
    gender: "Male"
  };

  const mockReports = [
    {
      id: "rpt_001",
      type: "Lab Report",
      title: "Complete Blood Count",
      doctor: "Dr. Smith",
      date: "2024-01-15",
      status: "Final",
      pages: 2
    },
    {
      id: "rpt_002", 
      type: "X-Ray Report",
      title: "Chest X-Ray Analysis",
      doctor: "Dr. Johnson",
      date: "2024-01-15",
      status: "Final",
      pages: 1
    },
    {
      id: "rpt_003",
      type: "Prescription",
      title: "Medication List",
      doctor: "Dr. Smith",
      date: "2024-01-15",
      status: "Active",
      pages: 1
    },
    {
      id: "rpt_004",
      type: "Lab Report",
      title: "Liver Function Test",
      doctor: "Dr. Wilson",
      date: "2024-01-12",
      status: "Final",
      pages: 3
    },
    {
      id: "rpt_005",
      type: "Consultation Note",
      title: "Cardiology Consultation",
      doctor: "Dr. Brown",
      date: "2024-01-10",
      status: "Final",
      pages: 2
    }
  ];

  const reportTypes = ["Lab Report", "X-Ray Report", "Prescription", "Consultation Note", "Discharge Summary"];
  const doctors = ["Dr. Smith", "Dr. Johnson", "Dr. Wilson", "Dr. Brown", "Dr. Davis"];

  const handleSearch = () => {
    if (searchHN) {
      setSelectedPatient(searchHN);
    }
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    const filteredReports = getFilteredReports();
    const allSelected = filteredReports.every(report => selectedReports.includes(report.id));
    
    if (allSelected) {
      setSelectedReports(prev => prev.filter(id => !filteredReports.some(report => report.id === id)));
    } else {
      setSelectedReports(prev => [...new Set([...prev, ...filteredReports.map(report => report.id)])]);
    }
  };

  const getFilteredReports = () => {
    return mockReports.filter(report => {
      const typeMatch = !filterType || report.type === filterType;
      const doctorMatch = !filterDoctor || report.doctor === filterDoctor;
      const dateFromMatch = !filterDateFrom || new Date(report.date) >= new Date(filterDateFrom);
      const dateToMatch = !filterDateTo || new Date(report.date) <= new Date(filterDateTo);
      
      return typeMatch && doctorMatch && dateFromMatch && dateToMatch;
    });
  };

  const filteredReports = getFilteredReports();

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Printer className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">EMR Print Module</h2>
      </div>

      {/* Patient Search */}
      <Card className="border-border shadow-panel">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Patient Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label className="text-sm font-medium">Hospital Number (HN)</Label>
              <Input
                placeholder="Enter Hospital Number"
                value={searchHN}
                onChange={(e) => setSearchHN(e.target.value)}
                className="mt-1 bg-input border-border"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                className="bg-primary hover:bg-primary-hover"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Info */}
      {selectedPatient && (
        <Card className="border-border shadow-panel">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">HN:</span>
                <div className="font-mono font-semibold">{mockPatient.hn}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Name:</span>
                <div className="font-semibold">{mockPatient.name}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Age:</span>
                <div>{mockPatient.age} years</div>
              </div>
              <div>
                <span className="text-muted-foreground">Gender:</span>
                <div>{mockPatient.gender}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      {selectedPatient && (
        <Card className="border-border shadow-panel">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Report Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="mt-1 bg-input border-border">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {reportTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Doctor</Label>
                <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                  <SelectTrigger className="mt-1 bg-input border-border">
                    <SelectValue placeholder="All Doctors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Doctors</SelectItem>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Date From</Label>
                <Input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="mt-1 bg-input border-border"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Date To</Label>
                <Input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="mt-1 bg-input border-border"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      {selectedPatient && (
        <Card className="border-border shadow-panel flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Patient Reports ({filteredReports.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="flex items-center gap-2"
                >
                  <CheckSquare className="w-4 h-4" />
                  {filteredReports.every(report => selectedReports.includes(report.id)) ? "Deselect All" : "Select All"}
                </Button>
                <Button
                  className="bg-primary hover:bg-primary-hover"
                  disabled={selectedReports.length === 0}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Selected ({selectedReports.length})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={`
                    flex items-center gap-4 p-3 rounded-lg border transition-colors cursor-pointer
                    ${selectedReports.includes(report.id) 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-card border-border hover:bg-muted/50"
                    }
                  `}
                  onClick={() => handleSelectReport(report.id)}
                >
                  <Checkbox 
                    checked={selectedReports.includes(report.id)}
                    onChange={() => handleSelectReport(report.id)}
                  />
                  
                  <div className="flex-1 grid grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <Badge variant="outline" className="text-xs mt-1">{report.type}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-muted-foreground" />
                      <span>{report.doctor}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span>{report.date}</span>
                    </div>
                    
                    <div>
                      <Badge 
                        variant={report.status === "Final" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {report.status}
                      </Badge>
                    </div>
                    
                    <div className="text-muted-foreground">
                      {report.pages} page{report.pages !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedPatient && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Printer className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">EMR Print Module</h3>
              <p className="text-muted-foreground">
                Search for a patient to view and print their medical reports
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};