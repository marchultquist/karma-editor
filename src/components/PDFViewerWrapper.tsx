
import React, { useEffect, useState } from 'react';
import { Document, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { usePDF } from '@/contexts/PDFContext';
import PDFToolbar from './PDFToolbar';
import PDFViewer from './PDFViewer';
import PDFSidebar from './PDFSidebar';
import PDFUpload from './PDFUpload';
import { toast } from 'sonner';

// Set worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewerWrapper: React.FC = () => {
  const { file, setNumPages, setIsPdfLoaded, isPdfLoaded } = usePDF();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsPdfLoaded(true);
    toast.success('PDF loaded successfully');
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setIsPdfLoaded(false);
    toast.error('Failed to load PDF');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <PDFToolbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <PDFSidebar />}

        <div className="flex-1 flex flex-col overflow-hidden">
          {file ? (
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="flex-1 flex flex-col"
            >
              {isPdfLoaded ? (
                <PDFViewer />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
            </Document>
          ) : (
            <PDFUpload />
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewerWrapper;
