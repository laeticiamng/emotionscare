// @ts-nocheck
/**
 * AI Coach Module - Coaching IA personnalisé
 */

export * from './types';
export * as aiCoachService from './aiCoachService';
export { useAICoachMachine } from './useAICoachMachine';

// PDF Export
export { exportSessionToPDF, exportMultipleSessionsReport } from './pdfExport';
export { useCoachExport } from './hooks/useCoachExport';
export type { PDFExportOptions, PDFExportResult } from './pdfExport';
