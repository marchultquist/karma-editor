
import React, { useCallback } from 'react';
import { usePDF } from '@/contexts/PDFContext';
import { Button } from '@/components/ui/button';
import { FileText, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PDFUpload: React.FC = () => {
  const { setFile } = usePDF();
  const { toast } = useToast();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file',
          variant: 'destructive',
        });
        return;
      }
      
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: 'File too large',
          description: 'Please upload a PDF file smaller than 50MB',
          variant: 'destructive',
        });
        return;
      }
      
      setFile(selectedFile);
      toast({
        title: 'File uploaded',
        description: `${selectedFile.name} is being processed`,
      });
    }
  }, [setFile, toast]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file',
          variant: 'destructive',
        });
        return;
      }
      
      setFile(droppedFile);
      toast({
        title: 'File uploaded',
        description: `${droppedFile.name} is being processed`,
      });
    }
  }, [setFile, toast]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-secondary/50">
      <div 
        className="max-w-md w-full p-8 border-2 border-dashed border-primary/30 rounded-lg flex flex-col items-center justify-center bg-card"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <FileText className="h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold text-center mb-2">Upload a PDF</h2>
        <p className="text-muted-foreground text-center mb-6">
          Drag and drop a PDF file here, or click the button below to select one
        </p>
        
        <input
          type="file"
          id="pdf-upload"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
        />
        
        <Button 
          onClick={() => document.getElementById('pdf-upload')?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Choose PDF File
        </Button>

        <p className="text-sm text-muted-foreground mt-4">
          Maximum file size: 50MB
        </p>
      </div>
      
      <div className="mt-8 max-w-md text-center">
        <h3 className="text-lg font-medium mb-2">PDF Viewer Features</h3>
        <ul className="text-muted-foreground text-sm space-y-1">
          <li>📄 View PDF documents with page navigation</li>
          <li>🔍 Zoom and rotate pages</li>
          <li>✏️ Add annotations, highlights, and comments</li>
          <li>🖌️ Draw on pages</li>
          <li>📱 Responsive design for all devices</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFUpload;
