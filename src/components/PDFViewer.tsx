
import React, { useRef, useEffect, useState } from 'react';
import { Page } from 'react-pdf';
import { usePDF } from '@/contexts/PDFContext';
import PDFAnnotationLayer from './PDFAnnotationLayer';
import { toast } from 'sonner';

const PDFViewer: React.FC = () => {
  const { 
    numPages, 
    currentPage, 
    setCurrentPage, 
    scale, 
    rotation, 
    selectedTool,
    annotations,
    addAnnotation
  } = usePDF();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<{x: number, y: number}[]>([]);
  const [selectionStart, setSelectionStart] = useState<{x: number, y: number} | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{x: number, y: number} | null>(null);

  // Handle page change
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onPageLoadSuccess = () => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setPageWidth(width);
    }
  };

  // Drawing and annotation handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === 'cursor') return;
    
    if (containerRef.current) {
      const { left, top } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / scale;
      const y = (e.clientY - top) / scale;

      if (selectedTool === 'highlight' || selectedTool === 'comment') {
        setSelectionStart({ x, y });
      } else if (selectedTool === 'drawing') {
        setIsDrawing(true);
        setDrawingPoints([{ x, y }]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const { left, top } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / scale;
      const y = (e.clientY - top) / scale;

      if (selectedTool === 'highlight' || selectedTool === 'comment') {
        if (selectionStart) {
          setSelectionEnd({ x, y });
        }
      } else if (selectedTool === 'drawing' && isDrawing) {
        setDrawingPoints(prev => [...prev, { x, y }]);
      }
    }
  };

  const handleMouseUp = () => {
    if (selectedTool === 'cursor') return;

    if (selectedTool === 'highlight' && selectionStart && selectionEnd) {
      const minX = Math.min(selectionStart.x, selectionEnd.x);
      const minY = Math.min(selectionStart.y, selectionEnd.y);
      const width = Math.abs(selectionEnd.x - selectionStart.x);
      const height = Math.abs(selectionEnd.y - selectionStart.y);

      if (width > 5 && height > 5) {
        addAnnotation({
          id: `highlight-${Date.now()}`,
          type: 'highlight',
          pageNumber: currentPage,
          position: {
            x: minX,
            y: minY,
            width,
            height
          },
          color: 'yellow'
        });
        toast.success('Highlight added');
      }
    } else if (selectedTool === 'comment' && selectionStart) {
      const content = prompt('Enter comment:');
      if (content) {
        addAnnotation({
          id: `comment-${Date.now()}`,
          type: 'comment',
          pageNumber: currentPage,
          content,
          position: {
            x: selectionStart.x,
            y: selectionStart.y
          }
        });
        toast.success('Comment added');
      }
    } else if (selectedTool === 'drawing' && isDrawing && drawingPoints.length > 1) {
      addAnnotation({
        id: `drawing-${Date.now()}`,
        type: 'drawing',
        pageNumber: currentPage,
        points: drawingPoints,
        position: {
          x: 0,
          y: 0
        },
        color: 'red'
      });
      toast.success('Drawing added');
    }

    setIsDrawing(false);
    setSelectionStart(null);
    setSelectionEnd(null);
    setDrawingPoints([]);
  };

  // Render temporary selection box while selecting
  const renderTemporarySelection = () => {
    if (!selectionStart || !selectionEnd) return null;

    const minX = Math.min(selectionStart.x, selectionEnd.x);
    const minY = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);

    const style = {
      left: `${minX * scale}px`,
      top: `${minY * scale}px`,
      width: `${width * scale}px`,
      height: `${height * scale}px`,
    };

    return selectedTool === 'highlight' ? (
      <div className="absolute bg-yellow-200 opacity-40 pointer-events-none" style={style} />
    ) : null;
  };

  // Render temporary drawing while drawing
  const renderTemporaryDrawing = () => {
    if (!isDrawing || drawingPoints.length < 2) return null;

    const pathData = drawingPoints.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x * scale} ${point.y * scale}`;
      }
      return `${path} L ${point.x * scale} ${point.y * scale}`;
    }, '');

    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <path d={pathData} stroke="red" strokeWidth="2" fill="none" />
      </svg>
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, numPages]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setPageWidth(width);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      className="pdf-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative min-h-full flex justify-center">
        <Page
          pageNumber={currentPage}
          scale={scale}
          rotate={rotation}
          className="pdf-page"
          onLoadSuccess={onPageLoadSuccess}
          renderAnnotationLayer={false}
          renderTextLayer={true}
        />
        
        <PDFAnnotationLayer 
          annotations={annotations.filter(a => a.pageNumber === currentPage)} 
          scale={scale}
        />
        
        {renderTemporarySelection()}
        {renderTemporaryDrawing()}
        
        {/* Page navigation controls */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="bg-white/80 backdrop-blur-sm text-primary px-4 py-2 rounded shadow hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded shadow">
            {currentPage} / {numPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= numPages}
            className="bg-white/80 backdrop-blur-sm text-primary px-4 py-2 rounded shadow hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
