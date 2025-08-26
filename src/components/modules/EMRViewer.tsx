import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileText, 
  FolderOpen, 
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Type,
  Minus,
  Circle,
  Square,
  Palette,
  Download,
  User,
  Calendar,
  Hash
} from "lucide-react";

export const EMRViewer = () => {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [searchHN, setSearchHN] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [annotationTool, setAnnotationTool] = useState<string>("select");
  const [annotationColor, setAnnotationColor] = useState("#FF0000");

  // Mock data
  const mockPatient = {
    hn: "HN001234",
    name: "John Doe",
    age: 45,
    gender: "Male",
    lastVisit: "2024-01-15"
  };

  const mockDocuments = [
    {
      category: "Lab Reports",
      documents: [
        { id: "lab_001", name: "Blood Test - 2024-01-15", type: "PDF", size: "2.3 MB" },
        { id: "lab_002", name: "Urine Analysis - 2024-01-10", type: "PDF", size: "1.8 MB" }
      ]
    },
    {
      category: "X-Ray Images",
      documents: [
        { id: "xray_001", name: "Chest X-Ray - 2024-01-15", type: "DICOM", size: "15.2 MB" },
        { id: "xray_002", name: "Abdominal X-Ray - 2024-01-12", type: "DICOM", size: "18.7 MB" }
      ]
    },
    {
      category: "Prescriptions",
      documents: [
        { id: "rx_001", name: "Prescription - 2024-01-15", type: "PDF", size: "0.8 MB" },
        { id: "rx_002", name: "Prescription - 2024-01-08", type: "PDF", size: "0.9 MB" }
      ]
    }
  ];

  const annotationTools = [
    { id: "select", name: "Select", icon: User },
    { id: "text", name: "Text", icon: Type },
    { id: "line", name: "Line", icon: Minus },
    { id: "circle", name: "Circle", icon: Circle },
    { id: "rectangle", name: "Rectangle", icon: Square },
    { id: "color", name: "Color", icon: Palette }
  ];

  const handleSearch = () => {
    if (searchHN) {
      setSelectedPatient(searchHN);
    }
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Patient Search and Document Tree */}
      <div className="w-80 bg-panel border-r border-panel-border flex flex-col">
        {/* Patient Search */}
        <div className="p-4 border-b border-panel-border">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-panel-foreground">Patient Search</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter Hospital Number (HN)"
                value={searchHN}
                onChange={(e) => setSearchHN(e.target.value)}
                className="flex-1 bg-input border-border"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button 
                onClick={handleSearch}
                size="sm"
                className="bg-primary hover:bg-primary-hover"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Patient Info */}
        {selectedPatient && (
          <div className="p-4 border-b border-panel-border">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">HN:</span>
                  <Badge variant="outline" className="font-mono">{mockPatient.hn}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{mockPatient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{mockPatient.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span>{mockPatient.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Visit:</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {mockPatient.lastVisit}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Document Tree */}
        {selectedPatient && (
          <div className="flex-1 overflow-auto p-4">
            <Label className="text-sm font-semibold text-panel-foreground mb-3 block">Documents</Label>
            <div className="space-y-3">
              {mockDocuments.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-panel-foreground">
                    <FolderOpen className="w-4 h-4 text-accent" />
                    {category.category}
                  </div>
                  <div className="ml-6 space-y-1">
                    {category.documents.map((doc) => (
                      <Button
                        key={doc.id}
                        variant={selectedDocument === doc.id ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start h-auto p-2"
                        onClick={() => setSelectedDocument(doc.id)}
                      >
                        <div className="flex items-start gap-2 w-full">
                          <FileText className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                          <div className="flex-1 text-left">
                            <div className="text-xs font-medium">{doc.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {doc.type} • {doc.size}
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Image Viewer and Tools */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-toolbar border-b border-toolbar-border p-3">
          <div className="flex items-center justify-between">
            {/* Annotation Tools */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-toolbar-foreground">Tools:</Label>
              {annotationTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Button
                    key={tool.id}
                    variant={annotationTool === tool.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnnotationTool(tool.id)}
                    className="h-8 px-3"
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
              <Separator orientation="vertical" className="h-6 mx-2" />
              <input
                type="color"
                value={annotationColor}
                onChange={(e) => setAnnotationColor(e.target.value)}
                className="w-8 h-8 rounded border border-border cursor-pointer"
              />
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-toolbar-foreground px-2">100%</span>
              <Button variant="outline" size="sm" className="h-8">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <Button variant="outline" size="sm" className="h-8">
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image Viewer Area */}
        <div className="flex-1 bg-viewer p-6">
          {selectedDocument ? (
            <div className="h-full bg-white rounded-lg border border-border shadow-panel flex items-center justify-center">
              <div className="text-center space-y-4">
                <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-viewer-foreground">Document Viewer</h3>
                  <p className="text-muted-foreground">
                    Selected: {mockDocuments
                      .flatMap(cat => cat.documents)
                      .find(doc => doc.id === selectedDocument)?.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Image viewer with annotation tools will be displayed here
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div className="space-y-4">
                <Search className="w-16 h-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-viewer-foreground">EMR Viewer</h3>
                  <p className="text-muted-foreground">
                    Search for a patient using their Hospital Number (HN) to begin viewing documents
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};