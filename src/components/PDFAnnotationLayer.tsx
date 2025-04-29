
import React from 'react';
import { usePDF } from '@/contexts/PDFContext';

interface PDFAnnotationLayerProps {
  annotations: ReturnType<typeof usePDF>['annotations'];
  scale: number;
}

const PDFAnnotationLayer: React.FC<PDFAnnotationLayerProps> = ({ annotations, scale }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {annotations.map((annotation) => {
        switch (annotation.type) {
          case 'highlight':
            return (
              <div
                key={annotation.id}
                className="highlight"
                style={{
                  left: `${annotation.position.x * scale}px`,
                  top: `${annotation.position.y * scale}px`,
                  width: `${(annotation.position.width || 0) * scale}px`,
                  height: `${(annotation.position.height || 0) * scale}px`,
                }}
              />
            );
          case 'comment':
            return (
              <div
                key={annotation.id}
                className="comment"
                style={{
                  left: `${annotation.position.x * scale}px`,
                  top: `${annotation.position.y * scale}px`,
                  transform: 'translate(-50%, -100%)',
                  marginTop: '-8px',
                }}
              >
                <p className="text-xs">{annotation.content}</p>
              </div>
            );
          case 'drawing':
            if (!annotation.points || annotation.points.length < 2) return null;
            
            const pathData = annotation.points.reduce((path, point, index) => {
              if (index === 0) {
                return `M ${point.x * scale} ${point.y * scale}`;
              }
              return `${path} L ${point.x * scale} ${point.y * scale}`;
            }, '');
            
            return (
              <svg key={annotation.id} className="absolute top-0 left-0 w-full h-full">
                <path d={pathData} stroke="red" strokeWidth="2" fill="none" />
              </svg>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default PDFAnnotationLayer;
