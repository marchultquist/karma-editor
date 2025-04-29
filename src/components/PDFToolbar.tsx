
import React from 'react';
import { usePDF } from '@/contexts/PDFContext';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw,
  Highlighter, 
  MessageSquare, 
  Pencil, 
  MousePointer, 
  Download, 
  Upload,
  File,
  Trash,
  Save
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PDFToolbarProps {
  toggleSidebar: () => void;
}

const PDFToolbar: React.FC<PDFToolbarProps> = ({ toggleSidebar }) => {
  const { 
    currentPage, 
    setCurrentPage, 
    numPages, 
    scale, 
    setScale, 
    rotation, 
    setRotation,
    selectedTool,
    setSelectedTool,
    file,
    setFile,
    isPdfLoaded
  } = usePDF();

  const handleScaleChange = (newScale: number) => {
    setScale(Math.max(0.5, Math.min(2.5, newScale)));
  };

  const handleRotationChange = (newRotation: number) => {
    setRotation((rotation + newRotation) % 360);
  };

  const handleChangePage = (delta: number) => {
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
    }
  };

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
  };

  const handleDownload = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleNewDocument = () => {
    if (confirm('Are you sure you want to start a new document? Any unsaved changes will be lost.')) {
      setFile(null);
    }
  };

  const isToolActive = (tool: string) => selectedTool === tool;

  return (
    <div className="bg-card border-b py-2 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleNewDocument}
          title="New Document"
        >
          <File className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => document.getElementById('file-upload')?.click()}
          title="Upload PDF"
        >
          <Upload className="h-4 w-4" />
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            accept=".pdf" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }} 
          />
        </Button>
        
        {isPdfLoaded && (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleDownload}
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {}}
              title="Save Changes"
            >
              <Save className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      {isPdfLoaded && (
        <>
          <div className="flex items-center space-x-2">
            <Button 
              variant={isToolActive('cursor') ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => handleToolSelect('cursor')}
              className={isToolActive('cursor') ? 'bg-secondary text-primary' : ''}
              title="Selection Tool"
            >
              <MousePointer className="h-4 w-4" />
            </Button>
            
            <Button 
              variant={isToolActive('highlight') ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => handleToolSelect('highlight')}
              className={isToolActive('highlight') ? 'bg-secondary text-primary' : ''}
              title="Highlight Tool"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
            
            <Button 
              variant={isToolActive('comment') ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => handleToolSelect('comment')}
              className={isToolActive('comment') ? 'bg-secondary text-primary' : ''}
              title="Comment Tool"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            
            <Button 
              variant={isToolActive('drawing') ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => handleToolSelect('drawing')}
              className={isToolActive('drawing') ? 'bg-secondary text-primary' : ''}
              title="Drawing Tool"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleChangePage(-1)} 
              disabled={currentPage <= 1}
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm">
              {currentPage} / {numPages}
            </span>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleChangePage(1)} 
              disabled={currentPage >= numPages}
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleScaleChange(scale - 0.1)}
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-sm min-w-[40px] text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleScaleChange(scale + 0.1)}
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleRotationChange(-90)}
              title="Rotate Counterclockwise"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleRotationChange(90)}
              title="Rotate Clockwise"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div>
            <Button 
              variant="outline" 
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                if (confirm('Are you sure you want to clear all annotations?')) {
                  // We'll implement this in the context later
                }
              }}
              title="Clear Annotations"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PDFToolbar;
