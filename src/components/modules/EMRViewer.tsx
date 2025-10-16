import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ApiService, PatientMainInfoResponse } from "@/lib/api";
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
  Hash,
  Loader2,
  Plus,
  PenTool,
  Crop
} from "lucide-react";

interface EMRViewerProps {
  currentPatient: string;
  patientData: PatientMainInfoResponse | null;
  onPatientChange: (patient: string) => void;
  onPatientDataChange: (data: PatientMainInfoResponse | null) => void;
}

export const EMRViewer = ({ 
  currentPatient, 
  patientData, 
  onPatientChange, 
  onPatientDataChange 
}: EMRViewerProps) => {
  const [searchHN, setSearchHN] = useState("");
  const lastCurrentPatient = useRef<string>("");
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [annotationTool, setAnnotationTool] = useState<string>("select");
  const [annotationColor, setAnnotationColor] = useState("#FF0000");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWhiteScreen, setShowWhiteScreen] = useState(false);
  const [annotations, setAnnotations] = useState<Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    content?: string;
    color: string;
    width?: number;
    height?: number;
    endX?: number;
    endY?: number;
    points?: Array<{x: number, y: number}>; // For freehand drawing
  }>>([]);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<{
    id: string;
    type: string;
    startX: number;
    startY: number;
    color: string;
  } | null>(null);
  
  // Crop/Selection state
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [selectedAnnotations, setSelectedAnnotations] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  
  // Selection rectangle state
  const [selectionRect, setSelectionRect] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // Undo history for annotations
  const [history, setHistory] = useState<Array<typeof annotations>>([]);

  const deepCloneAnnotations = (arr: typeof annotations) => JSON.parse(JSON.stringify(arr));
  const pushHistory = () => setHistory(prev => [...prev, deepCloneAnnotations(annotations)]);
  const handleUndo = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setAnnotations(last);
      return prev.slice(0, -1);
    });
  };

  // Drawing helper functions
  const handleStartDrawing = (x: number, y: number) => {
    if (annotationTool === "crop") {
      // First try to find an annotation at click position
      const clickedAnnotation = annotations.find(ann => {
        if (ann.type === 'text') {
          // Text annotations - check if click is within text bounds
          const textWidth = (ann.content?.length || 0) * 8; // Approximate character width
          return x >= ann.x && x <= ann.x + textWidth && y >= ann.y && y <= ann.y + 20;
        } else if (ann.type === 'line') {
          // Line annotations - check if click is near the line
          const lineX1 = Math.min(ann.x, ann.endX || ann.x);
          const lineX2 = Math.max(ann.x, ann.endX || ann.x);
          const lineY1 = Math.min(ann.y, ann.endY || ann.y);
          const lineY2 = Math.max(ann.y, ann.endY || ann.y);
          
          // Check if point is within bounding box with some tolerance
          return x >= lineX1 - 5 && x <= lineX2 + 5 && y >= lineY1 - 5 && y <= lineY2 + 5;
        } else if (ann.type === 'circle' || ann.type === 'rectangle') {
          // Shape annotations - check if click is within shape bounds
          const shapeX1 = Math.min(ann.x, ann.endX || ann.x);
          const shapeX2 = Math.max(ann.x, ann.endX || ann.x);
          const shapeY1 = Math.min(ann.y, ann.endY || ann.y);
          const shapeY2 = Math.max(ann.y, ann.endY || ann.y);
          
          return x >= shapeX1 && x <= shapeX2 && y >= shapeY1 && y <= shapeY2;
        } else if (ann.type === 'freehand') {
          // Freehand annotations - check if click is near any point in the path
          if (ann.points && ann.points.length > 0) {
            return ann.points.some(point => {
              const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
              return distance < 10; // 10px tolerance
            });
          }
        }
        return false;
      });
      
      if (clickedAnnotation) {
        // Check if clicking on a selected annotation for dragging
        if (selectedAnnotations.includes(clickedAnnotation.id) || selectedAnnotation === clickedAnnotation.id) {
          // Start dragging the selected annotation(s)
          pushHistory();
          setIsDragging(true);
          setDragStart({x, y});
          console.log('Starting drag for selected annotation(s)');
        } else {
          // Select this single annotation
          setSelectedAnnotation(clickedAnnotation.id);
          setSelectedAnnotations([clickedAnnotation.id]);
          pushHistory();
          setIsDragging(true);
          setDragStart({x, y});
          console.log('Selected annotation for dragging:', clickedAnnotation.id);
        }
      } else {
        // Clicked on empty space - clear selection and start selection rectangle
        setSelectedAnnotation(null);
        setSelectedAnnotations([]);
        setIsSelecting(true);
        setSelectionRect({
          startX: x,
          startY: y,
          endX: x,
          endY: y
        });
        console.log('Starting selection rectangle at:', x, y);
      }
    } else if (annotationTool === "text") {
      pushHistory();
      const text = prompt("Enter text to add:");
      if (text) {
        const newAnnotation = {
          id: `text-${Date.now()}`,
          type: 'text',
          x: x - 10,
          y: y - 10,
          content: text,
          color: annotationColor
        };
        setAnnotations(prev => [...prev, newAnnotation]);
      }
    } else if (annotationTool === "freehand") {
      pushHistory();
      const freehandId = `freehand-${Date.now()}`;
      setIsDrawing(true);
      setCurrentAnnotation({
        id: freehandId,
        type: 'freehand',
        startX: x,
        startY: y,
        color: annotationColor
      });
      // Start with first point
      const newAnnotation = {
        id: freehandId,
        type: 'freehand',
        x: x,
        y: y,
        color: annotationColor,
        points: [{x, y}]
      };
      setAnnotations(prev => [...prev, newAnnotation]);
    } else if (["line", "circle", "rectangle"].includes(annotationTool)) {
      pushHistory();
      setIsDrawing(true);
      setCurrentAnnotation({
        id: `${annotationTool}-${Date.now()}`,
        type: annotationTool,
        startX: x,
        startY: y,
        color: annotationColor
      });
    }
  };

  const handleContinueDrawing = (x: number, y: number) => {
    if (isDrawing && currentAnnotation) {
      if (currentAnnotation.type === "freehand") {
        // Add point to existing freehand path
        setAnnotations(prev => {
          return prev.map(ann => {
            if (ann.id === currentAnnotation.id) {
              return {
                ...ann,
                points: [...(ann.points || []), {x, y}]
              };
            }
            return ann;
          });
        });
      } else {
        // Update the current annotation with end coordinates for shapes
        const updatedAnnotation = {
          id: currentAnnotation.id,
          type: currentAnnotation.type,
          x: currentAnnotation.startX,
          y: currentAnnotation.startY,
          endX: x,
          endY: y,
          color: currentAnnotation.color
        };
        
        // Update the annotation in the array
        setAnnotations(prev => {
          const filtered = prev.filter(ann => ann.id !== currentAnnotation.id);
          return [...filtered, updatedAnnotation];
        });
      }
    } else if (isDragging && dragStart && (selectedAnnotation || selectedAnnotations.length > 0)) {
      // Handle dragging selected annotation(s)
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      setAnnotations(prev => {
        return prev.map(ann => {
          // Check if this annotation is selected (either single or multiple selection)
          const isSelected = selectedAnnotation === ann.id || selectedAnnotations.includes(ann.id);
          
          if (isSelected) {
            return {
              ...ann,
              x: ann.x + deltaX,
              y: ann.y + deltaY,
              endX: ann.endX ? ann.endX + deltaX : undefined,
              endY: ann.endY ? ann.endY + deltaY : undefined,
              points: ann.points ? ann.points.map(p => ({
                x: p.x + deltaX,
                y: p.y + deltaY
              })) : undefined
            };
          }
          return ann;
        });
      });
      
      setDragStart({x, y});
    } else if (isSelecting && selectionRect) {
      // Update selection rectangle
      setSelectionRect(prev => prev ? {
        ...prev,
        endX: x,
        endY: y
      } : null);
    }
  };

  const handleEndDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setCurrentAnnotation(null);
    } else if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
    } else if (isSelecting && selectionRect) {
      // Complete selection rectangle and find annotations within it
      const rectX1 = Math.min(selectionRect.startX, selectionRect.endX);
      const rectX2 = Math.max(selectionRect.startX, selectionRect.endX);
      const rectY1 = Math.min(selectionRect.startY, selectionRect.endY);
      const rectY2 = Math.max(selectionRect.startY, selectionRect.endY);
      
      const selectedAnnotations = annotations.filter(ann => {
        if (ann.type === 'text') {
          const textWidth = (ann.content?.length || 0) * 8;
          return ann.x >= rectX1 && ann.x + textWidth <= rectX2 && 
                 ann.y >= rectY1 && ann.y + 20 <= rectY2;
        } else if (ann.type === 'line') {
          const lineX1 = Math.min(ann.x, ann.endX || ann.x);
          const lineX2 = Math.max(ann.x, ann.endX || ann.x);
          const lineY1 = Math.min(ann.y, ann.endY || ann.y);
          const lineY2 = Math.max(ann.y, ann.endY || ann.y);
          return lineX1 >= rectX1 && lineX2 <= rectX2 && lineY1 >= rectY1 && lineY2 <= rectY2;
        } else if (ann.type === 'circle' || ann.type === 'rectangle') {
          const shapeX1 = Math.min(ann.x, ann.endX || ann.x);
          const shapeX2 = Math.max(ann.x, ann.endX || ann.x);
          const shapeY1 = Math.min(ann.y, ann.endY || ann.y);
          const shapeY2 = Math.max(ann.y, ann.endY || ann.y);
          return shapeX1 >= rectX1 && shapeX2 <= rectX2 && shapeY1 >= rectY1 && shapeY2 <= rectY2;
        } else if (ann.type === 'freehand' && ann.points && ann.points.length > 0) {
          // Use bounding box of the freehand path
          const xs = ann.points.map(p => p.x);
          const ys = ann.points.map(p => p.y);
          const fhX1 = Math.min(...xs);
          const fhX2 = Math.max(...xs);
          const fhY1 = Math.min(...ys);
          const fhY2 = Math.max(...ys);
          return fhX1 >= rectX1 && fhX2 <= rectX2 && fhY1 >= rectY1 && fhY2 <= rectY2;
        }
        return false;
      });
      
      console.log('Selection rectangle completed. Found annotations:', selectedAnnotations.length);
      
      // Set the selected annotations for dragging
      setSelectedAnnotations(selectedAnnotations.map(ann => ann.id));
      setSelectedAnnotation(null); // Clear single selection
      
      setIsSelecting(false);
      setSelectionRect(null);
    }
  };


  // Sync search input with current patient only when currentPatient actually changes
  // (not when user is editing the searchHN field)
  React.useEffect(() => {
    if (currentPatient !== lastCurrentPatient.current) {
      setSearchHN(currentPatient);
      lastCurrentPatient.current = currentPatient;
    }
  }, [currentPatient]);

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
    { id: "freehand", name: "Freehand", icon: PenTool },
    { id: "crop", name: "Crop", icon: Crop }
  ];

  const handleSearch = async () => {
    if (!searchHN.trim()) {
      setError("Please enter a Hospital Number (HN)");
      return;
    }

    setIsLoading(true);
    setError(null);
    onPatientDataChange(null);

    try {
      // Use GET method
      const response = await ApiService.getPatientMainInfoGET(searchHN.trim());
      
      // API returns an array, so we need to get the first element
      const newPatientData = Array.isArray(response) ? response[0] : response;
      
      if (!newPatientData) {
        throw new Error('No patient data found');
      }
      
      onPatientDataChange(newPatientData);
      onPatientChange(searchHN.trim());
      console.log('✅ Patient data loaded via GET:', newPatientData);
    } catch (error) {
      console.error('❌ Patient search failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to search patient');
      onPatientChange("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex bg-card border border-border shadow-panel min-h-0">
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 border-b border-panel-border">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Patient Info */}
        {patientData && (
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
                  <Badge variant="outline" className="font-mono">{patientData.HN}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Show HN:</span>
                  <Badge variant="outline" className="font-mono">{patientData.ShowHN}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{patientData.PatName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{patientData.Age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Visit:</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {patientData.LastVisit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Visit:</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {patientData.CurrentVist}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Document Tree */}
        {currentPatient && (
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
                const isSelected = annotationTool === tool.id;
                return (
                  <Button
                    key={tool.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnnotationTool(tool.id)}
                    className={`h-8 px-3 transition-all duration-200 ${
                      isSelected 
                        ? "bg-primary text-primary-foreground shadow-lg scale-110 border-2 border-primary-foreground/20" 
                        : "hover:bg-panel hover:scale-105"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "drop-shadow-sm" : ""}`} />
                  </Button>
                );
              })}
              <Separator orientation="vertical" className="h-6 mx-2" />
              <input
                type="color"
                value={annotationColor}
                onChange={(e) => setAnnotationColor(e.target.value)}
                className="w-8 h-8 rounded border-2 border-primary/30 cursor-pointer hover:border-primary/60 transition-all duration-200 shadow-md hover:shadow-lg"
                title="Select annotation color"
              />
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button 
                variant="default" 
                size="sm" 
                className="h-8 bg-primary hover:bg-primary-hover text-primary-foreground"
                onClick={() => {
                  setShowWhiteScreen(true);
                  setSelectedDocument("white-screen");
                  setAnnotations([]); // Clear existing annotations
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                New White Screen
              </Button>
              {selectedDocument === "white-screen" && history.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={handleUndo}
                >
                  Undo
                </Button>
              )}
              <Separator orientation="vertical" className="h-6 mx-2" />
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
        <div className="flex-1">
          {selectedDocument ? (
            <div className="h-full bg-white relative overflow-hidden">
              {selectedDocument === "white-screen" ? (
                <div className="h-full w-full bg-white relative">
                  {/* Header with instructions - only show when no annotations */}
                  {annotations.length === 0 && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="text-center space-y-4 bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200">
                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700">White Screen for Writing</h3>
                          <p className="text-gray-500 text-sm">
                            Click/tap anywhere on the canvas to add annotations using the selected tool
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Current tool: <span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded">{annotationTool}</span> | Color: <span className="inline-block w-4 h-4 rounded border border-gray-300 ml-1" style={{backgroundColor: annotationColor}}></span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            💡 Select (👤): Navigate/scroll. Crop (✂️): Click to select single, drag empty space to select multiple, then drag selected items to move them. Drawing tools: Click/tap and drag to draw
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Render existing annotations */}
                  {annotations.map((annotation) => {
                    if (annotation.type === 'freehand') {
                      // Render freehand paths directly on canvas
                      return (
                        <svg
                          key={annotation.id}
                          className="absolute pointer-events-none"
                          style={{ 
                            zIndex: 5,
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          <path
                            d={`M ${annotation.points?.[0]?.x || 0} ${annotation.points?.[0]?.y || 0} ${annotation.points?.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') || ''}`}
                            stroke={annotation.color}
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      );
                    }
                    
                    return (
                      <div
                        key={annotation.id}
                        className={`absolute pointer-events-none ${
                          (selectedAnnotation === annotation.id || selectedAnnotations.includes(annotation.id)) && annotationTool === "crop" 
                            ? "ring-2 ring-blue-500 ring-opacity-50" 
                            : ""
                        }`}
                        style={{
                          left: Math.min(annotation.x, annotation.endX || annotation.x),
                          top: Math.min(annotation.y, annotation.endY || annotation.y),
                          color: annotation.color,
                          fontSize: '16px',
                          fontFamily: 'Arial, sans-serif',
                          fontWeight: 'bold',
                          zIndex: 5
                        }}
                      >
                        {annotation.type === 'text' && annotation.content}
                        {annotation.type === 'line' && (
                          <svg 
                            style={{ 
                              width: Math.abs((annotation.endX || annotation.x) - annotation.x),
                              height: Math.abs((annotation.endY || annotation.y) - annotation.y)
                            }}
                            className="absolute"
                          >
                            <line
                              x1={annotation.x < (annotation.endX || annotation.x) ? 0 : Math.abs((annotation.endX || annotation.x) - annotation.x)}
                              y1={annotation.y < (annotation.endY || annotation.y) ? 0 : Math.abs((annotation.endY || annotation.y) - annotation.y)}
                              x2={annotation.x < (annotation.endX || annotation.x) ? Math.abs((annotation.endX || annotation.x) - annotation.x) : 0}
                              y2={annotation.y < (annotation.endY || annotation.y) ? Math.abs((annotation.endY || annotation.y) - annotation.y) : 0}
                              stroke={annotation.color}
                              strokeWidth="3"
                            />
                          </svg>
                        )}
                        {annotation.type === 'circle' && (
                          <div 
                            className="border-2 rounded-full"
                            style={{ 
                              borderColor: annotation.color,
                              width: Math.abs((annotation.endX || annotation.x + 50) - annotation.x),
                              height: Math.abs((annotation.endY || annotation.y + 50) - annotation.y)
                            }}
                          />
                        )}
                        {annotation.type === 'rectangle' && (
                          <div 
                            className="border-2"
                            style={{ 
                              borderColor: annotation.color,
                              width: Math.abs((annotation.endX || annotation.x + 100) - annotation.x),
                              height: Math.abs((annotation.endY || annotation.y + 50) - annotation.y)
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Selection Rectangle */}
                  {isSelecting && selectionRect && (
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-20 pointer-events-none"
                      style={{
                        left: Math.min(selectionRect.startX, selectionRect.endX),
                        top: Math.min(selectionRect.startY, selectionRect.endY),
                        width: Math.abs(selectionRect.endX - selectionRect.startX),
                        height: Math.abs(selectionRect.endY - selectionRect.startY),
                        zIndex: 10
                      }}
                    />
                  )}
                  
                  {/* Selection Count Indicator */}
                  {annotationTool === "crop" && (selectedAnnotation || selectedAnnotations.length > 0) && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium pointer-events-none z-20">
                      {selectedAnnotation ? 1 : selectedAnnotations.length} selected
                    </div>
                  )}
                  
                  {/* Interactive Canvas Area - Full screen for drawing/text input */}
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      cursor: annotationTool === "text" ? "text" : 
                              annotationTool === "select" ? "default" : 
                              annotationTool === "crop" ? "move" : "crosshair",
                      touchAction: annotationTool === "select" ? "auto" : "none" // Allow scrolling in select mode, prevent in drawing mode
                    }}
                    onMouseDown={(e) => {
                      // Only prevent default and start drawing if not in select mode
                      if (annotationTool !== "select") {
                        e.preventDefault();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        handleStartDrawing(x, y);
                      }
                    }}
                    onMouseMove={(e) => {
                      if ((isDrawing && currentAnnotation && annotationTool !== "select") || 
                          (isDragging && (selectedAnnotation || selectedAnnotations.length > 0) && annotationTool === "crop") ||
                          (isSelecting && annotationTool === "crop")) {
                        e.preventDefault();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        handleContinueDrawing(x, y);
                      }
                    }}
                    onMouseUp={() => {
                      if (isDrawing || isDragging || isSelecting) {
                        handleEndDrawing();
                      }
                    }}
                    onMouseLeave={() => {
                      if (isDrawing || isDragging || isSelecting) {
                        handleEndDrawing();
                      }
                    }}
                    onTouchStart={(e) => {
                      // Only prevent default and start drawing if not in select mode
                      if (annotationTool !== "select") {
                        e.preventDefault();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const touch = e.touches[0];
                        const x = touch.clientX - rect.left;
                        const y = touch.clientY - rect.top;
                        handleStartDrawing(x, y);
                      }
                    }}
                    onTouchMove={(e) => {
                      if ((isDrawing && currentAnnotation && annotationTool !== "select") || 
                          (isDragging && (selectedAnnotation || selectedAnnotations.length > 0) && annotationTool === "crop") ||
                          (isSelecting && annotationTool === "crop")) {
                        e.preventDefault();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const touch = e.touches[0];
                        const x = touch.clientX - rect.left;
                        const y = touch.clientY - rect.top;
                        handleContinueDrawing(x, y);
                      }
                    }}
                    onTouchEnd={(e) => {
                      // Only prevent default if we were drawing, dragging, or selecting
                      if ((isDrawing || isDragging || isSelecting) && annotationTool !== "select") {
                        e.preventDefault();
                        handleEndDrawing();
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
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
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6">
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