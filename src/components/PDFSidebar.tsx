
import React, { useRef, useState } from 'react';
import { Page, Thumbnail } from 'react-pdf';
import { usePDF } from '@/contexts/PDFContext';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const PDFSidebar: React.FC = () => {
  const { 
    numPages, 
    currentPage, 
    setCurrentPage, 
    annotations 
  } = usePDF();
  
  const [activeTab, setActiveTab] = useState<string>('thumbnails');
  const pages = Array.from({ length: numPages }, (_, i) => i + 1);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToCurrentPage = () => {
    if (thumbnailRefs.current[currentPage - 1]) {
      thumbnailRefs.current[currentPage - 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  // Group annotations by page
  const annotationsByPage = annotations.reduce<Record<number, typeof annotations>>((acc, annotation) => {
    if (!acc[annotation.pageNumber]) {
      acc[annotation.pageNumber] = [];
    }
    acc[annotation.pageNumber].push(annotation);
    return acc;
  }, {});

  // Annotation renderer
  const renderAnnotation = (annotation: (typeof annotations)[0]) => {
    switch (annotation.type) {
      case 'highlight':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-200 mr-2"></div>
            <span>Highlight on page {annotation.pageNumber}</span>
          </div>
        );
      case 'comment':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-300 mr-2 rounded-full"></div>
            <span title={annotation.content}>
              Comment: {annotation.content?.substring(0, 20)}{annotation.content && annotation.content.length > 20 ? '...' : ''}
            </span>
          </div>
        );
      case 'drawing':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 mr-2"></div>
            <span>Drawing on page {annotation.pageNumber}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-64 bg-card border-r h-full flex flex-col">
      <Tabs defaultValue="thumbnails" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="thumbnails">Thumbnails</TabsTrigger>
          <TabsTrigger value="annotations">Annotations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="thumbnails" className="flex-1 p-2">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-1 gap-4">
              {pages.map((pageNumber) => (
                <div 
                  key={pageNumber}
                  ref={(el) => thumbnailRefs.current[pageNumber - 1] = el}
                  className={cn(
                    "thumbnail relative p-1",
                    currentPage === pageNumber && "active"
                  )}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  <Thumbnail
                    pageNumber={pageNumber}
                    width={160}
                    className="border shadow-sm"
                  />
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {pageNumber}
                  </div>
                  
                  {/* Show annotation indicators */}
                  {annotationsByPage[pageNumber] && (
                    <div className="absolute top-1 right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {annotationsByPage[pageNumber].length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="annotations" className="flex-1 p-2">
          <ScrollArea className="h-full">
            {annotations.length > 0 ? (
              <div className="space-y-4">
                {Object.entries(annotationsByPage).map(([pageNumber, pageAnnotations]) => (
                  <div key={pageNumber} className="space-y-2">
                    <h3 
                      className="font-medium text-sm cursor-pointer hover:text-primary"
                      onClick={() => {
                        setCurrentPage(Number(pageNumber));
                        setActiveTab('thumbnails');
                        setTimeout(scrollToCurrentPage, 100);
                      }}
                    >
                      Page {pageNumber} ({pageAnnotations.length} {pageAnnotations.length === 1 ? 'annotation' : 'annotations'})
                    </h3>
                    <div className="pl-2 space-y-1 text-sm border-l-2 border-muted">
                      {pageAnnotations.map((annotation) => (
                        <div 
                          key={annotation.id} 
                          className="p-1 hover:bg-secondary rounded cursor-pointer"
                          onClick={() => {
                            setCurrentPage(Number(pageNumber));
                            setActiveTab('thumbnails');
                            setTimeout(scrollToCurrentPage, 100);
                          }}
                        >
                          {renderAnnotation(annotation)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                <p>No annotations yet</p>
                <p className="mt-2">Use the toolbar to add highlights, comments, or drawings</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PDFSidebar;
