// @ts-nocheck
import React from 'react';
import PDFExportButton from './PDFExportButton';

const ViolationPDFExport: React.FC = () => {
  return (
    <PDFExportButton
      reportType="violations"
      variant="outline"
      size="default"
    />
  );
};

export default ViolationPDFExport;
