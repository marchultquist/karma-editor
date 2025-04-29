
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PDFContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  numPages: number;
  setNumPages: (num: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  scale: number;
  setScale: (scale: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
  annotations: Annotation[];
  addAnnotation: (annotation: Annotation) => void;
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  isPdfLoaded: boolean;
  setIsPdfLoaded: (loaded: boolean) => void;
}

export interface Annotation {
  id: string;
  type: 'highlight' | 'comment' | 'drawing';
  pageNumber: number;
  content?: string;
  position: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  color?: string;
  points?: { x: number; y: number }[];
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export const PDFProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('cursor');
  const [isPdfLoaded, setIsPdfLoaded] = useState<boolean>(false);

  const addAnnotation = (annotation: Annotation) => {
    setAnnotations((prev) => [...prev, annotation]);
  };

  return (
    <PDFContext.Provider
      value={{
        file,
        setFile,
        numPages,
        setNumPages,
        currentPage,
        setCurrentPage,
        scale,
        setScale,
        rotation,
        setRotation,
        annotations,
        addAnnotation,
        selectedTool,
        setSelectedTool,
        isPdfLoaded,
        setIsPdfLoaded,
      }}
    >
      {children}
    </PDFContext.Provider>
  );
};

export const usePDF = (): PDFContextType => {
  const context = useContext(PDFContext);
  if (context === undefined) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
};
