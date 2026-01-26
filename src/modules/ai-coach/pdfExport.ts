/**
 * AI Coach PDF Export - Export des conversations en PDF
 * Utilise html2canvas pour la capture et génère un fichier téléchargeable
 */

import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import type { CoachSession, CoachMessage } from './types';

export interface PDFExportOptions {
  includeStats?: boolean;
  includeEmotions?: boolean;
  includeTechniques?: boolean;
  includeResources?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface PDFExportResult {
  success: boolean;
  downloadUrl?: string;
  error?: string;
  filename?: string;
}

/**
 * Générer le contenu HTML pour l'export PDF
 */
function generatePDFContent(
  session: CoachSession,
  messages: CoachMessage[],
  options: PDFExportOptions
): string {
  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  let html = `
    <div id="pdf-export-content" style="
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: white;
      color: #1a1a2e;
    ">
      <header style="
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 2px solid #e0e0e0;
      ">
        <h1 style="
          font-size: 28px;
          color: #1a1a2e;
          margin: 0 0 10px 0;
        ">🧠 Session de Coaching IA</h1>
        <p style="
          font-size: 14px;
          color: #666;
          margin: 0;
        ">
          ${formatDate(session.created_at)} • Coach ${session.coach_personality}
        </p>
      </header>
  `;

  // Section Statistiques
  if (options.includeStats) {
    html += `
      <section style="
        background: #f5f5f5;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 30px;
      ">
        <h2 style="
          font-size: 18px;
          color: #1a1a2e;
          margin: 0 0 15px 0;
        ">📊 Statistiques de la session</h2>
        <div style="
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        ">
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #4f46e5;">
              ${session.messages_count || 0}
            </div>
            <div style="font-size: 12px; color: #666;">Messages</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #10b981;">
              ${Math.round((session.session_duration || 0) / 60)}min
            </div>
            <div style="font-size: 12px; color: #666;">Durée</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">
              ${session.user_satisfaction || '-'}/5
            </div>
            <div style="font-size: 12px; color: #666;">Satisfaction</div>
          </div>
        </div>
      </section>
    `;
  }

  // Section Émotions détectées
  if (options.includeEmotions && session.emotions_detected?.length > 0) {
    html += `
      <section style="
        margin-bottom: 30px;
        padding: 20px;
        background: #fef3c7;
        border-radius: 12px;
      ">
        <h2 style="
          font-size: 18px;
          color: #92400e;
          margin: 0 0 15px 0;
        ">💭 Émotions détectées</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${session.emotions_detected.map((e: any) => `
            <span style="
              background: #fcd34d;
              color: #78350f;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 13px;
            ">${e.emotion || e}</span>
          `).join('')}
        </div>
      </section>
    `;
  }

  // Section Techniques suggérées
  if (options.includeTechniques && session.techniques_suggested?.length > 0) {
    html += `
      <section style="
        margin-bottom: 30px;
        padding: 20px;
        background: #d1fae5;
        border-radius: 12px;
      ">
        <h2 style="
          font-size: 18px;
          color: #065f46;
          margin: 0 0 15px 0;
        ">🎯 Techniques suggérées</h2>
        <ul style="margin: 0; padding-left: 20px;">
          ${session.techniques_suggested.map((t: string) => `
            <li style="
              margin-bottom: 8px;
              color: #047857;
            ">${t}</li>
          `).join('')}
        </ul>
      </section>
    `;
  }

  // Section Conversation
  html += `
    <section style="margin-bottom: 30px;">
      <h2 style="
        font-size: 18px;
        color: #1a1a2e;
        margin: 0 0 20px 0;
      ">💬 Conversation</h2>
  `;

  messages.forEach((msg) => {
    const isUser = msg.role === 'user';
    html += `
      <div style="
        display: flex;
        justify-content: ${isUser ? 'flex-end' : 'flex-start'};
        margin-bottom: 15px;
      ">
        <div style="
          max-width: 75%;
          padding: 15px 20px;
          border-radius: ${isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px'};
          background: ${isUser ? '#4f46e5' : '#f3f4f6'};
          color: ${isUser ? 'white' : '#1a1a2e'};
        ">
          <div style="font-size: 11px; opacity: 0.7; margin-bottom: 5px;">
            ${isUser ? 'Vous' : '🤖 Coach'}
          </div>
          <div style="font-size: 14px; line-height: 1.5;">
            ${msg.content}
          </div>
        </div>
      </div>
    `;
  });

  html += `</section>`;

  // Section Ressources
  if (options.includeResources && session.resources_provided?.length > 0) {
    html += `
      <section style="
        padding: 20px;
        background: #e0e7ff;
        border-radius: 12px;
        margin-bottom: 30px;
      ">
        <h2 style="
          font-size: 18px;
          color: #3730a3;
          margin: 0 0 15px 0;
        ">📚 Ressources partagées</h2>
        <ul style="margin: 0; padding-left: 20px;">
          ${session.resources_provided.map((r: any) => `
            <li style="
              margin-bottom: 8px;
              color: #4338ca;
            ">${r.title || r}</li>
          `).join('')}
        </ul>
      </section>
    `;
  }

  // Notes de session
  if (session.session_notes) {
    html += `
      <section style="
        padding: 20px;
        background: #f3f4f6;
        border-radius: 12px;
        margin-bottom: 30px;
      ">
        <h2 style="
          font-size: 18px;
          color: #1a1a2e;
          margin: 0 0 15px 0;
        ">📝 Notes</h2>
        <p style="
          margin: 0;
          color: #4b5563;
          line-height: 1.6;
        ">${session.session_notes}</p>
      </section>
    `;
  }

  // Footer
  html += `
      <footer style="
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
        color: #666;
        font-size: 12px;
      ">
        <p>Généré par EmotionsCare • ${new Date().toLocaleDateString('fr-FR')}</p>
        <p style="opacity: 0.7;">Ce document contient des informations personnelles de santé mentale.</p>
      </footer>
    </div>
  `;

  return html;
}

/**
 * Exporter une session de coaching en PDF
 */
export async function exportSessionToPDF(
  sessionId: string,
  options: PDFExportOptions = {}
): Promise<PDFExportResult> {
  try {
    // Récupérer la session
    const { data: session, error: sessionError } = await supabase
      .from('ai_coach_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return { success: false, error: 'Session non trouvée' };
    }

    // Récupérer les messages
    const { data: messages, error: messagesError } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('conversation_id', sessionId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      return { success: false, error: 'Erreur lors de la récupération des messages' };
    }

    // Générer le HTML
    const htmlContent = generatePDFContent(
      session as unknown as CoachSession,
      (messages || []).map((m) => ({
        id: m.id,
        session_id: sessionId,
        role: m.role,
        content: m.content,
        timestamp: m.created_at,
        metadata: {}
      })),
      {
        includeStats: options.includeStats ?? true,
        includeEmotions: options.includeEmotions ?? true,
        includeTechniques: options.includeTechniques ?? true,
        includeResources: options.includeResources ?? true,
        ...options
      }
    );

    // Créer un container temporaire
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    // Capturer en canvas avec html2canvas
    const pdfContent = container.querySelector('#pdf-export-content') as HTMLElement;
    const canvas = await html2canvas(pdfContent, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Nettoyer le DOM
    document.body.removeChild(container);

    // Convertir en blob et créer un lien de téléchargement
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png', 0.95);
    });

    // Créer l'URL de téléchargement
    const downloadUrl = URL.createObjectURL(blob);
    const filename = `coaching-session-${new Date().toISOString().split('T')[0]}.png`;

    // Déclencher le téléchargement automatiquement
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.click();

    return {
      success: true,
      downloadUrl,
      filename
    };

  } catch (error) {
    console.error('PDF Export Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Exporter plusieurs sessions en un rapport consolidé
 */
export async function exportMultipleSessionsReport(
  userId: string,
  options: PDFExportOptions = {}
): Promise<PDFExportResult> {
  try {
    let query = supabase
      .from('ai_coach_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options.dateRange) {
      query = query
        .gte('created_at', options.dateRange.from.toISOString())
        .lte('created_at', options.dateRange.to.toISOString());
    }

    const { data: sessions, error } = await query.limit(20);

    if (error || !sessions?.length) {
      return { success: false, error: 'Aucune session trouvée' };
    }

    // Pour les rapports multiples, on génère un résumé agrégé
    const totalSessions = sessions.length;
    const totalMessages = sessions.reduce((sum, s) => sum + (s.messages_count || 0), 0);
    const totalDuration = sessions.reduce((sum, s) => sum + (s.session_duration || 0), 0);
    const avgSatisfaction = sessions
      .filter(s => s.user_satisfaction)
      .reduce((sum, s) => sum + (s.user_satisfaction || 0), 0) / 
      (sessions.filter(s => s.user_satisfaction).length || 1);

    const allEmotions = sessions.flatMap(s => s.emotions_detected || []);
    const allTechniques = sessions.flatMap(s => s.techniques_suggested || []);

    const reportHtml = `
      <div id="pdf-export-content" style="
        font-family: 'Inter', sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        background: white;
      ">
        <header style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 28px; color: #1a1a2e;">📊 Rapport de Coaching IA</h1>
          <p style="color: #666;">${totalSessions} sessions analysées</p>
        </header>
        
        <section style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
          <h2 style="font-size: 18px; margin-bottom: 15px;">Vue d'ensemble</h2>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; text-align: center;">
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #4f46e5;">${totalSessions}</div>
              <div style="font-size: 12px; color: #666;">Sessions</div>
            </div>
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #10b981;">${totalMessages}</div>
              <div style="font-size: 12px; color: #666;">Messages</div>
            </div>
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${Math.round(totalDuration / 60)}min</div>
              <div style="font-size: 12px; color: #666;">Durée totale</div>
            </div>
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #ec4899;">${avgSatisfaction.toFixed(1)}/5</div>
              <div style="font-size: 12px; color: #666;">Satisfaction moy.</div>
            </div>
          </div>
        </section>
        
        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; margin-bottom: 15px;">💭 Émotions les plus fréquentes</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${[...new Set(allEmotions.map((e: any) => e.emotion || e))].slice(0, 10).map(e => `
              <span style="background: #fcd34d; padding: 6px 12px; border-radius: 20px; font-size: 13px;">${e}</span>
            `).join('')}
          </div>
        </section>
        
        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; margin-bottom: 15px;">🎯 Techniques suggérées</h2>
          <ul>
            ${[...new Set(allTechniques)].slice(0, 10).map((t: string) => `
              <li style="margin-bottom: 8px;">${t}</li>
            `).join('')}
          </ul>
        </section>
        
        <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
          <p>Généré par EmotionsCare • ${new Date().toLocaleDateString('fr-FR')}</p>
        </footer>
      </div>
    `;

    // Créer le container temporaire et exporter
    const container = document.createElement('div');
    container.innerHTML = reportHtml;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    const pdfContent = container.querySelector('#pdf-export-content') as HTMLElement;
    const canvas = await html2canvas(pdfContent, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    document.body.removeChild(container);

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.95);
    });

    const downloadUrl = URL.createObjectURL(blob);
    const filename = `coaching-report-${new Date().toISOString().split('T')[0]}.png`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.click();

    return { success: true, downloadUrl, filename };

  } catch (error) {
    console.error('Report Export Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}
