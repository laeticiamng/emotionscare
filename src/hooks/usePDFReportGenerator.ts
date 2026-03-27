// @ts-nocheck
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFOptions {
  auditId?: string;
  includeGraphs?: boolean;
  includeRecommendations?: boolean;
  includeCategoryDetails?: boolean;
  reportTitle?: string;
  reportType?: 'audit' | 'violations' | 'dsar' | 'full';
}

export const usePDFReportGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generatePDF = useCallback(async (options: PDFOptions = {}) => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // Étape 1: Récupérer les données
      setProgress(20);
      const { data, error } = await supabase.functions.invoke('generate-audit-pdf', {
        body: options,
      });

      if (error) throw error;

      setProgress(40);

      // Étape 2: Créer le PDF
      const pdf = new jsPDF();
      const { reportData, metadata } = data;

      // Configuration
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // En-tête
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(metadata.title, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Généré le ${new Date(metadata.generatedAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        pageWidth / 2,
        yPosition,
        { align: 'center' }
      );

      yPosition += 15;

      setProgress(60);

      // Contenu selon le type de rapport
      if (options.reportType === 'audit' && reportData.audit) {
        yPosition = await addAuditContent(pdf, reportData, yPosition, pageWidth, margin, options);
      } else if (options.reportType === 'violations') {
        yPosition = await addViolationsContent(pdf, reportData, yPosition, pageWidth, margin);
      } else if (options.reportType === 'dsar') {
        yPosition = await addDSARContent(pdf, reportData, yPosition, pageWidth, margin);
      } else {
        yPosition = await addFullReportContent(pdf, reportData, yPosition, pageWidth, margin);
      }

      setProgress(80);

      // Pied de page sur toutes les pages
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128);
        pdf.text(
          `Page ${i} / ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        pdf.text(
          'EmotionsCare - Rapport RGPD Confidentiel',
          margin,
          pageHeight - 10
        );
      }

      setProgress(90);

      // Télécharger le PDF
      const fileName = `${metadata.reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      setProgress(100);

      toast({
        title: 'Rapport généré',
        description: `Le rapport PDF "${fileName}" a été téléchargé avec succès`,
      });

      logger.info('PDF report generated', { fileName, reportType: options.reportType }, 'GDPR');

      return pdf;
    } catch (error) {
      logger.error('Error generating PDF', { error }, 'GDPR');
      toast({
        title: 'Erreur de génération',
        description: error.message || 'Impossible de générer le rapport PDF',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, []);

  return {
    generatePDF,
    isGenerating,
    progress,
  };
};

// Fonctions auxiliaires pour ajouter du contenu

async function addAuditContent(
  pdf: jsPDF,
  data: any,
  yPos: number,
  pageWidth: number,
  margin: number,
  options: PDFOptions
): Promise<number> {
  const { audit, scores, recommendations } = data;

  // Score global
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Score de Conformité Global', margin, yPos);
  yPos += 10;

  pdf.setFontSize(48);
  pdf.setTextColor(0, 123, 255);
  pdf.text(`${audit.overall_score}/100`, pageWidth / 2, yPos + 15, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setTextColor(0);
  yPos += 30;

  // Détail par catégorie
  if (options.includeCategoryDetails && scores?.length > 0) {
    if (yPos > 200) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Détail par Catégorie', margin, yPos);
    yPos += 10;

    const tableData = scores.map((s: any) => [
      s.compliance_categories?.name || 'N/A',
      `${s.score}/100`,
      s.score >= 80 ? 'Conforme' : s.score >= 50 ? 'À améliorer' : 'Non conforme',
      s.issues_found || 0,
    ]);

    autoTable(pdf, {
      startY: yPos,
      head: [['Catégorie', 'Score', 'Statut', 'Problèmes']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255] },
      styles: { fontSize: 9 },
    });

    yPos = (pdf as any).lastAutoTable.finalY + 10;
  }

  // Recommandations
  if (options.includeRecommendations && recommendations?.length > 0) {
    if (yPos > 200) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recommandations Prioritaires', margin, yPos);
    yPos += 10;

    recommendations.slice(0, 10).forEach((rec: any, idx: number) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${idx + 1}. ${rec.title}`, margin, yPos);
      yPos += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const descLines = pdf.splitTextToSize(rec.description, pageWidth - 2 * margin);
      pdf.text(descLines, margin + 5, yPos);
      yPos += descLines.length * 5 + 3;

      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(`Priorité: ${rec.priority} | Impact: ${rec.impact}`, margin + 5, yPos);
      pdf.setTextColor(0);
      yPos += 8;
    });
  }

  return yPos;
}

async function addViolationsContent(
  pdf: jsPDF,
  data: any,
  yPos: number,
  pageWidth: number,
  margin: number
): Promise<number> {
  const { violations, stats } = data;

  // Statistiques
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Statistiques des Violations (30 derniers jours)', margin, yPos);
  yPos += 10;

  const statsData = [
    ['Total Violations', stats.total_violations || 0],
    ['Critiques', stats.critical_violations || 0],
    ['Élevées', stats.high_violations || 0],
    ['Résolues', stats.resolved_violations || 0],
  ];

  autoTable(pdf, {
    startY: yPos,
    head: [['Métrique', 'Valeur']],
    body: statsData,
    theme: 'grid',
    headStyles: { fillColor: [220, 53, 69] },
    styles: { fontSize: 10 },
  });

  yPos = (pdf as any).lastAutoTable.finalY + 15;

  // Liste des violations
  if (violations?.length > 0) {
    if (yPos > 200) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Violations Récentes', margin, yPos);
    yPos += 10;

    const violationsData = violations.slice(0, 20).map((v: any) => [
      new Date(v.detected_at).toLocaleDateString('fr-FR'),
      v.violation_type,
      v.severity,
      v.title.substring(0, 50) + (v.title.length > 50 ? '...' : ''),
      v.status,
    ]);

    autoTable(pdf, {
      startY: yPos,
      head: [['Date', 'Type', 'Sévérité', 'Description', 'Statut']],
      body: violationsData,
      theme: 'striped',
      headStyles: { fillColor: [220, 53, 69] },
      styles: { fontSize: 8 },
      columnStyles: {
        3: { cellWidth: 60 },
      },
    });

    yPos = (pdf as any).lastAutoTable.finalY + 10;
  }

  return yPos;
}

async function addDSARContent(
  pdf: jsPDF,
  data: any,
  yPos: number,
  pageWidth: number,
  margin: number
): Promise<number> {
  const { dsarRequests } = data;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Demandes DSAR', margin, yPos);
  yPos += 10;

  if (dsarRequests?.length > 0) {
    const dsarData = dsarRequests.map((req: any) => {
      const isOverdue = req.status === 'pending' && new Date(req.legal_deadline) < new Date();
      return [
        new Date(req.created_at).toLocaleDateString('fr-FR'),
        req.request_type,
        req.user_email || 'N/A',
        req.status,
        new Date(req.legal_deadline).toLocaleDateString('fr-FR') + (isOverdue ? ' ⚠️' : ''),
      ];
    });

    autoTable(pdf, {
      startY: yPos,
      head: [['Date', 'Type', 'Utilisateur', 'Statut', 'Échéance']],
      body: dsarData,
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255] },
      styles: { fontSize: 9 },
    });

    yPos = (pdf as any).lastAutoTable.finalY + 10;
  } else {
    pdf.setFontSize(10);
    pdf.text('Aucune demande DSAR enregistrée', margin, yPos);
    yPos += 10;
  }

  return yPos;
}

async function addFullReportContent(
  pdf: jsPDF,
  data: any,
  yPos: number,
  pageWidth: number,
  margin: number
): Promise<number> {
  // Audit
  if (data.audit) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Audit de Conformité', margin, yPos);
    yPos += 10;

    pdf.setFontSize(36);
    pdf.setTextColor(0, 123, 255);
    pdf.text(`${data.audit.overall_score}/100`, pageWidth / 2, yPos + 10, { align: 'center' });
    pdf.setTextColor(0);
    yPos += 25;
  }

  // Violations
  if (data.violations?.length > 0) {
    if (yPos > 200) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Violations Actives', margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${data.violations.length} violation(s) détectée(s) nécessitant une attention`, margin, yPos);
    yPos += 15;
  }

  // DSAR
  if (data.dsarRequests?.length > 0) {
    if (yPos > 240) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Demandes DSAR en Attente', margin, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${data.dsarRequests.length} demande(s) en cours de traitement`, margin, yPos);
    yPos += 10;
  }

  return yPos;
}
