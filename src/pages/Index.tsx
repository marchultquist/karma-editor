
import { PDFProvider } from '@/contexts/PDFContext';
import PDFViewerWrapper from '@/components/PDFViewerWrapper';

const Index = () => {
  return (
    <PDFProvider>
      <PDFViewerWrapper />
    </PDFProvider>
  );
};

export default Index;
